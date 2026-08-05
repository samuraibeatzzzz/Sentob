"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { BlogPostRow } from "@/types/database";

type ActionFn = (
  prevState: { error?: string } | undefined,
  formData: FormData
) => Promise<{ error?: string } | undefined>;

export function BlogPostForm({ action, defaultValues }: { action: ActionFn; defaultValues?: BlogPostRow }) {
  const [state, formAction, isPending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="mt-6 max-w-2xl space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Slug" name="slug" defaultValue={defaultValues?.slug} required />
        <Field label="Muallif" name="author_name" defaultValue={defaultValues?.author_name ?? "Sentob jamoasi"} required />
      </div>

      <Field label="Sarlavha" name="title" defaultValue={defaultValues?.title} required />
      <TextArea label="Qisqacha (excerpt)" name="excerpt" defaultValue={defaultValues?.excerpt ?? ""} rows={2} />
      <TextArea label="Matn" name="content" defaultValue={defaultValues?.content} required rows={10} />

      <Field label="Muqova rasm URL" name="cover_image" defaultValue={defaultValues?.cover_image ?? ""} />

      <div className="grid grid-cols-2 gap-4">
        <Field label="Meta title (SEO)" name="meta_title" defaultValue={defaultValues?.meta_title ?? ""} />
        <Field label="Meta description (SEO)" name="meta_description" defaultValue={defaultValues?.meta_description ?? ""} />
      </div>

      <label className="flex items-center gap-2 text-sm text-ink-600">
        <input
          type="checkbox"
          name="is_published"
          defaultChecked={defaultValues?.is_published ?? false}
          className="h-4 w-4 rounded border-forest-900/20"
        />
        Chop etish
      </label>

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
      <input
        type="text"
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
  rows = 4,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  rows?: number;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-ink-600">{label}</label>
      <textarea
        name={name}
        defaultValue={defaultValue}
        required={required}
        rows={rows}
        className="mt-1.5 w-full rounded-xl border border-forest-900/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-forest-600 focus:outline-none"
      />
    </div>
  );
}
