import { z } from "zod";

export const bookingSchema = z
  .object({
    guestHouseId: z.string().uuid(),
    guestName: z.string().trim().min(2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak"),
    guestPhone: z
      .string()
      .trim()
      .regex(/^\+?[0-9\s-]{9,15}$/, "Telefon raqami noto'g'ri formatda"),
    guestEmail: z.string().trim().email("Email noto'g'ri formatda").optional().or(z.literal("")),
    checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Sana noto'g'ri formatda"),
    checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Sana noto'g'ri formatda"),
    guests: z.number().int().min(1, "Kamida 1 mehmon").max(20),
    rooms: z.number().int().min(1, "Kamida 1 xona").max(10),
    notes: z.string().trim().max(500).optional().or(z.literal("")),
  })
  .refine((data) => new Date(data.checkOut) > new Date(data.checkIn), {
    message: "Chiqish sanasi kirish sanasidan keyin bo'lishi kerak",
    path: ["checkOut"],
  });

export type BookingFormValues = z.infer<typeof bookingSchema>;
