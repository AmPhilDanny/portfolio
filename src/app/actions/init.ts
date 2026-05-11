"use server";

import { db } from "@/lib/db";
import { 
  settings, heroes, about, skills, services, 
  experience, projects, certifications, contact, 
  sectionConfigs, socialLinks 
} from "@/lib/schema";
import { revalidatePath } from "next/cache";

export async function initializeDatabase() {
  try {
    // 1. Settings
    const existingSettings = await db.select().from(settings).limit(1);
    if (existingSettings.length === 0) {
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
    const existingHero = await db.select().from(heroes).limit(1);
    if (existingHero.length === 0) {
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
    const existingAbout = await db.select().from(about).limit(1);
    if (existingAbout.length === 0) {
      await db.insert(about).values({
        description: "I am a passionate **Data Analyst** and **Full-Stack Developer** dedicated to bridging the gap between data-driven insights and impactful digital solutions. With a background in analyzing complex datasets and a drive for creating seamless user experiences, I bring a unique perspective to every project.",
        stats: JSON.stringify([
          { label: "Years Exp.", value: "2+" },
          { label: "Projects", value: "20+" },
          { label: "Certificates", value: "10+" }
        ]),
        features: JSON.stringify([
          { title: "Data Visualization", description: "Creating compelling visual stories from raw data.", icon: "BarChart3" },
          { title: "Full-Stack Dev", description: "Building robust web apps from scratch.", icon: "Code2" },
          { title: "Machine Learning", description: "Predictive modeling and statistical analysis.", icon: "Cpu" },
          { title: "Global Delivery", description: "Working with clients across the globe.", icon: "Globe" }
        ])
      });
    }

    // 4. Skills
    const existingSkills = await db.select().from(skills);
    if (existingSkills.length === 0) {
      await db.insert(skills).values([
        { category: "Data Analysis", skills: ["SQL", "Python", "Power BI", "Excel", "Tableau", "Pandas", "NumPy", "Data Visualization"] },
        { category: "Frontend Dev", skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Shadcn/UI"] },
        { category: "Backend Dev", skills: ["Node.js", "Express", "PostgreSQL", "MongoDB", "REST APIs", "Prisma", "Drizzle"] },
        { category: "Tools & Others", skills: ["Git", "GitHub", "Vercel", "Docker", "Agile", "Linux", "R", "Machine Learning"] }
      ]);
    }

    // 5. Services
    const existingServices = await db.select().from(services);
    if (existingServices.length === 0) {
      await db.insert(services).values([
        { title: "Data Analysis & Visualization", description: "Transforming raw data into meaningful insights using tools like Power BI, Tableau, and Python. Providing clear, actionable reports for business growth.", icon: "BarChart3" },
        { title: "Full-Stack Web Development", description: "Building modern, responsive, and high-performance web applications using the latest technologies like Next.js, React, and Node.js.", icon: "Code2" },
        { title: "Database Management", description: "Designing and optimizing database schemas (SQL & NoSQL) to ensure data integrity and fast performance for your applications.", icon: "Database" },
        { title: "Machine Learning Solutions", description: "Implementing predictive models and automated data processing pipelines to help businesses stay ahead of the competition.", icon: "BrainCircuit" }
      ]);
    }

    // 6. Experience
    const existingExperience = await db.select().from(experience);
    if (existingExperience.length === 0) {
      await db.insert(experience).values([
        { company: "Data Insight Corp", role: "Junior Data Analyst", period: "2023 - Present", description: "Analyzing large datasets to identify market trends and presenting findings to stakeholders." },
        { company: "TechNova Solutions", role: "Frontend Developer Intern", period: "2022 - 2023", description: "Assisted in building responsive UI components and improving website performance." }
      ]);
    }

    // 7. Projects
    const existingProjects = await db.select().from(projects);
    if (existingProjects.length === 0) {
      await db.insert(projects).values([
        { title: "E-Commerce Analytics Dashboard", description: "A comprehensive dashboard for visualizing sales data and customer demographics.", image: "📊", tags: ["Power BI", "SQL", "Python"], githubUrl: "#", liveUrl: "#" },
        { title: "Campus Queue Manager", description: "A full-stack application addressing long queue times on campus.", image: "🎓", tags: ["Next.js", "TypeScript", "Tailwind CSS"], githubUrl: "#", liveUrl: "#" },
        { title: "Sales Forecasting Model", description: "Machine learning model to predict future sales based on historical data.", image: "📈", tags: ["Python", "Scikit-Learn", "Pandas"], githubUrl: "#", liveUrl: "#" }
      ]);
    }

    // 8. Certifications
    const existingCerts = await db.select().from(certifications);
    if (existingCerts.length === 0) {
      await db.insert(certifications).values([
        { title: "Google Data Analytics Professional Certificate", issuer: "Coursera / Google", date: "2023", credentialId: "GOOGLE-123456", credentialUrl: "#" },
        { title: "Full-Stack Web Development Bootcamp", issuer: "Udemy", date: "2022", credentialId: "UDEMY-987654", credentialUrl: "#" }
      ]);
    }

    // 9. Contact
    const existingContact = await db.select().from(contact).limit(1);
    if (existingContact.length === 0) {
      await db.insert(contact).values({
        email: "amaechiphilipekaba@gmail.com",
        phone: "+234 XXX XXX XXXX",
        location: "Lagos, Nigeria"
      });
    }

    // 10. Section Configs
    const existingConfigs = await db.select().from(sectionConfigs);
    if (existingConfigs.length === 0) {
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
    const existingSocials = await db.select().from(socialLinks);
    if (existingSocials.length === 0) {
      await db.insert(socialLinks).values([
        { platform: "GitHub", url: "https://github.com/AmPhilDanny", icon: "Github" },
        { platform: "LinkedIn", url: "https://linkedin.com/in/amaechiphilipekaba", icon: "Linkedin" },
        { platform: "X", url: "https://x.com", icon: "Twitter" },
        { platform: "Instagram", url: "https://instagram.com", icon: "Instagram" }
      ]);
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Initialization failed:", error);
    return { success: false };
  }
}
