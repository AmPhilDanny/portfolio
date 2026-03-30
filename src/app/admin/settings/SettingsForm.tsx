"use client";
import { useState } from "react";
import { updateSettings } from "@/app/actions/settings";
import { Save } from "lucide-react";
import MediaPicker from "@/components/MediaPicker";

export default function SettingsForm({ initialData }: { initialData: any }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [logoUrl, setLogoUrl] = useState(initialData?.logoUrl || "");
  const [faviconUrl, setFaviconUrl] = useState(initialData?.faviconUrl || "");
  const [primaryColor, setPrimaryColor] = useState(initialData?.primaryColor || "#3b82f6");
  const [secondaryColor, setSecondaryColor] = useState(initialData?.secondaryColor || "#10b981");
  const [backgroundColor, setBackgroundColor] = useState(initialData?.backgroundColor || "#020617");
  const [accentColor, setAccentColor] = useState(initialData?.accentColor || "#f59e0b");

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
          <MediaPicker 
            label="Logo Upload (Navigation Bar)"
            type="image"
            currentUrl={logoUrl}
            onSelect={setLogoUrl}
          />
          <input type="hidden" name="logoUrl" value={logoUrl} />
        </div>
        <div>
          <MediaPicker 
            label="Favicon Upload (Browser Tab)"
            type="image"
            currentUrl={faviconUrl}
            onSelect={setFaviconUrl}
          />
          <input type="hidden" name="faviconUrl" value={faviconUrl} />
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

      <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-6 pt-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Theme Customization</h3>
          <p className="text-sm text-gray-500 mt-1">Design a "tech" theme that fits web development and data analysis.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Primary Color</label>
            <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border dark:border-zinc-700">
              <input type="color" name="primaryColor" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-10 h-10 border-none bg-transparent rounded cursor-pointer" />
              <input type="text" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="flex-1 bg-transparent border-none text-xs font-mono uppercase focus:ring-0" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Secondary Color</label>
            <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border dark:border-zinc-700">
              <input type="color" name="secondaryColor" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="w-10 h-10 border-none bg-transparent rounded cursor-pointer" />
              <input type="text" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="flex-1 bg-transparent border-none text-xs font-mono uppercase focus:ring-0" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Background Color</label>
            <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border dark:border-zinc-700">
              <input type="color" name="backgroundColor" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="w-10 h-10 border-none bg-transparent rounded cursor-pointer" />
              <input type="text" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="flex-1 bg-transparent border-none text-xs font-mono uppercase focus:ring-0" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Accent Color</label>
            <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border dark:border-zinc-700">
              <input type="color" name="accentColor" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-10 h-10 border-none bg-transparent rounded cursor-pointer" />
              <input type="text" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="flex-1 bg-transparent border-none text-xs font-mono uppercase focus:ring-0" />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
        <button type="submit" disabled={loading} className="flex gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 transition-colors">
          <Save className="w-5 h-5"/> Save Settings
        </button>
      </div>
    </form>
  )
}
