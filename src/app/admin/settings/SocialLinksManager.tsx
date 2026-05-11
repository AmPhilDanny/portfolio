"use client";

import { useState } from "react";
import { createSocialLink, deleteSocialLink } from "@/app/actions/social";
import { Trash2, Plus, Globe, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon, FacebookIcon, KaggleIcon } from "@/components/Icons";
import DynamicIcon from "@/components/DynamicIcon";

const PLATFORM_ICONS: Record<string, any> = {
  Github: GithubIcon,
  GitHub: GithubIcon,
  LinkedIn: LinkedinIcon,
  Linkedin: LinkedinIcon,
  Twitter: TwitterIcon,
  X: TwitterIcon,
  Instagram: InstagramIcon,
  Facebook: FacebookIcon,
  Kaggle: KaggleIcon,
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
          const BrandIcon = PLATFORM_ICONS[link.icon || link.platform];
          return (
            <div 
              key={link.id} 
              className="flex items-center justify-between p-3 rounded-xl border bg-muted/20 border-border"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  {BrandIcon ? (
                    <BrandIcon className="w-4 h-4" />
                  ) : (
                    <DynamicIcon name={(link.icon?.toLowerCase() || "globe") as any} className="w-4 h-4" />
                  )}
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
          <input 
            name="platform" 
            placeholder="Platform Name (e.g. GitHub)"
            className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-border rounded-lg text-sm"
            required
          />
          <div className="space-y-1">
            <input 
              name="icon" 
              placeholder="Icon name (e.g. Github)"
              className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-border rounded-lg text-sm"
              required
            />
            <div className="flex justify-between px-1">
              <span className="text-[10px] text-muted-foreground">Lucide or Brand name</span>
              <a href="https://lucide.dev/icons" target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:underline">Lucide Icons</a>
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
