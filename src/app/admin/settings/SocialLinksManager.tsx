"use client";

import { useState } from "react";
import { createSocialLink, deleteSocialLink } from "@/app/actions/social";
import { Trash2, Plus, Globe, Mail, AlertCircle } from "lucide-react";
import SocialIcon from "@/components/SocialIcon";

export default function SocialLinksManager({ initialLinks }: { initialLinks: any[] }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAdding(true);
    setError(null);
    try {
      const formData = new FormData(e.currentTarget);
      const res = await createSocialLink(formData);
      if (res.success) {
        (e.target as HTMLFormElement).reset();
      } else {
        setError(res.error || "Failed to add link");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setAdding(false);
    }
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
          return (
            <div 
              key={link.id} 
              className="flex items-center justify-between p-3 rounded-xl border bg-muted/20 border-border"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center bg-primary/10 text-primary rounded-xl">
                  <SocialIcon platform={link.platform} className="w-5 h-5" />
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
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <input 
            name="platform" 
            placeholder="Platform Name (e.g. GitHub)"
            className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-border rounded-lg text-sm"
            required
          />
          <div className="space-y-1">
            <div className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800/50 border border-border rounded-lg text-xs text-muted-foreground flex items-center justify-between">
              <span>Icons automated by Brand Engine</span>
              <Globe className="w-3.5 h-3.5 opacity-40" />
            </div>
          </div>
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
