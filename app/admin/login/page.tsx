import { Mountain, ShieldAlert } from "lucide-react";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = {
  title: "Admin kirish | Sentob",
  robots: { index: false, follow: false },
};

const ERROR_MESSAGES: Record<string, string> = {
  forbidden: "Bu hisobda admin panelga kirish huquqi yo'q.",
  session_expired: "Sessiya muddati tugadi. Qaytadan kiring.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string; error?: string }>;
}) {
  const params = await searchParams;
  const errorMessage = params.error ? ERROR_MESSAGES[params.error] : undefined;

  return (
    <div className="flex min-h-screen items-center justify-center bg-forest-950 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2">
          <Mountain size={26} strokeWidth={1.75} className="text-gold-400" />
          <span className="font-display text-xl font-semibold text-cream-50">SENTOB</span>
        </div>

        <div className="rounded-3xl bg-cream-50 p-8 shadow-2xl">
          <h1 className="font-display text-2xl font-medium text-forest-950">Admin panel</h1>
          <p className="mt-1 text-sm text-ink-600">Boshqaruv paneliga kirish</p>

          {errorMessage && (
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
              <ShieldAlert size={15} className="mt-0.5 shrink-0" />
              {errorMessage}
            </p>
          )}

          <LoginForm redirectTo={params.redirectTo} />
        </div>

        <p className="mt-6 text-center text-xs text-cream-100/50">
          Sentob Turizm Qishlog&apos;i — Admin panel
        </p>
      </div>
    </div>
  );
}
