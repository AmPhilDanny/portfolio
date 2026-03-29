"use client";
import { useState } from "react";
import { updateSettings } from "@/app/actions/settings";
import { Save } from "lucide-react";

export default function SettingsForm({ initialData }: { initialData: any }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState("");
  const [logoUrl, setLogoUrl] = useState(initialData?.logoUrl || "");
  const [faviconUrl, setFaviconUrl] = useState(initialData?.faviconUrl || "");

  const handleUpload = async (file: File, type: "logo" | "favicon") => {
    setUploading(type);
    const res = await fetch(`/api/upload?filename=${file.name}`, { method: 'POST', body: file });
    const newBlob = await res.json();
    if (newBlob.url) {
      if (type === "logo") setLogoUrl(newBlob.url);
      else setFaviconUrl(newBlob.url);
    }
    setUploading("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const result = await updateSettings(new FormData(e.currentTarget));
    setMessage(result.success ? "Settings saved successfully." : "Failed to save settings.");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && <div className={`p-3 rounded-lg text-sm ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>}
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Logo Upload (Navigation Bar)</label>
          <input type="file" accept="image/*" onChange={(e) => e.target.files && handleUpload(e.target.files[0], "logo")} className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-lg" />
          <input type="hidden" name="logoUrl" value={logoUrl} />
          {logoUrl && <p className="text-sm mt-1 text-green-600 truncate">Current: {logoUrl}</p>}
          {uploading === "logo" && <p className="text-sm mt-1 text-blue-600 animate-pulse">Uploading...</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Favicon Upload (Browser Tab)</label>
          <input type="file" accept="image/*" onChange={(e) => e.target.files && handleUpload(e.target.files[0], "favicon")} className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-lg" />
          <input type="hidden" name="faviconUrl" value={faviconUrl} />
          {faviconUrl && <p className="text-sm mt-1 text-green-600 truncate">Current: {faviconUrl}</p>}
          {uploading === "favicon" && <p className="text-sm mt-1 text-blue-600 animate-pulse">Uploading...</p>}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-800 grid md:grid-cols-2 gap-6 pt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GitHub URL</label>
          <input type="url" name="githubUrl" defaultValue={initialData?.githubUrl || "https://github.com/AmPhilDanny"} className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">LinkedIn URL</label>
          <input type="url" name="linkedinUrl" defaultValue={initialData?.linkedinUrl || "https://linkedin.com/in/amaechiphilipekaba"} className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contact Email</label>
          <input type="email" name="email" defaultValue={initialData?.email || "amaechiphilipekaba@gmail.com"} className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-lg" />
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
        <button type="submit" disabled={loading || !!uploading} className="flex gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 transition-colors">
          <Save className="w-5 h-5"/> Save Settings
        </button>
      </div>
    </form>
  )
}
