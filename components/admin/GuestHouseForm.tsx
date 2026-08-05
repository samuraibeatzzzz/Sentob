"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { GuestHouseRow } from "@/types/database";

type ActionFn = (
  prevState: { error?: string } | undefined,
  formData: FormData
) => Promise<{ error?: string } | undefined>;

export function GuestHouseForm({
  action,
  defaultValues,
}: {
  action: ActionFn;
  defaultValues?: GuestHouseRow;
}) {
  const [state, formAction, isPending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="mt-6 max-w-2xl space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Slug (URL)" name="slug" defaultValue={defaultValues?.slug} placeholder="masalan: green-hill-house" required />
        <Field label="Nomi (UZ)" name="name" defaultValue={defaultValues?.name} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nomi (RU)" name="name_ru" defaultValue={defaultValues?.name_ru ?? ""} />
        <Field label="Nomi (EN)" name="name_en" defaultValue={defaultValues?.name_en ?? ""} />
      </div>

      <TextArea label="Tavsif (UZ)" name="description" defaultValue={defaultValues?.description} required />
      <div className="grid grid-cols-2 gap-4">
        <TextArea label="Tavsif (RU)" name="description_ru" defaultValue={defaultValues?.description_ru ?? ""} />
        <TextArea label="Tavsif (EN)" name="description_en" defaultValue={defaultValues?.description_en ?? ""} />
      </div>

      <Field label="Manzil" name="address" defaultValue={defaultValues?.address ?? ""} />

      <div className="grid grid-cols-3 gap-4">
        <Field
          label="Narxi (kecha uchun)"
          name="price_per_night"
          type="number"
          defaultValue={defaultValues?.price_per_night?.toString()}
          required
        />
        <Field
          label="Maks. mehmonlar"
          name="max_guests"
          type="number"
          defaultValue={defaultValues?.max_guests?.toString() ?? "2"}
          required
        />
        <Field
          label="Xonalar soni"
          name="rooms"
          type="number"
          defaultValue={defaultValues?.rooms?.toString() ?? "1"}
          required
        />
      </div>

      <Field
        label="Qulayliklar (vergul bilan ajrating)"
        name="amenities"
        defaultValue={defaultValues?.amenities?.join(", ") ?? ""}
        placeholder="Wi-Fi, Nonushta, Bepul parkovka"
      />

      <Field
        label="Muqova rasm URL"
        name="cover_image"
        defaultValue={defaultValues?.cover_image ?? ""}
        placeholder="https://..."
      />

      <label className="flex items-center gap-2 text-sm text-ink-600">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={defaultValues?.is_active ?? true}
          className="h-4 w-4 rounded border-forest-900/20"
        />
        Faol (saytda ko&apos;rinadi)
      </label>

      {state?.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{state.error}</p>
      )}

      <Button type="submit" size="lg" disabled={isPending}>
        {isPending ? <Loader2 size={16} className="animate-spin" /> : "Saqlash"}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-ink-600">{label}</label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        step={type === "number" ? "any" : undefined}
        className="mt-1.5 w-full rounded-xl border border-forest-900/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-forest-600 focus:outline-none"
      />
    </div>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-ink-600">{label}</label>
      <textarea
        name={name}
        defaultValue={defaultValue}
        required={required}
        rows={3}
        className="mt-1.5 w-full rounded-xl border border-forest-900/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-forest-600 focus:outline-none"
      />
    </div>
  );
}
