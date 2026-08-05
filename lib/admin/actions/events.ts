"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

const eventSchema = z.object({
  slug: z.string().trim().min(2).regex(/^[a-z0-9-]+$/, "Faqat kichik harflar, raqamlar, tire"),
  title: z.string().trim().min(2),
  title_ru: z.string().trim().optional().or(z.literal("")),
  title_en: z.string().trim().optional().or(z.literal("")),
  description: z.string().trim().min(5),
  description_ru: z.string().trim().optional().or(z.literal("")),
  description_en: z.string().trim().optional().or(z.literal("")),
  cover_image: z.string().trim().optional().or(z.literal("")),
  start_date: z.string().min(1),
  end_date: z.string().optional().or(z.literal("")),
  location: z.string().trim().optional().or(z.literal("")),
  is_recurring_yearly: z.boolean(),
  is_published: z.boolean(),
});

function parse(formData: FormData) {
  return eventSchema.safeParse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    title_ru: formData.get("title_ru") ?? "",
    title_en: formData.get("title_en") ?? "",
    description: formData.get("description"),
    description_ru: formData.get("description_ru") ?? "",
    description_en: formData.get("description_en") ?? "",
    cover_image: formData.get("cover_image") ?? "",
    start_date: formData.get("start_date"),
    end_date: formData.get("end_date") ?? "",
    location: formData.get("location") ?? "",
    is_recurring_yearly: formData.get("is_recurring_yearly") === "on",
    is_published: formData.get("is_published") === "on",
  });
}

export async function createEventAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("events").insert({
    ...parsed.data,
    title_ru: parsed.data.title_ru || null,
    title_en: parsed.data.title_en || null,
    description_ru: parsed.data.description_ru || null,
    description_en: parsed.data.description_en || null,
    cover_image: parsed.data.cover_image || null,
    end_date: parsed.data.end_date || null,
    location: parsed.data.location || null,
  });

  if (error) return { error: error.code === "23505" ? "Bu slug band" : error.message };

  revalidatePath("/admin/events");
  revalidatePath("/events");
  redirect("/admin/events");
}

export async function updateEventAction(
  eventId: string,
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("events")
    .update({
      ...parsed.data,
      title_ru: parsed.data.title_ru || null,
      title_en: parsed.data.title_en || null,
      description_ru: parsed.data.description_ru || null,
      description_en: parsed.data.description_en || null,
      cover_image: parsed.data.cover_image || null,
      end_date: parsed.data.end_date || null,
      location: parsed.data.location || null,
    })
    .eq("id", eventId);

  if (error) return { error: error.message };

  revalidatePath("/admin/events");
  revalidatePath("/events");
  redirect("/admin/events");
}

export async function deleteEventAction(eventId: string) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("events").delete().eq("id", eventId);
  if (error) return { error: error.message };
  revalidatePath("/admin/events");
  revalidatePath("/events");
  return { success: true };
}
