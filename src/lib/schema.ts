import { pgTable, text, timestamp, jsonb, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const heroes = pgTable('heroes', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  cvUrl: text('cv_url'),
  imageUrl: text('image_url'),
});

export const abouts = pgTable('abouts', {
  id: uuid('id').primaryKey().defaultRandom(),
  description: text('description').notNull(),
  stats: jsonb('stats'), // Array of { label, value }
});

export const skillCategories = pgTable('skill_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  category: text('category').notNull(),
  skills: jsonb('skills').notNull(), // Array of strings
});

export const services = pgTable('services', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  icon: text('icon'),
});

export const experiences = pgTable('experiences', {
  id: uuid('id').primaryKey().defaultRandom(),
  role: text('role').notNull(),
  company: text('company').notNull(),
  period: text('period').notNull(),
  description: text('description').notNull(),
  achievements: jsonb('achievements').notNull(), // Array of strings
});

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  image: text('image'),
  tags: jsonb('tags').notNull(), // Array of strings
  githubUrl: text('github_url'),
  liveUrl: text('live_url'),
});

export const certifications = pgTable('certifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  issuer: text('issuer').notNull(),
  date: text('date').notNull(),
  description: text('description').notNull(),
  link: text('link'),
  imageUrl: text('image_url'),
});

export const contacts = pgTable('contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull(),
  phone: text('phone'),
  location: text('location'),
});

export const settings = pgTable('settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  logoUrl: text('logo_url'),
  faviconUrl: text('favicon_url'),
  githubUrl: text('github_url'),
  linkedinUrl: text('linkedin_url'),
  email: text('email'),
  primaryColor: text('primary_color'),
  secondaryColor: text('secondary_color'),
  backgroundColor: text('background_color'),
  accentColor: text('accent_color'),
});

export const media = pgTable('media', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  url: text('url').notNull(),
  type: text('type').notNull(), // 'image', 'video', 'document'
  size: text('size'),
  createdAt: timestamp('created_at').defaultNow(),
});
