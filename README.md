# NovaxFolio | Data-Driven Portfolio CMS

**NovaxFolio** is a high-performance, professional-grade portfolio engine built for Data Analysts and Software Engineers who demand total control over their digital presence without relying on third-party cloud blobs or complex hosting setups.

---

## 🚀 Vision

NovaxFolio was designed to bridge the gap between static design and complex backend management. It provides a "Zero-Setup" ecosystem where all media, assets, and project data are stored directly in a high-performance PostgreSQL database, making the application fully portable and server-agnostic.

## ✨ Core Features

### 📦 Integrated Media Vault
- Store binary files (`.zip`, `.pdf`, `.xlsx`, `.docx`, `.png`) directly in your **Neon PostgreSQL** database.
- custom-built API streaming that serves your assets with high performance and optimized caching.

### 🛠️ High-Performance CMS
- Full-stack administrative dashboard for managing every section of your portfolio.
- **Dynamic Content**: Instantly update Skills, Projects, Experience, and Certifications without a redeploy.
- **Brand Control**: Change primary colors, typography, logos, and custom CSS globally via a secure settings panel.

### 🎨 Tech-Centric Aesthetics
- **Glassmorphic UI**: High-end translucent interfaces with adaptive glows and animated transitions.
- **Universal Themes**: Seamlessly switch between Light and Dark modes with persistent user preferences.
- **Interactive Navigation**: Integrated scroll progress tracking and floating glassmorphic navigation buttons.

### 🌐 Universal Portability
- Built on **Next.js 16+ (App Router)** and **Tailwind CSS 4.0**.
- **Host-Ready**: Fully compatible with Vercel, cPanel, VPS, or any Node.js-ready hosting provider.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16+, Framer Motion, Tailwind CSS 4.0
- **Backend/Logic**: Next.js Server Actions, Route Handlers
- **Database/ORM**: Neon PostgreSQL, Drizzle ORM
- **Auth**: NextAuth.js
- **Icons**: Lucide React

---

## ⚙️ Getting Started

### 1. Requirements
- Node.js 20+
- A Neon PostgreSQL database instance

### 2. Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/AmPhilDanny/portfolio.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (`.env`):
   ```env
   DATABASE_URL=postgresql://user:pass@host/db
   NEXTAUTH_SECRET=your_secret_here
   NEXTAUTH_URL=http://localhost:3000
   ```
4. Push the schema:
   ```bash
   npx drizzle-kit push
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```

---

## 📝 License
Copyright © 2026 NovaxFolio | Amaechi Philip Ekaba. All rights reserved.
