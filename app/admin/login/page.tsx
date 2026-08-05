import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = {
  title: "Admin kirish | Sentob",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-forest-950 px-4">
      <div className="w-full max-w-sm rounded-3xl bg-cream-50 p-8 shadow-2xl">
        <h1 className="font-display text-2xl font-medium text-forest-950">Admin panel</h1>
        <p className="mt-1 text-sm text-ink-600">Sentob boshqaruv paneliga kirish</p>

        {params.error === "forbidden" && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            Bu hisobda admin panelga kirish huquqi yo&apos;q.
          </p>
        )}

        <LoginForm redirectTo={params.redirectTo} />
      </div>
    </div>
  );
}
