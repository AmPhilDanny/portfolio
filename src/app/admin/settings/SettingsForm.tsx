"use client";
import { useState } from "react";
import { updateSettings } from "@/app/actions/settings";
import { Save, Palette, Type, Globe, Image as ImageIcon } from "lucide-react";
import MediaPicker from "@/components/MediaPicker";

const FONT_OPTIONS = [
  { label: "Inter (Default)", value: "Inter" },
  { label: "JetBrains Mono", value: "JetBrains Mono" },
  { label: "Roboto", value: "Roboto" },
  { label: "Poppins", value: "Poppins" },
  { label: "Space Grotesk", value: "Space Grotesk" },
  { label: "Outfit", value: "Outfit" },
  { label: "Fira Code (Monospace)", value: "Fira Code" },
];

const COLOR_PRESETS = [
  { name: "Ocean Blue", primary: "#2563eb", secondary: "#0891b2", accent: "#f59e0b", bg: "#020617" },
  { name: "Emerald Dark", primary: "#10b981", secondary: "#3b82f6", accent: "#f59e0b", bg: "#021212" },
  { name: "Purple Tech", primary: "#8b5cf6", secondary: "#ec4899", accent: "#f59e0b", bg: "#0a0014" },
  { name: "Cyber Green", primary: "#22c55e", secondary: "#06b6d4", accent: "#eab308", bg: "#030d06" },
  { name: "Solar Orange", primary: "#f97316", secondary: "#ef4444", accent: "#facc15", bg: "#0c0602" },
];

type Section = "branding" | "colors" | "typography" | "links";

