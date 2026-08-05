"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { updateUserRoleAction } from "@/lib/admin/actions/users";
import type { AppRole } from "@/types/database";

const ROLES: AppRole[] = ["user", "manager", "admin"];

export function UserRoleSelect({ userId, role }: { userId: string; role: AppRole }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <select
        defaultValue={role}
        disabled={isPending}
        onChange={(e) => {
          const next = e.target.value as AppRole;
          startTransition(async () => {
            await updateUserRoleAction(userId, next);
          });
        }}
        className="rounded-lg border border-forest-900/15 bg-cream-50 px-2.5 py-1.5 text-xs focus:border-forest-600 focus:outline-none"
      >
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      {isPending && <Loader2 size={14} className="animate-spin text-forest-600" />}
    </div>
  );
}
