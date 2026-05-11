"use client";

import { useState } from "react";
import { createSocialLink, deleteSocialLink } from "@/app/actions/social";
import { Trash2, Plus, Github, Linkedin, Twitter, Instagram, Facebook, Globe, Mail } from "lucide-react";

const PLATFORM_ICONS: Record<string, any> = {
  Github: Github,
  GitHub: Github,
  LinkedIn: Linkedin,
  Linkedin: Linkedin,
  Twitter: Twitter,
  X: Twitter,
  Instagram: Instagram,
  Facebook: Facebook,
  Kaggle: Globe,
};

export default function SocialLinksManager({ initialLinks }: { initialLinks: any[] }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAdding(true);
    const formData = new FormData(e.currentTarget);
    await createSocialLink(formData);
    setAdding(false);
    (e.target as HTMLFormElement).reset();
  };

  const handleDelete = async (id: string) => {
    setLoading(id);
    await deleteSocialLink(id);
    setLoading(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Dynamic Social Links</h3>
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Appears in footer</p>
      </div>

      <div className="grid gap-3">
        {initialLinks.map((link) => {
          const Icon = PLATFORM_ICONS[link.icon || link.platform] || Globe;
          return (
            <div 
              key={link.id} 
              className="flex items-center justify-between p-3 rounded-xl border bg-muted/20 border-border"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold">{link.platform}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[150px] md:max-w-[250px]">{link.url}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(link.id)}
                disabled={loading === link.id}
                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleAdd} className="p-4 rounded-xl border border-dashed border-border bg-muted/5 space-y-4">
        <p className="text-xs font-bold uppercase text-muted-foreground">Add New Social Link</p>
        <div className="grid grid-cols-2 gap-3">
          <select 
            name="platform" 
            className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-border rounded-lg text-sm"
            required
          >
            <option value="">Platform...</option>
            <option value="GitHub">GitHub</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="X">X (Twitter)</option>
            <option value="Instagram">Instagram</option>
            <option value="Facebook">Facebook</option>
            <option value="Kaggle">Kaggle</option>
            <option value="Website">Personal Website</option>
          </select>
          <select 
            name="icon" 
            className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-border rounded-lg text-sm"
            required
          >
            <option value="Globe">Default Icon</option>
            <option value="Github">Github Icon</option>
            <option value="Linkedin">Linkedin Icon</option>
            <option value="Twitter">Twitter Icon</option>
            <option value="Instagram">Instagram Icon</option>
            <option value="Facebook">Facebook Icon</option>
            <option value="Kaggle">Kaggle Icon</option>
          </select>
        </div>
        <div className="flex gap-2">
          <input 
            type="url" 
            name="url" 
            placeholder="https://..." 
            className="flex-1 px-3 py-2 bg-white dark:bg-zinc-900 border border-border rounded-lg text-sm"
            required
          />
          <button 
            type="submit"
            disabled={adding}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            {adding ? "Adding..." : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}
