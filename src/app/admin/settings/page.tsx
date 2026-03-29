import { getSettings } from "@/app/actions/settings";
import SettingsForm from "./SettingsForm";

export default async function AdminSettingsPage() {
  const settingsData = await getSettings();

  return (
    <div>
      <h1 className="text-2xl font-bold font-sans text-gray-900 dark:text-white mb-6">Site Settings</h1>
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <SettingsForm initialData={settingsData} />
      </div>
    </div>
  );
}
