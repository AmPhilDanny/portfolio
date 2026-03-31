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
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl border space-y-3" style={{ background: "var(--muted)", borderColor: "var(--border)" }}>
            <MediaPicker label="Site Logo (Navbar)" type="image" currentUrl={logoUrl} onSelect={setLogoUrl} />
            <input type="hidden" name="logoUrl" value={logoUrl} />
          </div>
          <div className="p-4 rounded-xl border space-y-3" style={{ background: "var(--muted)", borderColor: "var(--border)" }}>
            <MediaPicker label="Favicon (Browser Tab)" type="image" currentUrl={faviconUrl} onSelect={setFaviconUrl} />
            <input type="hidden" name="faviconUrl" value={faviconUrl} />
          </div>
        </div>
      )}

      {/* ─── COLORS ─── */}
      {activeSection === "colors" && (
        <div className="space-y-6">
          {/* Presets */}
          <div>
            <p className="text-sm font-semibold mb-3" style={{ color: "var(--muted-foreground)" }}>Quick Presets</p>
            <div className="flex flex-wrap gap-3">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl border text-sm font-medium transition-all hover:scale-105"
                  style={{ background: preset.bg, borderColor: preset.primary, color: "#fff" }}
                >
                  <div className="flex gap-1">
                    {[preset.primary, preset.secondary, preset.accent].map((c) => (
                      <span key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
                    ))}
                  </div>
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Color pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Primary", name: "primaryColor", value: primaryColor, set: setPrimaryColor },
              { label: "Secondary", name: "secondaryColor", value: secondaryColor, set: setSecondaryColor },
              { label: "Background", name: "backgroundColor", value: backgroundColor, set: setBackgroundColor },
              { label: "Accent", name: "accentColor", value: accentColor, set: setAccentColor },
            ].map((c) => (
              <div key={c.name} className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
                  {c.label}
                </label>
                <div
                  className="flex items-center gap-3 p-2.5 rounded-xl border transition-all"
                  style={{ background: "var(--card)", borderColor: "var(--border)" }}
                >
                  <input
                    type="color"
                    name={c.name}
                    value={c.value}
                    onChange={(e) => c.set(e.target.value)}
                    className="w-10 h-10 rounded-lg border-none bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={c.value}
                    onChange={(e) => c.set(e.target.value)}
                    className="flex-1 bg-transparent border-none text-xs font-mono uppercase outline-none"
                    style={{ color: "var(--foreground)" }}
                    maxLength={9}
                  />
                </div>
                {/* Color preview swatch */}
                <div className="h-2 rounded-full" style={{ background: c.value }} />
              </div>
            ))}
          </div>

          {/* Live preview bar */}
          <div
            className="p-4 rounded-xl border space-y-2"
            style={{ background: "var(--muted)", borderColor: "var(--border)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--muted-foreground)" }}>
              Color Preview
            </p>
            <div className="flex gap-2 flex-wrap">
              <span className="px-4 py-1.5 rounded-full text-xs font-bold text-white" style={{ background: primaryColor }}>
                Primary
              </span>
              <span className="px-4 py-1.5 rounded-full text-xs font-bold text-white" style={{ background: secondaryColor }}>
                Secondary
              </span>
              <span className="px-4 py-1.5 rounded-full text-xs font-bold text-white" style={{ background: accentColor }}>
                Accent
              </span>
              <span className="px-4 py-1.5 rounded-full text-xs font-bold border" style={{ background: backgroundColor, color: primaryColor, borderColor: primaryColor }}>
                Background
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ─── TYPOGRAPHY ─── */}
      {activeSection === "typography" && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>
              Body Font Family
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {FONT_OPTIONS.map((font) => (
                <button
                  key={font.value}
                  type="button"
                  onClick={() => setFontFamily(font.value)}
                  className="px-4 py-3 rounded-xl border text-left transition-all hover:scale-[1.02]"
                  style={{
                    background: fontFamily === font.value ? "var(--glow-primary)" : "var(--card)",
                    borderColor: fontFamily === font.value ? "var(--primary)" : "var(--border)",
                    color: fontFamily === font.value ? "var(--primary)" : "var(--foreground)",
                    fontFamily: font.value,
                  }}
                >
                  <span className="text-sm font-medium block">{font.label}</span>
                  <span className="text-xs mt-1 block opacity-60">
                    The quick brown fox
                  </span>
                </button>
              ))}
            </div>
            <input type="hidden" name="fontFamily" value={fontFamily} />
          </div>
        </div>
      )}

      {/* ─── LINKS ─── */}
      {activeSection === "links" && (
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { label: "GitHub URL", name: "githubUrl", type: "url", default: initialData?.githubUrl || "https://github.com/AmPhilDanny" },
            { label: "LinkedIn URL", name: "linkedinUrl", type: "url", default: initialData?.linkedinUrl || "https://linkedin.com/in/amaechiphilipekaba" },
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
