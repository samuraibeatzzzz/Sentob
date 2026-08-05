"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { EventRow } from "@/types/database";

type ActionFn = (
  prevState: { error?: string } | undefined,
  formData: FormData
) => Promise<{ error?: string } | undefined>;

export function EventForm({ action, defaultValues }: { action: ActionFn; defaultValues?: EventRow }) {
  const [state, formAction, isPending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="mt-6 max-w-2xl space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Slug" name="slug" defaultValue={defaultValues?.slug} required />
        <Field label="Sarlavha (UZ)" name="title" defaultValue={defaultValues?.title} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Sarlavha (RU)" name="title_ru" defaultValue={defaultValues?.title_ru ?? ""} />
        <Field label="Sarlavha (EN)" name="title_en" defaultValue={defaultValues?.title_en ?? ""} />
      </div>

      <TextArea label="Tavsif (UZ)" name="description" defaultValue={defaultValues?.description} required />

      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Boshlanish sanasi"
          name="start_date"
          type="date"
          defaultValue={defaultValues?.start_date}
          required
        />
        <Field
          label="Tugash sanasi (ixtiyoriy)"
          name="end_date"
          type="date"
          defaultValue={defaultValues?.end_date ?? ""}
        />
      </div>

      <Field label="Joylashuv" name="location" defaultValue={defaultValues?.location ?? ""} />
      <Field label="Muqova rasm URL" name="cover_image" defaultValue={defaultValues?.cover_image ?? ""} />

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-ink-600">
          <input
            type="checkbox"
            name="is_recurring_yearly"
            defaultChecked={defaultValues?.is_recurring_yearly ?? false}
            className="h-4 w-4 rounded border-forest-900/20"
          />
          Har yili takrorlanadi
        </label>
        <label className="flex items-center gap-2 text-sm text-ink-600">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={defaultValues?.is_published ?? true}
            className="h-4 w-4 rounded border-forest-900/20"
          />
          Chop etilgan
        </label>
      </div>

      {state?.error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{state.error}</p>}

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
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-ink-600">{label}</label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        required={required}
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
        rows={4}
        className="mt-1.5 w-full rounded-xl border border-forest-900/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-forest-600 focus:outline-none"
      />
    </div>
  );
}
