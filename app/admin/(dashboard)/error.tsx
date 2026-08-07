"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin dashboard error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl bg-cream-50 p-10 text-center ring-1 ring-forest-900/5">
      <AlertTriangle size={32} className="text-amber-500" />
      <h2 className="mt-4 font-display text-xl font-medium text-forest-950">
        Nimadir noto&apos;g&apos;ri ketdi
      </h2>
      <p className="mt-2 max-w-md text-sm text-ink-600">
        Sahifani yuklashda xatolik yuz berdi. Internet aloqasini tekshiring va qayta urinib
        ko&apos;ring. Muammo davom etsa, administratorga murojaat qiling.
      </p>
      <Button onClick={reset} className="mt-6">
        <RotateCcw size={15} /> Qayta urinish
      </Button>
    </div>
  );
}
