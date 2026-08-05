"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteBlogPostAction } from "@/lib/admin/actions/blog";

export function BlogRowActions({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  if (isPending) return <Loader2 size={15} className="animate-spin text-forest-600" />;

  return (
    <button
      onClick={() => {
        if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
        startTransition(async () => {
          await deleteBlogPostAction(id);
        });
      }}
      className="text-red-600 hover:text-red-700"
      aria-label="O'chirish"
    >
      <Trash2 size={15} />
    </button>
  );
}
