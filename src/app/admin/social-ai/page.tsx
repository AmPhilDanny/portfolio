"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, TrendingUp, Calendar, Settings as SettingsIcon, 
  Plus, BarChart3, MessageSquare, History, Globe, 
  Upload, Loader2, CheckCircle2, AlertCircle, Search
} from "lucide-react";
import { PostCard } from "@/components/PostCard";
import MediaPicker from "@/components/MediaPicker";
import { 
  generateSocialPost, analyzeScreenshot, 
  updateAiConfig, trackGrowthMetric 
} from "@/app/actions/ai-learning";

const PLATFORMS = ["GitHub", "X", "LinkedIn", "Instagram"];

export default function SocialAiPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [activePlatform, setActivePlatform] = useState(PLATFORMS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [topic, setTopic] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Mock data for initial UI (In a real app, this would be fetched via server components/actions)
  const stats = [
    { label: "Total Followers", value: "4.8K", trend: "+12%", icon: TrendingUp },
    { label: "AI Insights", value: "24", trend: "Active", icon: Sparkles },
    { label: "Scheduled Posts", value: "5", trend: "Next: Tomorrow", icon: Calendar },
    { label: "Platforms", value: "4", trend: "Syncing", icon: Globe },
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setMessage(null);
    try {
      const res = await generateSocialPost(activePlatform, topic);
      if (res.success) {
        setMessage({ type: 'success', text: "Post generated and added to calendar!" });
        setTopic("");
      } else {
        setMessage({ type: 'error', text: res.error || "Generation failed" });
      }
    } catch (err) {
      setMessage({ type: 'error', text: "An unexpected error occurred" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnalyze = async (url: string) => {
    setScreenshotUrl(url);
    if (!url) return;
    
    setIsAnalyzing(true);
    setMessage(null);
    try {
      const res = await analyzeScreenshot(activePlatform, url);
      if (res.success) {
        setMessage({ type: 'success', text: `Analysis complete! Found ${res.data?.followers} followers.` });
      } else {
        setMessage({ type: 'error', text: res.error || "Analysis failed" });
      }
    } catch (err) {
      setMessage({ type: 'error', text: "An unexpected error occurred during analysis" });
    } finally {
      setIsAnalyzing(false);
    }
  };

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
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 font-medium">
          <Plus className="w-4 h-4" /> Add Platform
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400">
                <stat.icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-green-500 uppercase">{stat.trend}</span>
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stat.value}</p>
            <p className="text-xs text-zinc-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 gap-6">
        {[
          { id: "overview", label: "Intelligence Hub", icon: BarChart3 },
          { id: "generation", label: "Content Forge", icon: MessageSquare },
          { id: "config", label: "AI Settings", icon: SettingsIcon }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-4 text-sm font-medium transition-all relative ${
              activeTab === tab.id 
                ? "text-primary" 
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Screenshot Analysis Card */}
              <div className="p-6 bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-white">Growth Learning</h3>
                    <p className="text-xs text-zinc-500">Upload profile screenshots for Gemini Vision analysis.</p>
                  </div>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-primary/10">
                  <MediaPicker 
                    onSelect={handleAnalyze}
                    currentUrl={screenshotUrl}
                    label="Profile Screenshot"
                  />
                  {isAnalyzing && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-primary font-medium animate-pulse">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      AI is reading your metrics...
                    </div>
                  )}
                </div>
              </div>

              {/* Insights List */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <History className="w-4 h-4 text-zinc-400" /> Recent Insights
                  </h3>
                  <button className="text-xs text-primary font-medium">View All</button>
                </div>
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {PLATFORMS.map((p) => (
                    <div key={p} className="p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold">
                          {p[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-zinc-900 dark:text-white">{p}</p>
                          <p className="text-[10px] text-zinc-500">Last analyzed: 2 hours ago</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-zinc-900 dark:text-white">Growth +2.4%</p>
                        <p className="text-[10px] text-green-500">Trending Up</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Platform Selector */}
              <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4">Active Platforms</h3>
                <div className="space-y-2">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p}
                      onClick={() => setActivePlatform(p)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                        activePlatform === p 
                          ? "bg-primary/10 text-primary border border-primary/20" 
                          : "hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-transparent"
                      }`}
                    >
                      <span className="text-sm font-medium">{p}</span>
                      {activePlatform === p && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "generation" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Generator Card */}
            <div className="space-y-6">
              <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
                <h3 className="font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" /> Content Forge
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-zinc-500 block mb-1.5">Topic or Theme (Optional)</label>
                    <textarea 
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g. My new project using Next.js and AI..."
                      className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none h-32 resize-none transition-all"
                    />
                  </div>
                  
                  {message && (
                    <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                      message.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      {message.text}
                    </div>
                  )}

                  <button 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full py-3 bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    Generate for {activePlatform}
                  </button>
                </div>
              </div>
            </div>

            {/* Preview/Calendar Feed */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Content Calendar (Drafts)</h3>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                <PostCard 
                  id="1"
                  platform={activePlatform}
                  content="Just integrated a multi-model AI strategist into my portfolio! Gemini for vision, Mistral for strategy. 🚀 The future of social growth is automated. #BuildInPublic #AI #NextJS"
                  status="draft"
                  date="A few moments ago"
                />
                <PostCard 
                  id="2"
                  platform={activePlatform}
                  content="Data Analysis is more than just numbers; it's about telling a story. Proud to show how I'm using AI to bridge that gap. 📊✨"
                  status="scheduled"
                  date="Scheduled for May 15"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "config" && (
          <div className="max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
             <h3 className="font-semibold text-zinc-900 dark:text-white mb-6">AI Configuration: {activePlatform}</h3>
             <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-zinc-500 block mb-1.5">Brand Voice</label>
                    <select className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none">
                      <option>Sarcastic & Technical</option>
                      <option>Formal & Professional</option>
                      <option>Enthusiastic & Friendly</option>
                      <option>Minimalist</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500 block mb-1.5">Preferred Model</label>
                    <select className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none">
                      <option>Mistral Large (High Quality)</option>
                      <option>Gemini 1.5 Pro</option>
                      <option>GPT-4o (via OpenRouter)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-500 block mb-1.5">Growth Goals</label>
                  <textarea 
                    placeholder="e.g. Gain 100 followers this month by posting daily technical tips."
                    className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm outline-none h-24 resize-none"
                  />
                </div>
                <button className="px-6 py-2 bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white rounded-lg text-sm font-bold hover:opacity-90 transition-all">
                  Save Configuration
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
