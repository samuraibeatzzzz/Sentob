"use client";

import { useTransition } from "react";
import { Check, X, Loader2, RotateCcw } from "lucide-react";
import { updateBookingStatusAction } from "@/lib/admin/actions/bookings";
import type { BookingStatus } from "@/types/database";

export function BookingActions({ bookingId, status }: { bookingId: string; status: BookingStatus }) {
  const [isPending, startTransition] = useTransition();

  function updateStatus(next: BookingStatus) {
    startTransition(async () => {
      await updateBookingStatusAction(bookingId, next);
    });
  }

  if (isPending) {
    return <Loader2 size={16} className="animate-spin text-forest-600" />;
  }

  if (status === "pending") {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateStatus("confirmed")}
          className="flex items-center gap-1 rounded-full bg-forest-700 px-3 py-1.5 text-xs font-medium text-cream-50 hover:bg-forest-800"
        >
          <Check size={13} /> Tasdiqlash
        </button>
        <button
          onClick={() => updateStatus("cancelled")}
          className="flex items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
        >
          <X size={13} /> Bekor qilish
        </button>
      </div>
    );
  }

  if (status === "confirmed") {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateStatus("completed")}
          className="rounded-full bg-forest-900/[0.06] px-3 py-1.5 text-xs font-medium text-forest-800 hover:bg-forest-900/10"
        >
          Yakunlandi deb belgilash
        </button>
        <button
          onClick={() => updateStatus("cancelled")}
          className="flex items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
        >
          <X size={13} /> Bekor qilish
        </button>
      </div>
    );
  }

  if (status === "cancelled") {
    return (
      <button
        onClick={() => updateStatus("pending")}
        className="flex items-center gap-1 rounded-full bg-forest-900/[0.06] px-3 py-1.5 text-xs font-medium text-forest-800 hover:bg-forest-900/10"
      >
        <RotateCcw size={13} /> Qayta tiklash
      </button>
    );
  }

  return null;
}
