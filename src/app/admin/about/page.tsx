import { getAbout } from "@/app/actions/about";
import AboutForm from "./AboutForm";

export default async function AdminAboutPage() {
  const aboutData = await getAbout();

  return (
    <div>
      <h1 className="text-2xl font-bold font-sans text-gray-900 dark:text-white mb-6">Manage About Section</h1>
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <AboutForm initialData={aboutData} />
      </div>
    </div>
  );
}
