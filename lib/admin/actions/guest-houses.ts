"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { guestHouseFormSchema } from "@/lib/admin/schemas/guest-house";

function parseFormData(formData: FormData) {
  return guestHouseFormSchema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    name_ru: formData.get("name_ru") ?? "",
    name_en: formData.get("name_en") ?? "",
    description: formData.get("description"),
    description_ru: formData.get("description_ru") ?? "",
    description_en: formData.get("description_en") ?? "",
    address: formData.get("address") ?? "",
    price_per_night: formData.get("price_per_night"),
    max_guests: formData.get("max_guests"),
    rooms: formData.get("rooms"),
    amenities: formData.get("amenities") ?? "",
    cover_image: formData.get("cover_image") ?? "",
    is_active: formData.get("is_active") === "on",
  });
}

export async function createGuestHouseAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireAdmin();

  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ma'lumotlar noto'g'ri" };
  }

  const supabase = createSupabaseAdminClient();
  const amenitiesArray = parsed.data.amenities
    ? parsed.data.amenities.split(",").map((a) => a.trim()).filter(Boolean)
    : [];

  const { error } = await supabase.from("guest_houses").insert({
    slug: parsed.data.slug,
    name: parsed.data.name,
    name_ru: parsed.data.name_ru || null,
    name_en: parsed.data.name_en || null,
    description: parsed.data.description,
    description_ru: parsed.data.description_ru || null,
    description_en: parsed.data.description_en || null,
    address: parsed.data.address || null,
    price_per_night: parsed.data.price_per_night,
    max_guests: parsed.data.max_guests,
    rooms: parsed.data.rooms,
    amenities: amenitiesArray,
    cover_image: parsed.data.cover_image || null,
    images: parsed.data.cover_image ? [parsed.data.cover_image] : [],
    is_active: parsed.data.is_active,
  });

  if (error) {
    return { error: error.code === "23505" ? "Bu slug allaqachon mavjud" : error.message };
  }

  revalidatePath("/admin/guest-houses");
  revalidatePath("/guest-houses");
  redirect("/admin/guest-houses");
}

export async function updateGuestHouseAction(
  guestHouseId: string,
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireAdmin();

  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ma'lumotlar noto'g'ri" };
  }

  const supabase = createSupabaseAdminClient();
  const amenitiesArray = parsed.data.amenities
    ? parsed.data.amenities.split(",").map((a) => a.trim()).filter(Boolean)
    : [];

  const { error } = await supabase
    .from("guest_houses")
    .update({
      slug: parsed.data.slug,
      name: parsed.data.name,
      name_ru: parsed.data.name_ru || null,
      name_en: parsed.data.name_en || null,
      description: parsed.data.description,
      description_ru: parsed.data.description_ru || null,
      description_en: parsed.data.description_en || null,
      address: parsed.data.address || null,
      price_per_night: parsed.data.price_per_night,
      max_guests: parsed.data.max_guests,
      rooms: parsed.data.rooms,
      amenities: amenitiesArray,
      cover_image: parsed.data.cover_image || null,
      is_active: parsed.data.is_active,
    })
    .eq("id", guestHouseId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/guest-houses");
  revalidatePath("/guest-houses");
  revalidatePath(`/guest-houses/${parsed.data.slug}`);
  redirect("/admin/guest-houses");
}

export async function toggleGuestHouseActiveAction(guestHouseId: string, isActive: boolean) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("guest_houses")
    .update({ is_active: isActive })
    .eq("id", guestHouseId);

  if (error) return { error: error.message };

  revalidatePath("/admin/guest-houses");
  revalidatePath("/guest-houses");
  return { success: true };
}

export async function deleteGuestHouseAction(guestHouseId: string) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("guest_houses").delete().eq("id", guestHouseId);

  if (error) return { error: error.message };

  revalidatePath("/admin/guest-houses");
  revalidatePath("/guest-houses");
  return { success: true };
}
