"use client";

import { useActionState } from "react";
import { Loader2, Plus } from "lucide-react";
import { addGalleryItemAction } from "@/lib/admin/actions/gallery";
import { Button } from "@/components/ui/Button";

const CATEGORIES = ["nature", "food", "culture", "mountains", "events"];

export function AddGalleryItemForm() {
  const [state, formAction, isPending] = useActionState(addGalleryItemAction, undefined);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3 rounded-2xl bg-cream-50 p-5 ring-1 ring-forest-900/5">
      <div className="min-w-[220px] flex-1">
        <label className="text-xs font-medium text-ink-600">Rasm URL</label>
        <input
          type="text"
          name="url"
          required
          placeholder="https://..."
          className="mt-1.5 w-full rounded-xl border border-forest-900/15 bg-white px-3 py-2.5 text-sm focus:border-forest-600 focus:outline-none"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-ink-600">Sarlavha (ixtiyoriy)</label>
        <input
          type="text"
          name="title"
          className="mt-1.5 w-44 rounded-xl border border-forest-900/15 bg-white px-3 py-2.5 text-sm focus:border-forest-600 focus:outline-none"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-ink-600">Kategoriya</label>
        <select
          name="category"
          required
          className="mt-1.5 w-40 rounded-xl border border-forest-900/15 bg-white px-3 py-2.5 text-sm focus:border-forest-600 focus:outline-none"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
        Qo&apos;shish
      </Button>
      {state?.error && <p className="w-full text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
