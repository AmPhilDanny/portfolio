"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Sparkles, Plus, BarChart3, MessageSquare, Settings as SettingsIcon,
  Upload, Loader2, CheckCircle2, AlertCircle, Globe, History, X, Trash2
} from "lucide-react";
import MediaPicker from "@/components/MediaPicker";
import {
  generateSocialPost, analyzeScreenshot, analyzeProfileUrl, updateAiConfig, getAiConfig,
  getSocialInsights, getContentDrafts
} from "@/app/actions/ai-learning";
import { getSettings, updateAiApiKeys } from "@/app/actions/settings";
import { getAiPlatforms, addAiPlatform, deleteAiPlatform } from "@/app/actions/platforms";

type AiModel = 'gemini-vision' | 'gemini-pro' | 'mistral-large' | 'gpt-4o';

const VISION_MODELS = [
  { value: 'gemini-vision', label: 'Gemini 2.5 Flash (Vision)' },
  { value: 'gpt-4o', label: 'GPT-4o (OpenRouter)' },
];

const TEXT_MODELS = [
  { value: 'mistral-large', label: 'Mistral Large' },
  { value: 'gemini-pro', label: 'Gemini 2.5 Flash' },
  { value: 'gpt-4o', label: 'GPT-4o (OpenRouter)' },
];

const BRAND_VOICES = [
  "Sarcastic & Technical", "Formal & Professional",
  "Enthusiastic & Friendly", "Minimalist"
];

