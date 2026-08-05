import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { bookingSchema } from "@/lib/booking/schema";
import { calculateTotalPrice } from "@/lib/booking/calculate-price";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov formati" }, { status: 400 });
  }

  const idempotencyKey =
    request.headers.get("Idempotency-Key") ??
    (typeof body === "object" && body !== null && "idempotencyKey" in body
      ? String((body as Record<string, unknown>).idempotencyKey)
      : null);

  if (!idempotencyKey) {
    return NextResponse.json({ error: "Idempotency-Key talab qilinadi" }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Ma'lumotlar noto'g'ri", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const data = parsed.data;
  const supabase = createSupabaseAdminClient();

  // If this idempotency key was already used, return the existing booking
  // instead of creating a duplicate (handles client retries / double-clicks).
  const { data: existing } = await supabase
    .from("bookings")
    .select("*")
    .eq("idempotency_key", idempotencyKey)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ booking: existing }, { status: 200 });
  }

  // Never trust a client-submitted price: re-read the guest house and
  // recompute the total on the server.
  const { data: guestHouse, error: guestHouseError } = await supabase
    .from("guest_houses")
    .select("id, price_per_night, max_guests, is_active")
    .eq("id", data.guestHouseId)
    .maybeSingle();

  if (guestHouseError || !guestHouse || !guestHouse.is_active) {
    return NextResponse.json({ error: "Mehmon uyi topilmadi" }, { status: 404 });
  }

  if (data.guests > guestHouse.max_guests * data.rooms) {
    return NextResponse.json(
      { error: `Bu mehmon uyi maksimal ${guestHouse.max_guests} mehmonni qabul qiladi (xona boshiga)` },
      { status: 422 }
    );
  }

  const { nights, totalPrice } = calculateTotalPrice({
    pricePerNight: guestHouse.price_per_night,
    checkIn: data.checkIn,
    checkOut: data.checkOut,
    rooms: data.rooms,
  });

  if (nights < 1) {
    return NextResponse.json({ error: "Kamida 1 kechalik band qilish kerak" }, { status: 422 });
  }

  const { data: booking, error: insertError } = await supabase
    .from("bookings")
    .insert({
      guest_house_id: guestHouse.id,
      guest_name: data.guestName,
      guest_phone: data.guestPhone,
      guest_email: data.guestEmail || null,
      check_in: data.checkIn,
      check_out: data.checkOut,
      guests: data.guests,
      rooms: data.rooms,
      price_per_night: guestHouse.price_per_night,
      total_price: totalPrice,
      idempotency_key: idempotencyKey,
      notes: data.notes || null,
    })
    .select()
    .single();

  if (insertError) {
    // Postgres exclusion constraint violation -> overlapping dates
    if (insertError.code === "23P01") {
      return NextResponse.json(
        { error: "Tanlangan sanalarda bu mehmon uyi allaqachon band qilingan" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Band qilishda xatolik yuz berdi" }, { status: 500 });
  }

  return NextResponse.json({ booking }, { status: 201 });
}
