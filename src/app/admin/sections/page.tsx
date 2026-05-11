import { getSectionConfigs } from "@/app/actions/sections";
import SectionsForm from "./SectionsForm";

export default async function AdminSectionsPage() {
  const configs = await getSectionConfigs();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Section Customization</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Customize the titles and descriptions for each main section of your portfolio.
        </p>
      </div>
      
      <SectionsForm initialData={configs} />
    </div>
  );
}
