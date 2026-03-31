import { getHero } from "@/app/actions/hero";
import HeroForm from "./HeroForm";

/**
 * AdminHeroPage: Manages the 'Hero' section (landing identity).
 * Fetches the current hero record from the database and renders 
 * the HeroForm for live updates.
 */
export default async function AdminHeroPage() {
  const heroData = await getHero();

  return (

    <div>
      <h1 className="text-2xl font-bold font-sans text-gray-900 dark:text-white mb-6">Manage Hero Section</h1>
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <HeroForm initialData={heroData} />
      </div>
    </div>
  );
}
