"use client";
import { useState } from "react";
import { Trash2, Pencil, Layers } from "lucide-react";
import { deleteService } from "@/app/actions/services";
import ServicesForm from "./ServicesForm";

export default function ServiceItem({ svc }: { svc: any }) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <div className="p-5 rounded-xl border transition-all" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <h3 className="font-bold text-sm mb-4 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
          Edit Service
          <span className="code-badge text-[10px]">EDITING</span>
        </h3>
        <ServicesForm 
          initialData={svc} 
          onSuccess={() => setIsEditing(false)} 
          onCancel={() => setIsEditing(false)} 
        />
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl border flex justify-between items-start gap-3"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Layers className="w-4 h-4 shrink-0" style={{ color: "var(--primary)" }} />
          <h3 className="font-bold text-sm" style={{ color: "var(--foreground)" }}>{svc.title}</h3>
          {svc.icon && <span className="code-badge ml-auto">{svc.icon}</span>}
        </div>
        <div 
          className="text-xs line-clamp-2 prose prose-sm dark:prose-invert max-w-none" 
          style={{ color: "var(--muted-foreground)" }}
          dangerouslySetInnerHTML={{ __html: svc.description }}
        />
      </div>
      <div className="flex gap-1 shrink-0">
        <button 
          type="button"
          onClick={() => setIsEditing(true)}
          className="p-2 rounded-lg transition-colors text-blue-500 hover:bg-blue-500/10"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <form action={async () => { await deleteService(svc.id); }}>
          <button type="submit" className="p-2 rounded-lg transition-colors text-red-500 hover:bg-red-500/10">
            <Trash2 className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
