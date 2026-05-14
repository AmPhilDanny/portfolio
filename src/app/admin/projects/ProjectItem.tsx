"use client";
import React, { useState } from "react";
import { Trash2, Share2 } from "lucide-react";
import { deleteProject } from "@/app/actions/projects";
import SocialShareModal from "@/components/SocialShareModal";

export default function ProjectItem({ project }: { project: any }) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

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
        <p className="text-sm text-zinc-500 truncate max-w-[250px]">{project.description}</p>
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
          <Share2 className="w-5 h-5" />
        </button>
        <form action={async () => { if(confirm("Delete project?")) await deleteProject(project.id); }}>
          <button type="submit" className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
