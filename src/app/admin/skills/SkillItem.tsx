"use client";
import React, { useState } from "react";
import { Delete02Icon, PencilEdit01Icon, CodeSquareIcon } from "hugeicons-react";
import { deleteSkillCategory } from "@/app/actions/skills";
import SkillsForm from "./SkillsForm";

export default function SkillItem({ cat }: { cat: any }) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <div className="p-5 rounded-xl border transition-all" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <h3 className="font-bold text-sm mb-4 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
          Edit Skill Category
          <span className="px-2 py-0.5 text-[10px] bg-primary/10 text-primary rounded-full uppercase font-bold">Editing</span>
        </h3>
        <SkillsForm 
          initialData={cat} 
          onSuccess={() => setIsEditing(false)} 
          onCancel={() => setIsEditing(false)} 
        />
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl border flex justify-between items-start gap-3 transition-all hover:border-primary/30"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <CodeSquareIcon className="w-4 h-4 shrink-0" style={{ color: "var(--primary)" }} />
          <h3 className="font-bold text-sm" style={{ color: "var(--foreground)" }}>{cat.category}</h3>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(cat.skills as string[]).map((s: string) => (
            <span key={s} className="code-badge">{s}</span>
          ))}
        </div>
      </div>
      <div className="flex gap-1 shrink-0">
        <button 
          onClick={() => setIsEditing(true)}
          className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          title="Edit Category"
        >
          <PencilEdit01Icon className="w-4 h-4" />
        </button>
        <form action={async () => { if(confirm("Delete category?")) await deleteSkillCategory(cat.id); }}>
          <button type="submit" className="p-2 rounded-lg transition-colors text-red-500 hover:bg-red-500/10">
            <Delete02Icon className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
