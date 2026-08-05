"use client";

import { useTransition } from "react";
import { Trash2, Loader2, Eye, EyeOff } from "lucide-react";
import { toggleGalleryPublishedAction, deleteGalleryItemAction } from "@/lib/admin/actions/gallery";

export function GalleryItemActions({ id, isPublished }: { id: string; isPublished: boolean }) {
  const [isPending, startTransition] = useTransition();

  if (isPending) return <Loader2 size={14} className="animate-spin text-forest-600" />;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => startTransition(async () => { await toggleGalleryPublishedAction(id, !isPublished); })}
        className="text-forest-700 hover:text-forest-900"
        aria-label="Ko'rsatish/yashirish"
      >
        {isPublished ? <Eye size={15} /> : <EyeOff size={15} />}
      </button>
      <button
        onClick={() => {
          if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
          startTransition(async () => { await deleteGalleryItemAction(id); });
        }}
        className="text-red-600 hover:text-red-700"
        aria-label="O'chirish"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
