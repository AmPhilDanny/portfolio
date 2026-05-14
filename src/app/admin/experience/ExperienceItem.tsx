"use client";
import { useState } from "react";
import { Trash2, Pencil, Share2 } from "lucide-react";
import { deleteExperience } from "@/app/actions/experience";
import ExperienceForm from "./ExperienceForm";
import SocialShareModal from "@/components/SocialShareModal";

export default function ExperienceItem({ exp }: { exp: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  if (isEditing) {
    return (
      <div className="p-6 rounded-2xl border transition-all" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
          Edit Experience
          <span className="code-badge text-[10px]">EDITING</span>
        </h3>
        <ExperienceForm 
          initialData={exp} 
          onSuccess={() => setIsEditing(false)} 
          onCancel={() => setIsEditing(false)} 
        />
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl border transition-all tech-card-glow"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}>
      
      <SocialShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={`${exp.role} at ${exp.company}`}
        content={exp.description}
        type="experience"
      />

      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-bold text-lg" style={{ color: "var(--foreground)" }}>{exp.role}</h3>
            <span className="code-badge">{exp.period}</span>
          </div>
          <p className="font-semibold text-primary mb-3">{exp.company}</p>
          <div 
            className="text-sm mb-4 leading-relaxed prose prose-sm dark:prose-invert max-w-none" 
            style={{ color: "var(--muted-foreground)" }}
            dangerouslySetInnerHTML={{ __html: exp.description }}
          />
          <div className="space-y-2">
            <p className="text-[10px] uppercase font-bold tracking-widest text-primary/60">Key Achievements</p>
            <ul className="grid grid-cols-1 gap-2">
              {(exp.achievements as string[]).map((ach: string, i: number) => (
                <li key={i} className="text-xs flex items-start gap-2" style={{ color: "var(--foreground)" }}>
                  <span className="text-primary font-mono select-none">→</span>
                  {ach}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <button 
            type="button" 
            onClick={() => setIsShareModalOpen(true)}
            title="Generate Social Post"
            className="p-2 rounded-lg transition-colors text-purple-500 hover:bg-purple-500/10 group"
          >
            <Share2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          </button>
          <button 
            type="button" 
            onClick={() => setIsEditing(true)}
            className="p-2 rounded-lg transition-colors text-blue-500 hover:bg-blue-500/10 group"
          >
            <Pencil className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
          <form action={async () => { await deleteExperience(exp.id); }}>
            <button type="submit" className="p-2 rounded-lg transition-colors text-red-500 hover:bg-red-500/10 group">
              <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
