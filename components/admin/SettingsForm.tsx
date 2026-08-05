"use client";

import { useActionState } from "react";
import { Loader2, Check } from "lucide-react";
import { updateSiteSettingsAction } from "@/lib/admin/actions/settings";
import { Button } from "@/components/ui/Button";

const FIELDS: { key: string; label: string }[] = [
  { key: "site_name", label: "Sayt nomi" },
  { key: "contact_phone", label: "Telefon" },
  { key: "contact_email", label: "Email" },
  { key: "contact_telegram", label: "Telegram" },
  { key: "contact_instagram", label: "Instagram" },
  { key: "contact_facebook", label: "Facebook" },
  { key: "contact_youtube", label: "YouTube" },
  { key: "contact_address", label: "Manzil" },
];

export function SettingsForm({ values }: { values: Record<string, string> }) {
  const [state, formAction, isPending] = useActionState(updateSiteSettingsAction, undefined);

  return (
    <form action={formAction} className="mt-6 max-w-xl space-y-4">
      {FIELDS.map((field) => (
        <div key={field.key}>
          <label className="text-xs font-medium text-ink-600">{field.label}</label>
          <input
            type="text"
            name={field.key}
            defaultValue={values[field.key] ?? ""}
            className="mt-1.5 w-full rounded-xl border border-forest-900/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-forest-600 focus:outline-none"
          />
        </div>
      ))}

      {state?.error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{state.error}</p>}
      {state?.success && (
        <p className="flex items-center gap-1.5 rounded-xl bg-forest-900/[0.05] px-4 py-3 text-sm text-forest-800">
          <Check size={15} /> Saqlandi
        </p>
      )}

      <Button type="submit" size="lg" disabled={isPending}>
        {isPending ? <Loader2 size={16} className="animate-spin" /> : "Saqlash"}
      </Button>
    </form>
  );
}
