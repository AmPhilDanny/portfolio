"use client";
import React from "react";
import * as SiIcons from "react-icons/si";
import * as LuIcons from "hugeicons-react";

interface SocialIconProps {
  platform: string;
  className?: string;
}

/**
 * SocialIcon Component
 * Uses Simple Icons (react-icons/si) for brand-specific icons
 * Falls back to Lucide if no brand match is found.
 */
export default function SocialIcon({ platform, className }: SocialIconProps) {
  const normalized = platform.toLowerCase().trim();

  // Mapping platform names to SimpleIcon keys
  const mapping: Record<string, string> = {
    github: "SiGithub",
    linkedin: "SiLinkedin",
    twitter: "SiTwitter",
    x: "SiX",
    instagram: "SiInstagram",
    facebook: "SiFacebook",
    youtube: "SiYoutube",
    tiktok: "SiTiktok",
    dribbble: "SiDribbble",
    behance: "SiBehance",
    medium: "SiMedium",
    hashnode: "SiHashnode",
    devto: "SiDevdotto",
    kaggle: "SiKaggle",
    discord: "SiDiscord",
    slack: "SiSlack",
    whatsapp: "SiWhatsapp",
    telegram: "SiTelegram",
    twitch: "SiTwitch",
    reddit: "SiReddit",
    stackoverflow: "SiStackoverflow",
    threads: "SiThreads",
    bluesky: "SiBluesky",
  };

  const iconKey = mapping[normalized];
  const IconComponent = iconKey ? (SiIcons as any)[iconKey] : null;

  if (IconComponent) {
    return <IconComponent className={className} />;
  }

  // Fallback to HugeIcons Globe if unknown
  return <LuIcons.GlobeIcon className={className} />;
}
