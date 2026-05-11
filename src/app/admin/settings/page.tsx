import { getSettings } from "@/app/actions/settings";
import { getSocialLinks } from "@/app/actions/social";
import SettingsForm from "./SettingsForm";

export default async function AdminSettingsPage() {
  const settingsData = await getSettings();
  const socials = await getSocialLinks();

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Global Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your site branding, theme colors, and social connections.</p>
      </div>
      
      <SettingsForm initialData={settingsData} socials={socials} />
    </div>
  );
}