function StatusBanner({ message, onDismiss }: { message: { type: 'success' | 'error'; text: string } | null; onDismiss: () => void }) {
  if (!message) return null;
  return (
    <div className={`p-4 rounded-xl text-sm flex items-center gap-3 animate-in slide-in-from-top-2 duration-300 ${
      message.type === 'success'
        ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800'
        : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800'
    }`}>
      {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
      <span className="flex-1">{message.text}</span>
      <button onClick={onDismiss} className="opacity-60 hover:opacity-100"><X className="w-4 h-4" /></button>
    </div>
  );
}

function PlatformTab({ platform, onDelete }: { platform: any; onDelete: () => void }) {
  const [subTab, setSubTab] = useState<'metrics' | 'analysis' | 'forge' | 'config'>('metrics');
  const [insights, setInsights] = useState<any[]>([]);
  const [drafts, setDrafts] = useState<any[]>([]);
  const [config, setConfig] = useState({ 
    brandVoice: "Formal & Professional", 
    preferredModel: "mistral-large", 
    targetAudience: "",
    growthGoals: "",
    profileUrl: "" 
  });
  const [topic, setTopic] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [visionModel, setVisionModel] = useState<AiModel>('gemini-vision');
  const [genModel, setGenModel] = useState<AiModel>('mistral-large');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzingUrl, setIsAnalyzingUrl] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const load = useCallback(async () => {
    const [ins, drs, cfg] = await Promise.all([
      getSocialInsights(platform.platform),
      getContentDrafts(platform.platform),
      getAiConfig(platform.platform),
    ]);
    setInsights(ins);
    setDrafts(drs);
    if (cfg) {
      setConfig({ 
        brandVoice: cfg.brandVoice || "Formal & Professional", 
        targetAudience: cfg.targetAudience || "Technical Professionals",
        preferredModel: cfg.preferredModel || "mistral-large", 
        growthGoals: cfg.growthGoals || "",
        profileUrl: cfg.profileUrl || ""
      });
      setGenModel((cfg.preferredModel as AiModel) || 'mistral-large');
    }
  }, [platform.platform]);

  useEffect(() => { load(); }, [load]);

  const handleGenerate = async () => {
    setIsGenerating(true); setMessage(null);
    const res = await generateSocialPost(platform.platform, topic, genModel);
    if (res.success) {
      setMessage({ type: 'success', text: "Post generated!" });
      setTopic("");
      const newDrafts = await getContentDrafts(platform.platform);
      setDrafts(newDrafts);
    } else {
      setMessage({ type: 'error', text: res.error || "Generation failed" });
    }
    setIsGenerating(false);
  };

  const handleAnalyze = async (url: string) => {
    setScreenshotUrl(url);
    if (!url) return;
    setIsAnalyzing(true); setMessage(null);
    const res = await analyzeScreenshot(platform.platform, url, visionModel);
    if (res.success) {
      setMessage({ type: 'success', text: `Analysis complete! Found ${res.data?.followers || 'some'} followers.` });
      const newIns = await getSocialInsights(platform.platform);
      setInsights(newIns);
    } else {
      setMessage({ type: 'error', text: res.error || "Analysis failed" });
    }
    setIsAnalyzing(false);
  };

  const handleAnalyzeUrl = async () => {
    if (!config.profileUrl) {
      setMessage({ type: 'error', text: "Please add a profile URL in Settings first." });
      return;
    }
    setIsAnalyzingUrl(true); setMessage(null);
    const res = await analyzeProfileUrl(platform.platform, config.profileUrl, genModel);
    if (res.success) {
      setMessage({ type: 'success', text: "URL analysis complete!" });
      const newIns = await getSocialInsights(platform.platform);
      setInsights(newIns);
    } else {
      setMessage({ type: 'error', text: res.error || "URL analysis failed" });
    }
    setIsAnalyzingUrl(false);
  };

  const handleSaveConfig = async () => {
    setIsSaving(true); setMessage(null);
    const res = await updateAiConfig({
      ...config,
      platform: platform.platform
    } as any);
    setMessage(res.success ? { type: 'success', text: "Config saved!" } : { type: 'error', text: "Save failed." });
    setIsSaving(false);
  };

  const subTabs = [
    { id: 'metrics', label: 'Metrics', icon: BarChart3 },
    { id: 'analysis', label: 'Growth Learning', icon: Upload },
    { id: 'forge', label: 'Content Forge', icon: MessageSquare },
    { id: 'config', label: 'Settings', icon: SettingsIcon },
  ] as const;

  return (
    <div className="space-y-6">
      <StatusBanner message={message} onDismiss={() => setMessage(null)} />

      {/* Sub-tabs */}
      <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
        {subTabs.map((t) => (
          <button key={t.id} onClick={() => setSubTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all flex-1 justify-center ${
              subTab === t.id ? 'bg-white dark:bg-zinc-900 text-primary shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}>
            <t.icon className="w-3.5 h-3.5" />{t.label}
          </button>
        ))}
      </div>

      {/* METRICS */}
      {subTab === 'metrics' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* Top Level Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Current Reach */}
            <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Globe className="w-12 h-12 text-primary" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Current Reach</p>
              <p className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
                {insights[0]?.followerCount || "0"}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] text-zinc-500 font-medium">Last synced {insights[0] ? new Date(insights[0].lastAnalyzed).toLocaleDateString() : "Never"}</span>
              </div>
            </div>

            {/* Growth Trend */}
            <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm relative overflow-hidden">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Growth Trend</p>
              {(() => {
                if (insights.length < 2) return <p className="text-sm text-zinc-400 mt-2 italic">Need more data to track trends...</p>;
                const current = parseFloat((insights[0].followerCount || "0").replace(/[^0-9.]/g, ""));
                const prev = parseFloat((insights[1].followerCount || "0").replace(/[^0-9.]/g, ""));
                const diff = current - prev;
                return (
                  <>
                    <p className={`text-3xl font-bold tracking-tight ${diff >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {diff >= 0 ? '+' : ''}{diff} <span className="text-xs font-normal text-zinc-400">followers</span>
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-2 font-medium">Since {new Date(insights[1].lastAnalyzed).toLocaleDateString()}</p>
                  </>
                );
              })()}
            </div>

            {/* Engagement Score */}
            <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm relative overflow-hidden">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Engagement</p>
              <p className="text-3xl font-bold text-primary tracking-tight">{insights[0]?.engagementRate || "—"}</p>
              <p className="text-[10px] text-zinc-500 mt-2 font-medium">Platform efficiency score</p>
            </div>
          </div>

          {/* Identity & Strategy Overview */}
          {insights[0] && (insights[0].identity || insights[0].contentPillars?.length > 0) && (
            <div className="p-8 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-[2.5rem] shadow-2xl shadow-primary/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 -m-8 w-64 h-64 bg-primary/20 blur-[100px]" />
              
              <div className="relative z-10 flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-50 mb-2">Brand Identity</h3>
                    <p className="text-2xl font-bold tracking-tight italic">
                      "{insights[0].identity || "Identity not yet established"}"
                    </p>
                  </div>
                  <div className="pt-4 border-t border-white/10 dark:border-zinc-200">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-50 mb-3">Core Content Pillars</h3>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(insights[0].contentPillars) && insights[0].contentPillars.length > 0 ? (
                        (insights[0].contentPillars as string[]).map((p, i) => (
                          <span key={i} className="px-3 py-1 bg-white/10 dark:bg-zinc-100 rounded-full text-xs font-bold border border-white/5">
                            {p}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm opacity-60">No pillars detected yet.</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/3 bg-white/5 dark:bg-zinc-50 p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-50 mb-4">Strategic Insight</h3>
                    <p className="text-sm leading-relaxed opacity-80 italic">
                      {insights[0].analysisSummary || "AI analysis pending..."}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" /> AI Generated Strategy
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Feed */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 px-2">Analysis Timeline</h3>
            {insights.length === 0 ? (
              <div className="p-12 text-center rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                <BarChart3 className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
                <p className="text-sm text-zinc-500 font-medium">No data points yet. Run an analysis to start the timeline.</p>
              </div>
            ) : insights.map((ins) => (
              <div key={ins.id} className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl flex items-center justify-between gap-4 hover:border-primary/30 transition-all group">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 flex items-center justify-center overflow-hidden shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                    {ins.screenshotUrl ? <img src={ins.screenshotUrl} className="w-full h-full object-cover" alt="Profile" /> : <Globe className="w-6 h-6 text-primary" />}
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900 dark:text-white text-lg tracking-tight">{ins.handle || "Sync Record"}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <p className="text-xs text-zinc-500 font-medium">{new Date(ins.lastAnalyzed).toLocaleDateString()}</p>
                      <span className="w-1 h-1 rounded-full bg-zinc-300" />
                      <p className="text-xs font-bold text-primary">{ins.followerCount || '0'} Followers</p>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center justify-end gap-1.5 mb-0.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-xl font-black text-zinc-900 dark:text-white tracking-tighter">{ins.engagementRate || '—'}</p>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Reach Efficiency</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GROWTH LEARNING */}
      {subTab === 'analysis' && (
        <div className="space-y-5">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-white">Profile Screenshot Analysis</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">AI reads your profile screenshot and extracts growth metrics.</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Vision Model</label>
                  <select value={visionModel} onChange={(e) => setVisionModel(e.target.value as AiModel)}
                    className="text-xs px-3 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg outline-none">
                    {VISION_MODELS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-primary/10">
                <MediaPicker onSelect={handleAnalyze} currentUrl={screenshotUrl} label="Profile Screenshot" />
                {isAnalyzing && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-primary font-medium animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin" /> AI is reading your metrics...
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/10 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-white">Profile URL Analysis</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">AI scrapes your profile page to extract insights.</p>
                </div>
                <Globe className="w-5 h-5 text-blue-500/50" />
              </div>
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-blue-500/10 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-500">Profile / Page Link</label>
                  <p className="text-[10px] text-zinc-400 font-mono break-all">{config.profileUrl || "Set URL in Settings tab"}</p>
                </div>
                <button 
                  onClick={handleAnalyzeUrl} 
                  disabled={isAnalyzingUrl || !config.profileUrl}
                  className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  {isAnalyzingUrl ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                  {isAnalyzingUrl ? "Scraping..." : "Analyze Profile Link"}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
              <History className="w-4 h-4 text-zinc-400" />
              <span className="text-sm font-semibold">Analysis History</span>
            </div>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {insights.length === 0 ? (
                <div className="p-8 text-center text-sm text-zinc-500">No analyses yet.</div>
              ) : insights.map((ins) => (
                <div key={ins.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                      {ins.screenshotUrl ? <Upload className="w-4 h-4 text-zinc-400" /> : <Globe className="w-4 h-4 text-zinc-400" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{ins.handle || "Analysis"}</p>
                      <p className="text-xs text-zinc-400">{new Date(ins.lastAnalyzed).toLocaleString()} • {ins.followerCount} followers</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-primary">{ins.engagementRate}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CONTENT FORGE */}
      {subTab === 'forge' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-semibold flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> Generate Content</h3>
            <div>
              <label className="text-xs font-medium text-zinc-500 block mb-1.5">Topic / Theme (optional)</label>
              <textarea value={topic} onChange={(e) => setTopic(e.target.value)}
                placeholder={`e.g. New project using Next.js and AI...`}
                className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm outline-none h-28 resize-none" />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">AI Model</label>
                <select value={genModel} onChange={(e) => setGenModel(e.target.value as AiModel)}
                  className="w-full text-xs px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg outline-none">
                  {TEXT_MODELS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
            </div>
            <button onClick={handleGenerate} disabled={isGenerating}
              className="w-full py-3 bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 shadow-lg">
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Generate for {platform.platform}
            </button>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Drafts ({drafts.length})</h3>
            {drafts.length === 0 ? (
              <div className="p-10 text-center bg-zinc-100 dark:bg-zinc-800/50 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700">
                <p className="text-sm text-zinc-500">Generated posts will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {drafts.map((d) => (
                  <div key={d.id} className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl group hover:border-primary/20 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary px-2 py-0.5 bg-primary/10 rounded-full">{d.status}</span>
                      <span className="text-[10px] text-zinc-400">{new Date(d.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap line-clamp-4">{d.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CONFIG */}
      {subTab === 'config' && (
        <div className="space-y-5">
          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2"><SettingsIcon className="w-4 h-4 text-zinc-400" /> Platform Config: {platform.platform}</h3>
              <button onClick={() => { if (confirm(`Delete ${platform.platform} platform?`)) onDelete(); }}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid gap-4">
              <div>
                <label className="text-xs font-medium text-zinc-500 block mb-1.5">Profile / Page URL</label>
                <input 
                  type="url"
                  value={config.profileUrl} 
                  onChange={(e) => setConfig({ ...config, profileUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none focus:border-primary" 
                />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500 block mb-1.5">Brand Voice</label>
                <select value={config.brandVoice} onChange={(e) => setConfig({ ...config, brandVoice: e.target.value })}
                  className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none">
                  {BRAND_VOICES.map((v) => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500 block mb-1.5">Target Audience</label>
                <input 
                  type="text"
                  value={config.targetAudience} 
                  onChange={(e) => setConfig({ ...config, targetAudience: e.target.value })}
                  placeholder="e.g. Technical Professionals, Indie Hackers, Recuiters..."
                  className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none focus:border-primary" 
                />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500 block mb-1.5">Default AI Model (for this platform)</label>
                <select value={config.preferredModel} onChange={(e) => setConfig({ ...config, preferredModel: e.target.value })}
                  className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none">
                  {TEXT_MODELS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500 block mb-1.5">Growth Goals</label>
                <textarea value={config.growthGoals} onChange={(e) => setConfig({ ...config, growthGoals: e.target.value })}
                  placeholder="e.g. Gain 100 followers this month by posting daily technical tips."
                  className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm outline-none h-24 resize-none" />
              </div>
            </div>
            <button onClick={handleSaveConfig} disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition-all text-sm">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              {isSaving ? "Saving..." : "Save Config"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SocialAiPage() {
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [activePlatform, setActivePlatform] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlatformName, setNewPlatformName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState("");

  const loadPlatforms = useCallback(async () => {
    const list = await getAiPlatforms();
    setPlatforms(list);
    if (list.length > 0 && !activePlatform) setActivePlatform(list[0].platform);
  }, [activePlatform]);

  useEffect(() => { loadPlatforms(); }, []);

  const handleAddPlatform = async () => {
    if (!newPlatformName.trim()) return;
    setIsAdding(true); setAddError("");
    const res = await addAiPlatform(newPlatformName.trim());
    if (res.success) {
      await loadPlatforms();
      setActivePlatform(newPlatformName.trim());
      setNewPlatformName("");
      setShowAddModal(false);
    } else {
      setAddError(res.error || "Failed to add platform.");
    }
    setIsAdding(false);
  };

  const handleDeletePlatform = async (id: string, platformName: string) => {
    await deleteAiPlatform(id);
    const list = await getAiPlatforms();
    setPlatforms(list);
    if (activePlatform === platformName) setActivePlatform(list[0]?.platform || "");
  };

  const activePlatformData = platforms.find((p) => p.platform === activePlatform);

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            Social AI Strategist <Sparkles className="w-6 h-6 text-primary animate-pulse" />
          </h1>
          <p className="text-zinc-500 mt-1">Multi-model AI intelligence for automated social growth.</p>
        </div>
        <button onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 font-medium w-fit">
          <Plus className="w-4 h-4" /> Add Platform
        </button>
      </div>

      {platforms.length === 0 ? (
        <div className="p-16 text-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700">
          <Sparkles className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
          <h3 className="font-semibold text-zinc-600 dark:text-zinc-300 mb-2">No platforms yet</h3>
          <p className="text-sm text-zinc-500 mb-6">Add your first social media platform to get started.</p>
          <button onClick={() => setShowAddModal(true)} className="px-6 py-2 bg-primary text-white rounded-lg font-semibold text-sm hover:opacity-90">
            <Plus className="w-4 h-4 inline mr-1" /> Add First Platform
          </button>
        </div>
      ) : (
        <>
          {/* Platform tab strip */}
          <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto pb-px">
            {platforms.map((p) => (
              <button key={p.platform} onClick={() => setActivePlatform(p.platform)}
                className={`px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all relative -mb-px ${
                  activePlatform === p.platform
                    ? 'border-primary text-primary'
                    : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}>
                {p.platform}
              </button>
            ))}
          </div>

          {/* Active platform content */}
          {activePlatformData && (
            <PlatformTab
              key={activePlatform}
              platform={activePlatformData}
              onDelete={() => handleDeletePlatform(activePlatformData.id, activePlatform)}
            />
          )}
        </>
      )}

      {/* Add Platform Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 w-full max-w-sm mx-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">Add New Platform</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-500 block mb-1.5">Platform Name</label>
              <input
                value={newPlatformName}
                onChange={(e) => setNewPlatformName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddPlatform()}
                placeholder="e.g. YouTube, TikTok, GitHub..."
                autoFocus
                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm outline-none focus:border-primary transition-colors"
              />
              {addError && <p className="text-xs text-red-500 mt-1">{addError}</p>}
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-2 rounded-xl text-sm font-medium border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">Cancel</button>
              <button onClick={handleAddPlatform} disabled={isAdding || !newPlatformName.trim()}
                className="flex-1 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
                {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {isAdding ? "Adding..." : "Add Platform"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
