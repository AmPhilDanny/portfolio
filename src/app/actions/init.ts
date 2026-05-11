"use server";

import { db } from "@/lib/db";
import { 
  settings, heroes, abouts, skillCategories, services, 
  experiences, projects, certifications, contacts, 
  sectionConfigs, socialLinks 
} from "@/lib/schema";
import { revalidatePath } from "next/cache";

import { sql } from "drizzle-orm";

export async function initializeDatabase() {
  console.log("Starting database initialization...");
  try {
    // 0. Pre-check: Ensure schema is up to date (Self-healing migration)
    console.log("Syncing schema...");
    try {
      // Ensure columns exist
      await db.execute(sql`ALTER TABLE heroes ADD COLUMN IF NOT EXISTS badge_text text`);
      
      // Ensure tables exist (Basic definitions to avoid select failures)
      await db.execute(sql`CREATE TABLE IF NOT EXISTS abouts (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), description text NOT NULL, stats jsonb, features jsonb)`);
      await db.execute(sql`CREATE TABLE IF NOT EXISTS skill_categories (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), category text NOT NULL, skills jsonb NOT NULL)`);
      await db.execute(sql`CREATE TABLE IF NOT EXISTS experiences (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), role text NOT NULL, company text NOT NULL, period text NOT NULL, description text NOT NULL, achievements jsonb NOT NULL)`);
      await db.execute(sql`CREATE TABLE IF NOT EXISTS certifications (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, issuer text NOT NULL, date text NOT NULL, description text NOT NULL, link text, image_url text)`);
      await db.execute(sql`CREATE TABLE IF NOT EXISTS contacts (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), email text NOT NULL, phone text, location text)`);
      await db.execute(sql`CREATE TABLE IF NOT EXISTS section_configs (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), section_id text NOT NULL UNIQUE, title text NOT NULL, description text)`);
      await db.execute(sql`CREATE TABLE IF NOT EXISTS social_links (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), platform text NOT NULL, url text NOT NULL, icon text)`);
      
      // AI Social Media Strategist Tables
      await db.execute(sql`CREATE TABLE IF NOT EXISTS social_media_insights (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(), 
        platform text NOT NULL, 
        handle text, 
        follower_count text, 
        following_count text, 
        engagement_rate text, 
        analysis_summary text, 
        screenshot_url text, 
        raw_ai_response text, 
        last_analyzed timestamp DEFAULT now()
      )`);
      await db.execute(sql`CREATE TABLE IF NOT EXISTS social_platform_metrics (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(), 
        platform text NOT NULL, 
        metric_type text NOT NULL, 
        value text NOT NULL, 
        recorded_at timestamp DEFAULT now()
      )`);
      await db.execute(sql`CREATE TABLE IF NOT EXISTS content_calendar (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(), 
        platform text NOT NULL, 
        content text NOT NULL, 
        media_url text, 
        hashtags text, 
        status text DEFAULT 'draft', 
        suggested_post_date timestamp, 
        created_at timestamp DEFAULT now()
      )`);
      await db.execute(sql`CREATE TABLE IF NOT EXISTS ai_config (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(), 
        platform text NOT NULL UNIQUE, 
        brand_voice text, 
        target_audience text, 
        preferred_model text DEFAULT 'mistral', 
        growth_goals text
      )`);
      
      console.log("Schema synced successfully.");
    } catch (e: any) {
      console.warn("Schema sync warning:", e.message);
    }

    // 1. Settings
    console.log("Checking Settings...");
    const existingSettings = await db.select().from(settings).limit(1);
    if (existingSettings.length === 0) {
      console.log("Seeding Settings...");
      await db.insert(settings).values({
        siteName: "NovaxFolio",
        email: "philipdaniel.philip@gmail.com",
        copyrightText: "NovaxFolio | Amaechi Philip Ekaba. All rights reserved.",
        primaryColor: "#2563eb",
        secondaryColor: "#059669",
        backgroundColor: "#020617",
        accentColor: "#d97706",
        fontFamily: "Inter"
      });
    }

    // 2. Hero
    console.log("Checking Hero...");
    const existingHero = await db.select().from(heroes).limit(1);
    if (existingHero.length === 0) {
      console.log("Seeding Hero...");
      await db.insert(heroes).values({
        name: "Amaechi Philip Ekaba",
        title: "Certified Data Analyst & Junior Full-Stack Developer",
        description: "Transforming complex data into actionable insights and building modern, responsive web applications.",
        badgeText: "Available for Work",
        cvUrl: "/resume.pdf",
        imageUrl: "/profile.jpg"
      });
    }

    // 3. About
    console.log("Checking About...");
    const existingAbout = await db.select().from(abouts).limit(1);
    if (existingAbout.length === 0) {
      console.log("Seeding About...");
      await db.insert(abouts).values({
        description: "I am a passionate **Data Analyst** and **Full-Stack Developer** dedicated to bridging the gap between data-driven insights and impactful digital solutions. With a background in analyzing complex datasets and a drive for creating seamless user experiences, I bring a unique perspective to every project.",
        stats: [
          { label: "Years Exp.", value: "2+" },
          { label: "Projects", value: "20+" },
          { label: "Certificates", value: "10+" }
        ],
        features: [
          { title: "Data Visualization", description: "Creating compelling visual stories from raw data.", icon: "bar-chart-3" },
          { title: "Full-Stack Dev", description: "Building robust web apps from scratch.", icon: "code-2" },
          { title: "Machine Learning", description: "Predictive modeling and statistical analysis.", icon: "cpu" },
          { title: "Global Delivery", description: "Working with clients across the globe.", icon: "globe" }
        ]
      });
    }

    // 4. Skills
    console.log("Checking Skills...");
    const existingSkills = await db.select().from(skillCategories);
    if (existingSkills.length === 0) {
      console.log("Seeding Skills...");
      await db.insert(skillCategories).values([
        { category: "Data Analysis", skills: ["SQL", "Python", "Power BI", "Excel", "Tableau", "Pandas", "NumPy", "Data Visualization"] },
        { category: "Frontend Dev", skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Shadcn/UI"] },
        { category: "Backend Dev", skills: ["Node.js", "Express", "PostgreSQL", "MongoDB", "REST APIs", "Prisma", "Drizzle"] },
        { category: "Tools & Others", skills: ["Git", "GitHub", "Vercel", "Docker", "Agile", "Linux", "R", "Machine Learning"] }
      ]);
    }

    // 5. Services
    console.log("Checking Services...");
    const existingServices = await db.select().from(services);
    if (existingServices.length === 0) {
      console.log("Seeding Services...");
      await db.insert(services).values([
        { title: "Data Analysis & Visualization", description: "Transforming raw data into meaningful insights using tools like Power BI, Tableau, and Python. Providing clear, actionable reports for business growth.", icon: "bar-chart-3" },
        { title: "Full-Stack Web Development", description: "Building modern, responsive, and high-performance web applications using the latest technologies like Next.js, React, and Node.js.", icon: "code-2" },
        { title: "Database Management", description: "Designing and optimizing database schemas (SQL & NoSQL) to ensure data integrity and fast performance for your applications.", icon: "database" },
        { title: "Machine Learning Solutions", description: "Implementing predictive models and automated data processing pipelines to help businesses stay ahead of the competition.", icon: "brain-circuit" }
      ]);
    }

    // 6. Experience
    console.log("Checking Experience...");
    const existingExperience = await db.select().from(experiences);
    if (existingExperience.length === 0) {
      console.log("Seeding Experience...");
      await db.insert(experiences).values([
        { role: "Junior Data Analyst", company: "Data Insight Corp", period: "2023 - Present", description: "Analyzing large datasets to identify market trends and presenting findings to stakeholders.", achievements: ["Increased reporting efficiency by 30%", "Developed automated cleanup scripts"] },
        { role: "Frontend Developer Intern", company: "TechNova Solutions", period: "2022 - 2023", description: "Assisted in building responsive UI components and improving website performance.", achievements: ["Optimized page load times by 20%", "Implemented 10+ reusable components"] }
      ]);
    }

    // 7. Projects
    console.log("Checking Projects...");
    const existingProjects = await db.select().from(projects);
    if (existingProjects.length === 0) {
      console.log("Seeding Projects...");
      await db.insert(projects).values([
        { title: "E-Commerce Analytics Dashboard", description: "A comprehensive dashboard for visualizing sales data and customer demographics.", image: "📊", tags: ["Power BI", "SQL", "Python"], githubUrl: "#", liveUrl: "#" },
        { title: "Campus Queue Manager", description: "A full-stack application addressing long queue times on campus.", image: "🎓", tags: ["Next.js", "TypeScript", "Tailwind CSS"], githubUrl: "#", liveUrl: "#" },
        { title: "Sales Forecasting Model", description: "Machine learning model to predict future sales based on historical data.", image: "📈", tags: ["Python", "Scikit-Learn", "Pandas"], githubUrl: "#", liveUrl: "#" }
      ]);
    }

    // 8. Certifications
    console.log("Checking Certifications...");
    const existingCerts = await db.select().from(certifications);
    if (existingCerts.length === 0) {
      console.log("Seeding Certifications...");
      await db.insert(certifications).values([
        { name: "Google Data Analytics Professional Certificate", issuer: "Coursera / Google", date: "2023", description: "Comprehensive data analytics training.", link: "#" },
        { name: "Full-Stack Web Development Bootcamp", issuer: "Udemy", date: "2022", description: "Modern web development from scratch.", link: "#" }
      ]);
    }

    // 9. Contact
    console.log("Checking Contact...");
    const existingContact = await db.select().from(contacts).limit(1);
    if (existingContact.length === 0) {
      console.log("Seeding Contact...");
      await db.insert(contacts).values({
        email: "amaechiphilipekaba@gmail.com",
        phone: "+234 XXX XXX XXXX",
        location: "Lagos, Nigeria"
      });
    }

    // 10. Section Configs
    console.log("Checking Section Configs...");
    const existingConfigs = await db.select().from(sectionConfigs);
    if (existingConfigs.length === 0) {
      console.log("Seeding Section Configs...");
      await db.insert(sectionConfigs).values([
        { sectionId: "skills", title: "Technical Skills", description: "A specialized toolkit for data analysis and web development." },
        { sectionId: "services", title: "My Expertise", description: "Bridging the gap between data and digital solutions." },
        { sectionId: "experience", title: "Professional Journey", description: "A timeline of my career growth and achievements." },
        { sectionId: "projects", title: "Featured Projects", description: "Showcasing some of my best work." },
        { sectionId: "certifications", title: "Certifications", description: "Formal recognition of my skills and dedication." },
        { sectionId: "contact", title: "Get in Touch", description: "I'm always open to discussing new projects and opportunities." }
      ]);
    }

    // 11. Social Links
    console.log("Checking Social Links...");
    const existingSocials = await db.select().from(socialLinks);
    if (existingSocials.length === 0) {
      console.log("Seeding Social Links...");
      await db.insert(socialLinks).values([
        { platform: "GitHub", url: "https://github.com/AmPhilDanny", icon: "Github" },
        { platform: "LinkedIn", url: "https://linkedin.com/in/amaechiphilipekaba", icon: "Linkedin" },
        { platform: "X", url: "https://x.com", icon: "Twitter" },
        { platform: "Instagram", url: "https://instagram.com", icon: "Instagram" }
      ]);
    }

    console.log("Revalidating path...");
    revalidatePath("/");
    console.log("Initialization complete!");
    return { success: true };
  } catch (error: any) {
    console.error("Initialization failed at stage:", error.message);
    return { success: false, error: error.message };
  }
}
