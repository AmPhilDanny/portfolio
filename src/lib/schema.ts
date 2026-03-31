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
});


/**
 * Media Table: The heart of the Octo-Storage system.
 * Stores binary file content (content) and metadata (mimeType).
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


