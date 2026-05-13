/**
 * NovaxFolio Database Schema
 * 
 * This file defines the core PostgreSQL schema using Drizzle ORM. 
 * It includes specialized types like 'bytea' for binary storage, enabling 
 * the site's unique 'Zero-Setup' media management system.
 */

import { pgTable, text, timestamp, jsonb, uuid, customType } from 'drizzle-orm/pg-core';

/**
 * Custom 'bytea' type for Drizzle ORM.
 * This allows us to store raw binary Buffer data (Images, ZIPs, PDFs) 
 * directly in the PostgreSQL database.
 */
export const bytea = customType<{ data: Buffer }>({
  dataType() {
    return 'bytea';
  },
});

/**
 * User Table: Secure admin accounts
 */
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

/**
 * Heroes Table: Main landing page identity and bio
 */
export const heroes = pgTable('heroes', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  badgeText: text('badge_text'), // e.g. "Available for Work"
  cvUrl: text('cv_url'),
  imageUrl: text('image_url'),
});

/**
 * Abouts Table: Detailed personal description and key metrics
 */
export const abouts = pgTable('abouts', {
  id: uuid('id').primaryKey().defaultRandom(),
  description: text('description').notNull(),
  stats: jsonb('stats'), // Array of { label, value }
  features: jsonb('features'), // Array of { name, description, icon }
});

/**
 * Skill Categories Table: Organized technical proficiency groups
 */
export const skillCategories = pgTable('skill_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  category: text('category').notNull(),
  skills: jsonb('skills').notNull(), // Array of strings
});

/**
 * Services Table: Professional offerings and icons
 */
export const services = pgTable('services', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  icon: text('icon'),
});

/**
 * Experiences Table: Career history and key achievements
 */
export const experiences = pgTable('experiences', {
  id: uuid('id').primaryKey().defaultRandom(),
  role: text('role').notNull(),
  company: text('company').notNull(),
  period: text('period').notNull(),
  description: text('description').notNull(),
  achievements: jsonb('achievements').notNull(), // Array of strings
});

/**
 * Projects Table: Portfolio of work with integrated asset attachments
 */
export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  image: text('image'),
  tags: jsonb('tags').notNull(), // Array of strings
  githubUrl: text('github_url'),
  liveUrl: text('live_url'),
  projectFileUrl: text('project_file_url'),
});

/**
 * Certifications Table: Official credentials and external links
 */
export const certifications = pgTable('certifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  issuer: text('issuer').notNull(),
  date: text('date').notNull(),
  description: text('description').notNull(),
  link: text('link'),
  imageUrl: text('image_url'),
});

/**
 * Contacts Table: Contact info and location settings
 */
export const contacts = pgTable('contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull(),
  phone: text('phone'),
  location: text('location'),
});

/**
 * Settings Table: Global site configuration and branding
 */
export const settings = pgTable('settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  siteName: text('site_name'),
  showSiteName: text('show_site_name').default('true'), // Use text 'true'/'false' for simpler form handling
  logoUrl: text('logo_url'),
  faviconUrl: text('favicon_url'),
  copyrightText: text('copyright_text'),
  githubUrl: text('github_url'),
  linkedinUrl: text('linkedin_url'),
  twitterUrl: text('twitter_url'),
  facebookUrl: text('facebook_url'),
  instagramUrl: text('instagram_url'),
  email: text('email'),
  primaryColor: text('primary_color'),
  secondaryColor: text('secondary_color'),
  backgroundColor: text('background_color'),
  accentColor: text('accent_color'),
  fontFamily: text('font_family'),
  customCss: text('custom_css'),
  geminiApiKey: text('gemini_api_key'),
  mistralApiKey: text('mistral_api_key'),
  openrouterApiKey: text('openrouter_api_key'),
  globalAiModel: text('global_ai_model').default('mistral-large'), // 'gemini-pro' | 'gemini-vision' | 'mistral-large' | 'gpt-4o'
});


/**
 * Social Links Table: Dynamic list of social media profiles
 */
export const sectionConfigs = pgTable('section_configs', {
  id: uuid('id').primaryKey().defaultRandom(),
  sectionId: text('section_id').notNull().unique(), // e.g. "skills", "services", "experience"
  title: text('title').notNull(),
  description: text('description'),
});

/**
 * Social Links Table: Dynamic list of social media profiles
 */
export const socialLinks = pgTable('social_links', {
  id: uuid('id').primaryKey().defaultRandom(),
  platform: text('platform').notNull(), // e.g. "GitHub", "Kaggle"
  url: text('url').notNull(),
  icon: text('icon'), // Lucide icon name or platform name
});


/**
 * Media Table: The heart of the Octo-Storage system.
 */
export const media = pgTable('media', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  url: text('url').notNull(),
  type: text('type').notNull(), // 'image', 'video', 'document'
  size: text('size'),
  content: bytea('content'),
  mimeType: text('mime_type'),
  createdAt: timestamp('created_at').defaultNow(),
});

/**
 * AI Social Media Intelligence: Insight extraction from profile screenshots.
 */
export const socialMediaInsights = pgTable('social_media_insights', {
  id: uuid('id').primaryKey().defaultRandom(),
  platform: text('platform').notNull(), // e.g. "GitHub", "X"
  handle: text('handle'),
  followerCount: text('follower_count'),
  followingCount: text('following_count'),
  engagementRate: text('engagement_rate'),
  analysisSummary: text('analysis_summary'),
  screenshotUrl: text('screenshot_url'),
  rawAiResponse: text('raw_ai_response'),
  lastAnalyzed: timestamp('last_analyzed').defaultNow(),
});

/**
 * AI Social Media Learning: Historical growth metrics.
 */
export const socialPlatformMetrics = pgTable('social_platform_metrics', {
  id: uuid('id').primaryKey().defaultRandom(),
  platform: text('platform').notNull(),
  metricType: text('metric_type').notNull(), // 'followers', 'likes', 'views'
  value: text('value').notNull(),
  recordedAt: timestamp('recorded_at').defaultNow(),
});

/**
 * Content Calendar: AI-generated social media posts.
 */
export const contentCalendar = pgTable('content_calendar', {
  id: uuid('id').primaryKey().defaultRandom(),
  platform: text('platform').notNull(),
  content: text('content').notNull(),
  mediaUrl: text('media_url'),
  hashtags: text('hashtags'),
  status: text('status').default('draft'), // 'draft', 'scheduled', 'posted'
  suggestedPostDate: timestamp('suggested_post_date'),
  createdAt: timestamp('created_at').defaultNow(),
});

/**
 * AI Configuration: Per-platform "Brand Voice" and model settings.
 */
export const aiConfig = pgTable('ai_config', {
  id: uuid('id').primaryKey().defaultRandom(),
  platform: text('platform').notNull().unique(),
  profileUrl: text('profile_url'),               // e.g. https://github.com/AmPhilDanny
  brandVoice: text('brand_voice'),
  targetAudience: text('target_audience'),
  preferredModel: text('preferred_model').default('mistral-large'),
  growthGoals: text('growth_goals'),
});
