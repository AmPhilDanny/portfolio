"use client";

import { useState } from "react";
import { updateSectionConfig } from "@/app/actions/sections";
import { FloppyDiskIcon as Save } from "hugeicons-react";

const SECTIONS = [
  { id: "about", defaultTitle: "About Me" },
  { id: "skills", defaultTitle: "Technical Skills" },
  { id: "services", defaultTitle: "My Services" },
  { id: "experience", defaultTitle: "Professional Experience" },
  { id: "projects", defaultTitle: "Featured Projects" },
  { id: "certifications", defaultTitle: "Certifications" },
  { id: "contact", defaultTitle: "Get In Touch" },
];

export default function SectionsForm({ initialData }: { initialData: any[] }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, sectionId: string) => {
    e.preventDefault();
    setLoading(sectionId);
    setMessages({ ...messages, [sectionId]: "" });
    
    const formData = new FormData(e.currentTarget);
    formData.append("sectionId", sectionId);
    
    const result = await updateSectionConfig(formData);
    
    if (result.success) {
      setMessages({ ...messages, [sectionId]: "Updated!" });
    } else {
      setMessages({ ...messages, [sectionId]: "Failed." });
    }
    setLoading(null);
  };

  return (
    <div className="space-y-8">
      {SECTIONS.map((section) => {
        const config = initialData.find(c => c.sectionId === section.id);
        return (
          <div key={section.id} className="p-6 bg-white dark:bg-zinc-900/50 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold capitalize">{section.id} Section Header</h3>
              {messages[section.id] && (
                <span className={`text-sm ${messages[section.id] === 'Updated!' ? 'text-green-600' : 'text-red-600'}`}>
                  {messages[section.id]}
                </span>
              )}
            </div>
            
            <form onSubmit={(e) => handleSubmit(e, section.id)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Title</label>
                <input 
                  type="text" 
                  name="title"
                  defaultValue={config?.title || section.defaultTitle}
                  className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description / Subtitle</label>
                <textarea 
                  name="description"
                  defaultValue={config?.description || ""}
                  className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm resize-none"
                  rows={2}
                />
              </div>
              <button 
                type="submit"
                disabled={loading === section.id}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {loading === section.id ? "Saving..." : "Save Header"}
              </button>
            </form>
          </div>
        );
      })}
    </div>
  );
}
