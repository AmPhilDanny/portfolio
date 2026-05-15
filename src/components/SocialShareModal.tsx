"use client";
import React, { useState, useEffect } from "react";
import { Sparkles, X, Copy, Check, Loader2, Send, Share2 } from "lucide-react";
import { generateSocialPost } from "@/app/actions/ai-learning";
import { getAiPlatforms } from "@/app/actions/platforms";

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  type: 'project' | 'experience' | 'general';
}

function MarkdownPreview({ content }: { content: string }) {
  // Simple regex-based markdown parser for preview
  const html = content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^\* (.*$)/gim, '<li>$1</li>')
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/\n/g, '<br />');

  return (
    <div 
      className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed prose-sm dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default function SocialShareModal({ isOpen, onClose, title, content, type }: SocialShareModalProps) {
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadPlatforms();
    }
  }, [isOpen]);

  const loadPlatforms = async () => {
    const list = await getAiPlatforms();
    setPlatforms(list);
    if (list.length > 0) setSelectedPlatform(list[0].platform);
  };

  const handleGenerate = async () => {
    if (!selectedPlatform) return;
    setIsGenerating(true);
    const customContext = `Type: ${type}\nTitle: ${title}\nDetails: ${content}`;
    const res = await generateSocialPost(selectedPlatform, `Announcement for my new ${type}: ${title}`, undefined, customContext);
    if (res.success) {
      setGeneratedPost(res.content || "");
    }
    setIsGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg">AI Social Forge</h3>
              <p className="text-xs text-zinc-500">Drafting announcement for "{title}"</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {platforms.length === 0 ? (
            <div className="p-8 text-center bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
              <p className="text-sm text-zinc-500">No social platforms configured. Add one in the Social AI tab first!</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Target Platform</label>
                <div className="flex flex-wrap gap-2">
                  {platforms.map((p) => (
                    <button
                      key={p.platform}
                      onClick={() => setSelectedPlatform(p.platform)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                        selectedPlatform === p.platform
                          ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                          : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-primary/50'
                      }`}
                    >
                      {p.platform}
                    </button>
                  ))}
                </div>
              </div>

              {!generatedPost && (
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !selectedPlatform}
                  className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  {isGenerating ? "Forging..." : "Generate AI Post"}
                </button>
              )}

              {generatedPost && (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="relative">
                    <div className="w-full p-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl min-h-[12rem] overflow-y-auto">
                      <MarkdownPreview content={generatedPost} />
                    </div>
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        onClick={handleCopy}
                        className="p-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-sm hover:border-primary transition-all flex items-center gap-1.5 text-[10px] font-bold"
                      >
                        {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-primary" />}
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    <p className="text-[10px] text-blue-700 dark:text-blue-400 font-medium">
                      This draft is optimized for {selectedPlatform} and saved to your Content Calendar.
                    </p>
                  </div>
                  <button
                    onClick={() => setGeneratedPost("")}
                    className="w-full py-2 text-xs font-bold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                  >
                    Regenerate with another voice?
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
