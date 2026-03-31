import { getProjects, deleteProject } from "@/app/actions/projects";
import ProjectForm from "./ProjectForm";
import { Trash2 } from "lucide-react";

/**
 * AdminProjectsPage: Central hub for portfolio work management.
 * - Displays a real-time list of projects from the database.
 * - Provides a 'ProjectForm' for creating new entries.
 * - Includes inline delete functionality for project removal.
 */
export default async function AdminProjectsPage() {
  const projectsList = await getProjects();

  return (

    <div>
      <h1 className="text-2xl font-bold font-sans text-gray-900 dark:text-white mb-6">Manage Projects</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <h2 className="text-lg font-bold mb-4">Add New Project</h2>
          <ProjectForm />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold mb-4">Existing Projects</h2>
          {projectsList.length === 0 ? (
            <p className="text-gray-500">No projects added yet. Fallback data will be shown on the live site.</p>
          ) : (
            projectsList.map((project: any) => (
              <div key={project.id} className="p-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-xl flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{project.title}</h3>
                  <p className="text-sm text-gray-500 truncate max-w-[200px]">{project.description}</p>
                </div>
                <form action={async () => {
                  "use server";
                  await deleteProject(project.id);
                }}>
                  <button type="submit" className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </form>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
