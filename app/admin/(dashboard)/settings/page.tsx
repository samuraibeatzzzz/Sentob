import { getSiteSettings } from "@/lib/admin/actions/settings";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const values = await getSiteSettings();

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-forest-950">Settings</h1>
      <p className="mt-1 text-sm text-ink-600">
        Sayt nomi va aloqa ma&apos;lumotlarini boshqarish.
      </p>
      <SettingsForm values={values} />
    </div>
  );
}
