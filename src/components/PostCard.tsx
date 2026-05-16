"use client";

import React, { useState } from "react";
import { Copy01Icon as Copy, Tick01Icon as Check, Share01Icon as Share2, MoreVerticalIcon as MoreVertical, Delete02Icon as Trash2 } from "hugeicons-react";
import { GithubIcon, TwitterIcon, LinkedinIcon, InstagramIcon } from "@/components/Icons";

interface PostCardProps {
  id: string;
  platform: string;
  content: string;
  status: string;
  date: string;
}

export function PostCard({ id, platform, content, status, date }: PostCardProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPlatformIcon = () => {
    const iconClass = "w-4 h-4";
    switch (platform.toLowerCase()) {
      case 'x':
      case 'twitter': return <TwitterIcon className={iconClass} />;
      case 'linkedin': return <LinkedinIcon className={iconClass} />;
      case 'github': return <GithubIcon className={iconClass} />;
      case 'instagram': return <InstagramIcon className={iconClass} />;
      default: return <Share2 className={iconClass} />;
    }
  };

  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'posted': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'scheduled': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400';
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden group">
      {/* Header */}
      <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            {getPlatformIcon()}
          </div>
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-white text-sm">{platform}</h4>
            <p className="text-xs text-zinc-500">{date}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${getStatusColor()}`}>
            {status}
          </span>
          <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
          {content}
        </p>
      </div>

      {/* Footer / Actions */}
      <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-between mt-2">
        <div className="flex items-center gap-4">
          <button 
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-primary transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy Text"}
          </button>
        </div>
        <button className="text-zinc-400 hover:text-red-500 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
