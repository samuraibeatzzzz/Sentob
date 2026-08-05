"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, Users, BedDouble, Loader2, CheckCircle2 } from "lucide-react";
import { bookingSchema, type BookingFormValues } from "@/lib/booking/schema";
import { calculateTotalPrice } from "@/lib/booking/calculate-price";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Button } from "@/components/ui/Button";

type Props = {
  guestHouseId: string;
  pricePerNight: number;
  maxGuests: number;
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function BookingForm({ guestHouseId, pricePerNight, maxGuests }: Props) {
  const { dict, locale } = useLanguage();
  const numberFormat = new Intl.NumberFormat(locale === "uz" ? "uz-UZ" : locale);
  const [idempotencyKey, setIdempotencyKey] = useState<string>("");
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    setIdempotencyKey(crypto.randomUUID());
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      guestHouseId,
      guestName: "",
      guestPhone: "",
      guestEmail: "",
      checkIn: todayISO(),
      checkOut: tomorrowISO(),
      guests: 2,
      rooms: 1,
      notes: "",
    },
  });

  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");
  const rooms = watch("rooms") || 1;

  const priceEstimate = useMemo(() => {
    if (!checkIn || !checkOut) return null;
    try {
      return calculateTotalPrice({ pricePerNight, checkIn, checkOut, rooms: Number(rooms) });
    } catch {
      return null;
    }
  }, [checkIn, checkOut, rooms, pricePerNight]);

  async function onSubmit(values: BookingFormValues) {
    setSubmitState("loading");
    setServerError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey,
        },
        body: JSON.stringify({ ...values, idempotencyKey }),
      });

      const json = await res.json();

      if (!res.ok) {
        setServerError(json.error || "Xatolik yuz berdi");
        setSubmitState("error");
        return;
      }

      setSubmitState("success");
      reset();
      setIdempotencyKey(crypto.randomUUID());
    } catch {
      setServerError("Tarmoq xatoligi. Qaytadan urinib ko'ring.");
      setSubmitState("error");
    }
  }

  if (submitState === "success") {
    return (
      <div className="rounded-3xl bg-forest-800 p-8 text-center text-cream-50">
        <CheckCircle2 className="mx-auto mb-3 text-gold-400" size={36} />
        <h3 className="font-display text-xl font-medium">So&apos;rovingiz qabul qilindi</h3>
        <p className="mt-2 text-sm text-cream-100/80">
          Tez orada operatorlarimiz siz bilan bog&apos;lanib, band qilishni tasdiqlaydi.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => setSubmitState("idle")}>
          Yana bir joy band qilish
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-3xl bg-cream-100/70 p-6 ring-1 ring-forest-900/5 sm:p-8"
    >
      <h3 className="font-display text-xl font-medium text-forest-950">{dict.guestHouses.book}</h3>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-ink-600">
            <CalendarDays size={13} /> Check In
          </label>
          <input
            type="date"
            {...register("checkIn")}
            className="mt-1.5 w-full rounded-xl border border-forest-900/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-forest-600 focus:outline-none"
          />
          {errors.checkIn && <p className="mt-1 text-xs text-red-600">{errors.checkIn.message}</p>}
        </div>
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-ink-600">
            <CalendarDays size={13} /> Check Out
          </label>
          <input
            type="date"
            {...register("checkOut")}
            className="mt-1.5 w-full rounded-xl border border-forest-900/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-forest-600 focus:outline-none"
          />
          {errors.checkOut && <p className="mt-1 text-xs text-red-600">{errors.checkOut.message}</p>}
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-ink-600">
            <Users size={13} /> Guests
          </label>
          <input
            type="number"
            min={1}
            max={maxGuests * 10}
            {...register("guests", { valueAsNumber: true })}
            className="mt-1.5 w-full rounded-xl border border-forest-900/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-forest-600 focus:outline-none"
          />
          {errors.guests && <p className="mt-1 text-xs text-red-600">{errors.guests.message}</p>}
        </div>
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-ink-600">
            <BedDouble size={13} /> Rooms
          </label>
          <input
            type="number"
            min={1}
            max={10}
            {...register("rooms", { valueAsNumber: true })}
            className="mt-1.5 w-full rounded-xl border border-forest-900/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-forest-600 focus:outline-none"
          />
          {errors.rooms && <p className="mt-1 text-xs text-red-600">{errors.rooms.message}</p>}
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <label className="text-xs font-medium text-ink-600">Ism familiya</label>
          <input
            type="text"
            {...register("guestName")}
            placeholder="Ismingiz"
            className="mt-1.5 w-full rounded-xl border border-forest-900/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-forest-600 focus:outline-none"
          />
          {errors.guestName && <p className="mt-1 text-xs text-red-600">{errors.guestName.message}</p>}
        </div>
        <div>
          <label className="text-xs font-medium text-ink-600">Telefon</label>
          <input
            type="tel"
            {...register("guestPhone")}
            placeholder="+998 90 123 45 67"
            className="mt-1.5 w-full rounded-xl border border-forest-900/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-forest-600 focus:outline-none"
          />
          {errors.guestPhone && <p className="mt-1 text-xs text-red-600">{errors.guestPhone.message}</p>}
        </div>
        <div>
          <label className="text-xs font-medium text-ink-600">Email (ixtiyoriy)</label>
          <input
            type="email"
            {...register("guestEmail")}
            placeholder="email@example.com"
            className="mt-1.5 w-full rounded-xl border border-forest-900/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-forest-600 focus:outline-none"
          />
          {errors.guestEmail && <p className="mt-1 text-xs text-red-600">{errors.guestEmail.message}</p>}
        </div>
      </div>

      {priceEstimate && (
        <div className="mt-6 flex items-center justify-between rounded-2xl bg-forest-900/[0.04] px-4 py-3">
          <span className="text-sm text-ink-600">
            {priceEstimate.nights} kecha × {rooms} xona
          </span>
          <span className="font-display text-lg font-semibold text-forest-800">
            {numberFormat.format(priceEstimate.totalPrice)} so&apos;m
          </span>
        </div>
      )}

      {serverError && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{serverError}</p>
      )}

      <Button
        type="submit"
        size="lg"
        className="mt-6 w-full"
        disabled={isSubmitting || submitState === "loading" || !idempotencyKey}
      >
        {submitState === "loading" ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Yuborilmoqda...
          </>
        ) : (
          dict.guestHouses.book
        )}
      </Button>
    </form>
  );
}
