"use client";
import React, { useState } from "react";
import { Delete02Icon, Share01Icon, PencilEdit01Icon } from "hugeicons-react";
import { deleteProject } from "@/app/actions/projects";
import SocialShareModal from "@/components/SocialShareModal";
import ProjectForm from "./ProjectForm";

export default function ProjectItem({ project }: { project: any }) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl transition-all">
        <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
          Edit Project
          <span className="px-2 py-0.5 text-[10px] bg-primary/10 text-primary rounded-full uppercase font-bold">Editing</span>
        </h3>
        <ProjectForm 
          initialData={project} 
          onSuccess={() => setIsEditing(false)} 
          onCancel={() => setIsEditing(false)} 
        />
      </div>
    );
  }

  return (
    <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex justify-between items-center transition-all hover:border-primary/30 group">
      <SocialShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={project.title}
        content={project.description}
        type="project"
      />

      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-zinc-900 dark:text-white group-hover:text-primary transition-colors">{project.title}</h3>
        <div 
          className="text-sm text-zinc-500 truncate max-w-[250px]"
          dangerouslySetInnerHTML={{ __html: project.description }}
        />
        <div className="flex gap-1.5 mt-2">
           {project.tags?.slice(0, 3).map((tag: string) => (
             <span key={tag} className="text-[9px] font-bold uppercase px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-400">
               {tag}
             </span>
           ))}
        </div>
      </div>
      
      <div className="flex items-center gap-1 shrink-0 ml-4">
        <button 
          onClick={() => setIsShareModalOpen(true)}
          className="p-2 text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
          title="Share on Socials"
        >
          <Share01Icon className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setIsEditing(true)}
          className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          title="Edit Project"
        >
          <PencilEdit01Icon className="w-5 h-5" />
        </button>
        <form action={async () => { if(confirm("Delete project?")) await deleteProject(project.id); }}>
          <button type="submit" className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
            <Delete02Icon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
