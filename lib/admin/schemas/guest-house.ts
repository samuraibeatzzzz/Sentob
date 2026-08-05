import { z } from "zod";

export const guestHouseFormSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Faqat kichik lotin harflari, raqamlar va tire (-)"),
  name: z.string().trim().min(2),
  name_ru: z.string().trim().optional().or(z.literal("")),
  name_en: z.string().trim().optional().or(z.literal("")),
  description: z.string().trim().min(10),
  description_ru: z.string().trim().optional().or(z.literal("")),
  description_en: z.string().trim().optional().or(z.literal("")),
  address: z.string().trim().optional().or(z.literal("")),
  price_per_night: z.coerce.number().min(0),
  max_guests: z.coerce.number().int().min(1),
  rooms: z.coerce.number().int().min(1),
  amenities: z.string().optional().or(z.literal("")), // comma-separated in the form
  cover_image: z.string().trim().optional().or(z.literal("")),
  is_active: z.boolean().default(true),
});

export type GuestHouseFormValues = z.infer<typeof guestHouseFormSchema>;
