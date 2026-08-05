import { getAllProfilesAdmin } from "@/lib/admin/queries";
import { requireAdmin } from "@/lib/auth/require-admin";
import { UserRoleSelect } from "@/components/admin/UserRoleSelect";

export default async function AdminUsersPage() {
  const { profile: currentAdmin } = await requireAdmin();
  const profiles = await getAllProfilesAdmin();

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-forest-950">Users</h1>
      <p className="mt-1 text-sm text-ink-600">
        Foydalanuvchilar va ularning rollarini boshqarish. Faqat <strong>admin</strong> rolidagi
        foydalanuvchilar rollarni o&apos;zgartira oladi.
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-cream-50 ring-1 ring-forest-900/5">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="border-b border-forest-900/10 text-xs uppercase tracking-wide text-ink-600">
              <th className="px-5 py-3 font-medium">Ism</th>
              <th className="px-5 py-3 font-medium">Telefon</th>
              <th className="px-5 py-3 font-medium">Ro&apos;yxatdan o&apos;tgan</th>
              <th className="px-5 py-3 font-medium">Rol</th>
            </tr>
          </thead>
          <tbody>
            {profiles.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-ink-600">
                  Hozircha foydalanuvchilar yo&apos;q.
                </td>
              </tr>
            )}
            {profiles.map((p) => (
              <tr key={p.id} className="border-b border-forest-900/5 last:border-0">
                <td className="px-5 py-4 font-medium text-forest-950">
                  {p.full_name || "—"}
                  {p.id === currentAdmin.id && (
                    <span className="ml-2 rounded-full bg-forest-900/[0.06] px-2 py-0.5 text-[10px] text-forest-700">
                      Siz
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 text-ink-600">{p.phone || "—"}</td>
                <td className="px-5 py-4 text-ink-600">
                  {new Date(p.created_at).toLocaleDateString("uz-UZ")}
                </td>
                <td className="px-5 py-4">
                  {currentAdmin.role === "admin" ? (
                    <UserRoleSelect userId={p.id} role={p.role} />
                  ) : (
                    <span className="text-xs text-ink-600">{p.role}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
