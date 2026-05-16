"use client";
import { useState } from "react";
import { updateSettings } from "@/app/actions/settings";
import { FloppyDiskIcon as Save, PaintBoardIcon as Palette, TextFontIcon as Type, GlobeIcon as Globe, Image01Icon as ImageIcon, CpuIcon as Cpu, Key01Icon as Key, ViewIcon as Eye, ViewOffIcon as EyeOff } from "hugeicons-react";
import MediaPicker from "@/components/MediaPicker";
import SocialLinksManager from "./SocialLinksManager";

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

const AI_MODELS = [
  { value: "mistral-large", label: "Mistral Large", description: "Fast, high quality text generation" },
  { value: "gemini-pro", label: "Gemini 2.5 Flash", description: "Google's ultra-fast flash model" },
  { value: "gemini-vision", label: "Gemini 2.5 Flash (Vision)", description: "Image + text analysis" },
  { value: "gpt-4o", label: "OpenRouter (Custom)", description: "Use any model via OpenRouter" },
];

type Section = "branding" | "colors" | "typography" | "links" | "ai";

export default function SettingsForm({ initialData, socials }: { initialData: any, socials: any[] }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeSection, setActiveSection] = useState<Section>("branding");

  // ── Branding state ──
  const [siteName, setSiteName] = useState(initialData?.siteName || "NovaxFolio");
  const [showSiteName, setShowSiteName] = useState(initialData?.showSiteName !== "false");
  const [copyrightText, setCopyrightText] = useState(initialData?.copyrightText || "NovaxFolio | Amaechi Philip Ekaba. All rights reserved.");
  const [logoUrl, setLogoUrl] = useState(initialData?.logoUrl || "");
  const [faviconUrl, setFaviconUrl] = useState(initialData?.faviconUrl || "");

  // ── Colors state ──
  const [primaryColor, setPrimaryColor] = useState(initialData?.primaryColor || "#3b82f6");
  const [secondaryColor, setSecondaryColor] = useState(initialData?.secondaryColor || "#10b981");
  const [backgroundColor, setBackgroundColor] = useState(initialData?.backgroundColor || "#020617");
  const [accentColor, setAccentColor] = useState(initialData?.accentColor || "#f59e0b");

  // ── Typography state ──
  const [fontFamily, setFontFamily] = useState(initialData?.fontFamily || "Inter");
  const [customCss, setCustomCss] = useState(initialData?.customCss || "");

  // ── Links state ──
  const [email, setEmail] = useState(initialData?.email || "amaechiphilipekaba@gmail.com");

  // ── AI state ──
  const [globalAiModel, setGlobalAiModel] = useState(initialData?.globalAiModel || "mistral-large");
  const [geminiApiKey, setGeminiApiKey] = useState(initialData?.geminiApiKey || "");
  const [mistralApiKey, setMistralApiKey] = useState(initialData?.mistralApiKey || "");
  const [openrouterApiKey, setOpenrouterApiKey] = useState(initialData?.openrouterApiKey || "");
  const [openrouterModel, setOpenrouterModel] = useState(initialData?.openrouterModel || "openai/gpt-4o");
  const [showGemini, setShowGemini] = useState(false);
  const [showMistral, setShowMistral] = useState(false);
  const [showOpenRouter, setShowOpenRouter] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Build FormData manually from state so inactive tabs are always included
    const formData = new FormData();
    formData.set("siteName", siteName);
    formData.set("showSiteName", showSiteName ? "on" : "off");
    formData.set("copyrightText", copyrightText);
    formData.set("logoUrl", logoUrl);
    formData.set("faviconUrl", faviconUrl);
    formData.set("primaryColor", primaryColor);
    formData.set("secondaryColor", secondaryColor);
    formData.set("backgroundColor", backgroundColor);
    formData.set("accentColor", accentColor);
    formData.set("fontFamily", fontFamily);
    formData.set("customCss", customCss);
    formData.set("email", email);
    formData.set("globalAiModel", globalAiModel);
    formData.set("geminiApiKey", geminiApiKey);
    formData.set("mistralApiKey", mistralApiKey);
    formData.set("openrouterApiKey", openrouterApiKey);
    formData.set("openrouterModel", openrouterModel);
    // Legacy link fields (kept for backward compat)
    formData.set("githubUrl", initialData?.githubUrl || "");
    formData.set("linkedinUrl", initialData?.linkedinUrl || "");
    formData.set("twitterUrl", initialData?.twitterUrl || "");
    formData.set("facebookUrl", initialData?.facebookUrl || "");
    formData.set("instagramUrl", initialData?.instagramUrl || "");

    const result = await updateSettings(formData);
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
    { id: "ai", label: "AI & Keys", icon: <Cpu className="w-4 h-4" /> },
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
            </div>
            <div className="p-4 rounded-xl border space-y-4" style={{ background: "var(--muted)", borderColor: "var(--border)" }}>
              <MediaPicker label="Favicon (Browser Tab)" type="image" currentUrl={faviconUrl} onSelect={setFaviconUrl} />
            </div>
          </div>

          <div className="p-6 rounded-2xl border space-y-6" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold" style={{ color: "var(--muted-foreground)" }}>Site Name</label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
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
                    checked={showSiteName}
                    onChange={(e) => setShowSiteName(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-sm" />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold" style={{ color: "var(--muted-foreground)" }}>Footer Copyright Text</label>
              <textarea
                rows={2}
                value={copyrightText}
                onChange={(e) => setCopyrightText(e.target.value)}
                className={inputCls}
                style={{ ...inputStyle, resize: "none" }}
              />
              <p className="text-[10px] opacity-40 uppercase tracking-widest font-bold">Supported in site-wide footer</p>
            </div>
          </div>
        </div>
      )}

      {/* ─── COLORS ─── */}
      {activeSection === "colors" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {COLOR_PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => applyPreset(p)}
                className="p-3 rounded-xl border text-xs font-bold transition-all hover:scale-105"
                style={{ background: p.bg, borderColor: p.primary, color: "white" }}
              >
                {p.name}
                <div className="flex gap-1 mt-2 justify-center">
                  <div className="w-3 h-3 rounded-full" style={{ background: p.primary }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: p.secondary }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: p.accent }} />
                </div>
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 rounded-2xl border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div className="space-y-2">
              <label className="block text-sm font-semibold">Primary Color</label>
              <div className="flex gap-2">
                <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer" />
                <input type="text" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className={inputCls} style={inputStyle} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold">Secondary Color</label>
              <div className="flex gap-2">
                <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer" />
                <input type="text" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className={inputCls} style={inputStyle} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold">Accent Color</label>
              <div className="flex gap-2">
                <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer" />
                <input type="text" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className={inputCls} style={inputStyle} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold">Background (Dark)</label>
              <div className="flex gap-2">
                <input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer" />
                <input type="text" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className={inputCls} style={inputStyle} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TYPOGRAPHY ─── */}
      {activeSection === "typography" && (
        <div className="p-6 rounded-2xl border space-y-6" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="space-y-2">
            <label className="block text-sm font-semibold">Font Family</label>
            <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className={inputCls} style={inputStyle}>
              {FONT_OPTIONS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
          <div className="p-4 rounded-xl bg-muted/20 border border-border">
            <p className="text-xs uppercase tracking-widest font-bold opacity-40 mb-2">Preview</p>
            <p style={{ fontFamily }} className="text-xl">The quick brown fox jumps over the lazy dog.</p>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold">Custom CSS</label>
            <textarea
              value={customCss}
              onChange={(e) => setCustomCss(e.target.value)}
              rows={5}
              className={inputCls}
              style={{ ...inputStyle, fontFamily: "monospace" }}
              placeholder="/* Add your custom CSS here */"
            />
          </div>
        </div>
      )}

      {/* ─── LINKS ─── */}
      {activeSection === "links" && (
        <div className="space-y-12">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>
                Contact Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
                style={inputStyle}
              />
            </div>
          </div>

          <div className="border-t pt-8" style={{ borderColor: "var(--border)" }}>
            <SocialLinksManager initialLinks={socials} />
          </div>
        </div>
      )}

      {/* ─── AI & KEYS ─── */}
      {activeSection === "ai" && (
        <div className="space-y-6">
          {/* Global default model */}
          <div className="p-6 rounded-2xl border space-y-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div>
              <h3 className="font-semibold flex items-center gap-2"><Cpu className="w-4 h-4 text-primary" /> Global Default AI Model</h3>
              <p className="text-xs text-muted-foreground mt-1">Used site-wide when no per-platform model is set. Per-platform settings override this.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {AI_MODELS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setGlobalAiModel(m.value)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    globalAiModel === m.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40"
                  }`}
                  style={{ background: globalAiModel === m.value ? "var(--primary)" + "0D" : "var(--muted)" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">{m.label}</span>
                    {globalAiModel === m.value && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{m.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* API Keys */}
          <div className="p-6 rounded-2xl border space-y-5" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div>
              <h3 className="font-semibold flex items-center gap-2"><Key className="w-4 h-4 text-primary" /> API Credentials</h3>
              <p className="text-xs text-muted-foreground mt-1">Keys are stored securely in the database and never exposed to the client.</p>
            </div>

            {[
              { label: "Gemini API Key", state: geminiApiKey, setter: setGeminiApiKey, show: showGemini, toggle: () => setShowGemini(!showGemini), placeholder: "Google AI Studio key..." },
              { label: "Mistral API Key", state: mistralApiKey, setter: setMistralApiKey, show: showMistral, toggle: () => setShowMistral(!showMistral), placeholder: "Mistral Console key..." },
              { label: "OpenRouter API Key", state: openrouterApiKey, setter: setOpenrouterApiKey, show: showOpenRouter, toggle: () => setShowOpenRouter(!showOpenRouter), placeholder: "OpenRouter key..." },
            ].map((field) => (
              <div key={field.label} className="space-y-1.5">
                <label className="block text-sm font-semibold" style={{ color: "var(--muted-foreground)" }}>{field.label}</label>
                <div className="relative">
                  <input
                    type={field.show ? "text" : "password"}
                    value={field.state}
                    onChange={(e) => field.setter(e.target.value)}
                    placeholder={field.placeholder}
                    className={inputCls + " pr-12"}
                    style={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={field.toggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {field.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}

            {/* Custom OpenRouter Model */}
            {globalAiModel === "gpt-4o" && (
              <div className="space-y-1.5 p-4 rounded-xl border border-dashed border-primary/30 bg-primary/5 animate-in slide-in-from-top-2 duration-300">
                <label className="block text-sm font-bold text-primary">OpenRouter Model ID</label>
                <input
                  type="text"
                  value={openrouterModel}
                  onChange={(e) => setOpenrouterModel(e.target.value)}
                  placeholder="e.g. google/gemini-pro-1.5"
                  className={inputCls}
                  style={inputStyle}
                />
                <p className="text-[10px] text-muted-foreground">Find model IDs at <a href="https://openrouter.ai/models" target="_blank" rel="noreferrer" className="underline text-primary">openrouter.ai/models</a></p>
              </div>
            )}
          </div>
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