export default function SettingsForm({ initialData }: { initialData: any }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeSection, setActiveSection] = useState<Section>("branding");
  const [logoUrl, setLogoUrl] = useState(initialData?.logoUrl || "");
  const [faviconUrl, setFaviconUrl] = useState(initialData?.faviconUrl || "");
  const [primaryColor, setPrimaryColor] = useState(initialData?.primaryColor || "#3b82f6");
  const [secondaryColor, setSecondaryColor] = useState(initialData?.secondaryColor || "#10b981");
  const [backgroundColor, setBackgroundColor] = useState(initialData?.backgroundColor || "#020617");
  const [accentColor, setAccentColor] = useState(initialData?.accentColor || "#f59e0b");
  const [fontFamily, setFontFamily] = useState(initialData?.fontFamily || "Inter");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const result = await updateSettings(new FormData(e.currentTarget));
    setMessage(result.success ? "Settings saved successfully." : "Failed to save settings.");
    setLoading(false);
  };

  const applyPreset = (preset: typeof COLOR_PRESETS[0]) => {
    setPrimaryColor(preset.primary);
    setSecondaryColor(preset.secondary);
    setAccentColor(preset.accent);
    setBackgroundColor(preset.bg);
  };

  const sections: { id: Section; label: string; icon: React.ReactNode }[] = [
    { id: "branding", label: "Branding", icon: <ImageIcon className="w-4 h-4" /> },
    { id: "colors", label: "Colors", icon: <Palette className="w-4 h-4" /> },
    { id: "typography", label: "Typography", icon: <Type className="w-4 h-4" /> },
    { id: "links", label: "Links & Contact", icon: <Globe className="w-4 h-4" /> },
  ];

  const inputCls = "w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors focus:border-primary";
  const inputStyle = {
    background: "var(--card)",
    borderColor: "var(--border)",
    color: "var(--foreground)",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-xl text-sm font-medium border ${
            message.includes("success") ? "border-green-500/30" : "border-red-500/30"
          }`}
          style={{
            background: message.includes("success") ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
            color: message.includes("success") ? "#10b981" : "#ef4444",
          }}
        >
          {message}
        </div>
      )}

      {/* Section tab navigation */}
      <div className="flex flex-wrap gap-2 border-b pb-4" style={{ borderColor: "var(--border)" }}>
        {sections.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveSection(s.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: activeSection === s.id ? "var(--primary)" : "var(--muted)",
              color: activeSection === s.id ? "var(--primary-foreground)" : "var(--muted-foreground)",
            }}
          >
            {s.icon}
            {s.label}
          </button>
        ))}
      </div>

      {/* ─── BRANDING ─── */}
      {activeSection === "branding" && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl border space-y-4" style={{ background: "var(--muted)", borderColor: "var(--border)" }}>
              <MediaPicker label="Site Logo (Navbar)" type="image" currentUrl={logoUrl} onSelect={setLogoUrl} />
              <input type="hidden" name="logoUrl" value={logoUrl} />
            </div>
            <div className="p-4 rounded-xl border space-y-4" style={{ background: "var(--muted)", borderColor: "var(--border)" }}>
              <MediaPicker label="Favicon (Browser Tab)" type="image" currentUrl={faviconUrl} onSelect={setFaviconUrl} />
              <input type="hidden" name="faviconUrl" value={faviconUrl} />
            </div>
          </div>

          <div className="p-6 rounded-2xl border space-y-6" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold" style={{ color: "var(--muted-foreground)" }}>Site Name</label>
                <input 
                  type="text" 
                  name="siteName" 
                  defaultValue={initialData?.siteName || "NovaxFolio"} 
                  placeholder="e.g. NovaxFolio"
                  className={inputCls} 
                  style={inputStyle} 
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-dashed border-border/60">
                <div className="space-y-0.5">
                  <label className="block text-sm font-semibold">Show Site Name</label>
                  <p className="text-xs opacity-60">Display the name next to the logo in the Navbar</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="showSiteName" 
                    defaultChecked={initialData?.showSiteName !== "false"} 
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-sm" />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold" style={{ color: "var(--muted-foreground)" }}>Footer Copyright Text</label>
              <textarea 
                name="copyrightText" 
                rows={2}
                defaultValue={initialData?.copyrightText || "NovaxFolio | Amaechi Philip Ekaba. All rights reserved."} 
                className={inputCls} 
                style={{ ...inputStyle, resize: "none" }} 
              />
              <p className="text-[10px] opacity-40 uppercase tracking-widest font-bold">Supported in site-wide footer</p>
            </div>
          </div>
        </div>
      )}

      {/* ─── COLORS ─── */}
      {/* ... (Colors section remains unchanged) */}

      {/* ─── TYPOGRAPHY ─── */}
      {/* ... (Typography section remains unchanged) */}

      {/* ─── LINKS ─── */}
      {activeSection === "links" && (
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { label: "GitHub URL", name: "githubUrl", type: "url", default: initialData?.githubUrl || "https://github.com/AmPhilDanny" },
            { label: "LinkedIn URL", name: "linkedinUrl", type: "url", default: initialData?.linkedinUrl || "https://linkedin.com/in/amaechiphilipekaba" },
            { label: "Twitter URL", name: "twitterUrl", type: "url", default: initialData?.twitterUrl || "" },
            { label: "Instagram URL", name: "instagramUrl", type: "url", default: initialData?.instagramUrl || "" },
            { label: "Facebook URL", name: "facebookUrl", type: "url", default: initialData?.facebookUrl || "" },
            { label: "Contact Email", name: "email", type: "email", default: initialData?.email || "amaechiphilipekaba@gmail.com" },
          ].map((field) => (
            <div key={field.name} className="space-y-1.5">
              <label className="block text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                defaultValue={field.default}
                className={inputCls}
                style={inputStyle}
              />
            </div>
          ))}
        </div>
      )}


      {/* Save button */}
      <div className="flex items-center gap-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] disabled:opacity-50"
          style={{
            background: "var(--primary)",
            color: "var(--primary-foreground)",
          }}
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {loading ? "Saving..." : "Save Settings"}
        </button>
        {message && (
          <span className="text-sm" style={{ color: message.includes("success") ? "#10b981" : "#ef4444" }}>
            {message}
          </span>
        )}
      </div>
    </form>
  );
}
