import { getProjects, deleteProject } from "@/app/actions/projects";
import ProjectForm from "./ProjectForm";
import ProjectItem from "./ProjectItem";
import { Delete02Icon as Trash2 } from "hugeicons-react";

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
            <div className="space-y-3">
              {projectsList.map((project: any) => (
                <ProjectItem key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
