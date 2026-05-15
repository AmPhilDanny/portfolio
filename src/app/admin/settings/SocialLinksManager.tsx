"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSocialLink, deleteSocialLink, updateSocialLink } from "@/app/actions/social";
import { Trash2, Plus, Globe, Mail, AlertCircle, Edit2, Check, X as CloseIcon } from "lucide-react";
import SocialIcon from "@/components/SocialIcon";

export default function SocialLinksManager({ initialLinks }: { initialLinks: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateManual = async (id: string, formData: FormData) => {
    setLoading(id);
    setError(null);
    try {
      const res = await updateSocialLink(id, formData);
      if (res.success) {
        setEditingId(null);
        router.refresh();
      } else {
        setError(res.error || "Update failed");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this link?")) return;
    setLoading(id);
    await deleteSocialLink(id);
    setLoading(null);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Dynamic Social Links</h3>
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Appears in footer</p>
      </div>

      <div className="grid gap-3">
        {initialLinks.map((link) => (
          <div 
            key={link.id} 
            className={`p-3 rounded-2xl border transition-all ${
              editingId === link.id ? 'border-primary bg-primary/5' : 'bg-muted/20 border-border'
            }`}
          >
            {editingId === link.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    id={`platform-${link.id}`}
                    defaultValue={link.platform}
                    placeholder="Platform Name"
                    className="px-3 py-1.5 bg-white dark:bg-zinc-900 border border-border rounded-lg text-sm"
                    required
                  />
                  <div className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 border border-border rounded-lg text-[10px] text-zinc-500 flex items-center justify-between">
                    <span>Auto-Icon</span>
                    <SocialIcon platform={link.platform} className="w-3 h-3" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="url" 
                    id={`url-${link.id}`}
                    defaultValue={link.url}
                    placeholder="https://..." 
                    className="flex-1 px-3 py-1.5 bg-white dark:bg-zinc-900 border border-border rounded-lg text-sm"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => {
                      const platform = (document.getElementById(`platform-${link.id}`) as HTMLInputElement).value;
                      const url = (document.getElementById(`url-${link.id}`) as HTMLInputElement).value;
                      const formData = new FormData();
                      formData.append("platform", platform);
                      formData.append("url", url);
                      handleUpdateManual(link.id, formData);
                    }}
                    disabled={loading === link.id} 
                    className="p-1.5 bg-primary text-white rounded-lg hover:opacity-90 transition-all"
                  >
                    {loading === link.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  </button>
                  <button type="button" onClick={() => setEditingId(null)} className="p-1.5 border border-border rounded-lg hover:bg-muted transition-all">
                    <CloseIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-primary/10 text-primary rounded-xl">
                    <SocialIcon platform={link.platform} className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{link.platform}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[150px] md:max-w-[250px]">{link.url}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setEditingId(link.id)}
                    className="p-2 text-zinc-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(link.id)}
                    disabled={loading === link.id}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 rounded-2xl border border-dashed border-border bg-muted/5 space-y-4">
        <p className="text-xs font-bold uppercase text-muted-foreground">Add New Social Link</p>
        
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <input 
            id="new-platform"
            placeholder="Platform Name (e.g. GitHub)"
            className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-border rounded-lg text-sm"
            required
          />
          <div className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800/50 border border-border rounded-lg text-[10px] text-muted-foreground flex items-center justify-between">
            <span>Icons automated by Brand Engine</span>
            <Globe className="w-3.5 h-3.5 opacity-40" />
          </div>
        </div>
        <div className="flex gap-2">
          <input 
            type="url" 
            id="new-url"
            placeholder="https://..." 
            className="flex-1 px-3 py-2 bg-white dark:bg-zinc-900 border border-border rounded-lg text-sm"
            required
          />
          <button 
            type="button"
            onClick={async () => {
              const platformInput = document.getElementById("new-platform") as HTMLInputElement;
              const urlInput = document.getElementById("new-url") as HTMLInputElement;
              if (!platformInput.value || !urlInput.value) {
                setError("Platform and URL are required");
                return;
              }
              setAdding(true);
              setError(null);
              const formData = new FormData();
              formData.append("platform", platformInput.value);
              formData.append("url", urlInput.value);
              const res = await createSocialLink(formData);
              if (res.success) {
                platformInput.value = "";
                urlInput.value = "";
                router.refresh();
              } else {
                setError(res.error || "Failed to add link");
              }
              setAdding(false);
            }}
            disabled={adding}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            {adding ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Loader2({ className }: { className?: string }) {
  return (
    <svg 
      className={`animate-spin ${className}`} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}
