import { requireAdmin } from "@/lib/auth/require-admin";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { email } = await requireAdmin();

  return (
    <div className="flex min-h-screen bg-cream-100/50">
      <AdminSidebar email={email} />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
