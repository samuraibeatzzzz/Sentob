"use client";

import { useActionState } from "react";
import { Loader2, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { signInAction, type LoginState } from "@/lib/admin/actions/login";
import { Button } from "@/components/ui/Button";

const initialState: LoginState = {};

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [state, formAction, isPending] = useActionState(signInAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="mt-6 space-y-4" noValidate>
      <input type="hidden" name="redirectTo" value={redirectTo || "/admin"} />

      <div>
        <label htmlFor="email" className="text-xs font-medium text-ink-600">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          disabled={isPending}
          className="mt-1.5 w-full rounded-xl border border-forest-900/15 bg-white px-3 py-2.5 text-sm focus:border-forest-600 focus:outline-none disabled:opacity-60"
        />
      </div>

      <div>
        <label htmlFor="password" className="text-xs font-medium text-ink-600">
          Parol
        </label>
        <div className="relative mt-1.5">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            disabled={isPending}
            className="w-full rounded-xl border border-forest-900/15 bg-white px-3 py-2.5 pr-10 text-sm focus:border-forest-600 focus:outline-none disabled:opacity-60"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-600 hover:text-forest-800"
            aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {state.error && (
        <p className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertTriangle size={15} className="mt-0.5 shrink-0" />
          <span>
            {state.error}
            {typeof state.attemptsRemaining === "number" && state.attemptsRemaining > 0 && (
              <span className="mt-1 block text-xs text-red-500">
                Qolgan urinishlar: {state.attemptsRemaining}
              </span>
            )}
          </span>
        </p>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={isPending}>
        {isPending ? <Loader2 size={16} className="animate-spin" /> : "Kirish"}
      </Button>
    </form>
  );
}
