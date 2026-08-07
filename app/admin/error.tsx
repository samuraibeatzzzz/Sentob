"use client";

import { useEffect } from "react";
import { Mountain, AlertTriangle } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin panel error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-forest-950 px-4 text-center">
      <div className="mb-6 flex items-center gap-2">
        <Mountain size={26} strokeWidth={1.75} className="text-gold-400" />
        <span className="font-display text-xl font-semibold text-cream-50">SENTOB</span>
      </div>

      <div className="w-full max-w-sm rounded-3xl bg-cream-50 p-8 shadow-2xl">
        <AlertTriangle size={28} className="mx-auto text-amber-500" />
        <h1 className="mt-4 font-display text-xl font-medium text-forest-950">
          Admin panel yuklanmadi
        </h1>
        <p className="mt-2 text-sm text-ink-600">
          Bu odatda Supabase muhit o&apos;zgaruvchilari (<code className="text-xs">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
          <code className="text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>) sozlanmaganida yuz beradi.
          Bularni <code className="text-xs">.env.local</code> faylida tekshiring.
        </p>
        <button
          onClick={reset}
          className="mt-6 w-full rounded-full bg-forest-800 px-6 py-3 text-sm font-medium text-cream-50 hover:bg-forest-700"
        >
          Qayta urinish
        </button>
      </div>
    </div>
  );
}
