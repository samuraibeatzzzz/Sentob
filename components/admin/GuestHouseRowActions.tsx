"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import {
  toggleGuestHouseActiveAction,
  deleteGuestHouseAction,
} from "@/lib/admin/actions/guest-houses";
import { cn } from "@/lib/utils";

export function GuestHouseRowActions({ id, isActive }: { id: string; isActive: boolean }) {
  const [isPending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      await toggleGuestHouseActiveAction(id, !isActive);
    });
  }

  function remove() {
    if (!confirm("Bu mehmon uyini o'chirishni tasdiqlaysizmi?")) return;
    startTransition(async () => {
      await deleteGuestHouseAction(id);
    });
  }

  if (isPending) return <Loader2 size={16} className="animate-spin text-forest-600" />;

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={toggle}
        className={cn(
          "rounded-full px-3 py-1.5 text-xs font-medium",
          isActive ? "bg-forest-900/[0.06] text-forest-800" : "bg-amber-50 text-amber-700"
        )}
      >
        {isActive ? "Faol" : "Nofaol"}
      </button>
      <button onClick={remove} className="text-red-600 hover:text-red-700" aria-label="O'chirish">
        <Trash2 size={16} />
      </button>
    </div>
  );
}
