"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError("Email yoki parol noto'g'ri");
      setLoading(false);
      return;
    }

    router.replace(redirectTo || "/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div>
        <label className="text-xs font-medium text-ink-600">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-forest-900/15 bg-white px-3 py-2.5 text-sm focus:border-forest-600 focus:outline-none"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-ink-600">Parol</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-forest-900/15 bg-white px-3 py-2.5 text-sm focus:border-forest-600 focus:outline-none"
        />
      </div>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? <Loader2 size={16} className="animate-spin" /> : "Kirish"}
      </Button>
    </form>
  );
}
