"use server";

import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function initializeDatabase() {
  console.log("Starting database initialization (MongoDB)...");
  try {
    const db = await getDb();

    // 1. Settings
    console.log("Checking Settings...");
    const existingSettings = await db.collection<any>("settings").findOne({});
    if (!existingSettings) {
      console.log("Seeding Settings...");
      await db.collection<any>("settings").insertOne({
        _id: crypto.randomUUID(),
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
    const existingHero = await db.collection<any>("heroes").findOne({});
    if (!existingHero) {
      console.log("Seeding Hero...");
      await db.collection<any>("heroes").insertOne({
        _id: crypto.randomUUID(),
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
    const existingAbout = await db.collection<any>("abouts").findOne({});
    if (!existingAbout) {
      console.log("Seeding About...");
      await db.collection<any>("abouts").insertOne({
        _id: crypto.randomUUID(),
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
    const skillsCount = await db.collection<any>("skill_categories").countDocuments();
    if (skillsCount === 0) {
      console.log("Seeding Skills...");
      await db.collection<any>("skill_categories").insertMany([
        { _id: crypto.randomUUID(), category: "Data Analysis", skills: ["SQL", "Python", "Power BI", "Excel", "Tableau", "Pandas", "NumPy", "Data Visualization"] },
        { _id: crypto.randomUUID(), category: "Frontend Dev", skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Shadcn/UI"] },
        { _id: crypto.randomUUID(), category: "Backend Dev", skills: ["Node.js", "Express", "PostgreSQL", "MongoDB", "REST APIs", "Prisma", "Drizzle"] },
        { _id: crypto.randomUUID(), category: "Tools & Others", skills: ["Git", "GitHub", "Vercel", "Docker", "Agile", "Linux", "R", "Machine Learning"] }
      ]);
    }

    // 5. Services
    console.log("Checking Services...");
    const servicesCount = await db.collection<any>("services").countDocuments();
    if (servicesCount === 0) {
      console.log("Seeding Services...");
      await db.collection<any>("services").insertMany([
        { _id: crypto.randomUUID(), title: "Data Analysis & Visualization", description: "Transforming raw data into meaningful insights using tools like Power BI, Tableau, and Python. Providing clear, actionable reports for business growth.", icon: "bar-chart-3" },
        { _id: crypto.randomUUID(), title: "Full-Stack Web Development", description: "Building modern, responsive, and high-performance web applications using the latest technologies like Next.js, React, and Node.js.", icon: "code-2" },
        { _id: crypto.randomUUID(), title: "Database Management", description: "Designing and optimizing database schemas (SQL & NoSQL) to ensure data integrity and fast performance for your applications.", icon: "database" },
        { _id: crypto.randomUUID(), title: "Machine Learning Solutions", description: "Implementing predictive models and automated data processing pipelines to help businesses stay ahead of the competition.", icon: "brain-circuit" }
      ]);
    }

    // 6. Experience
    console.log("Checking Experience...");
    const expCount = await db.collection<any>("experiences").countDocuments();
    if (expCount === 0) {
      console.log("Seeding Experience...");
      await db.collection<any>("experiences").insertMany([
        { _id: crypto.randomUUID(), role: "Junior Data Analyst", company: "Data Insight Corp", period: "2023 - Present", description: "Analyzing large datasets to identify market trends and presenting findings to stakeholders.", achievements: ["Increased reporting efficiency by 30%", "Developed automated cleanup scripts"] },
        { _id: crypto.randomUUID(), role: "Frontend Developer Intern", company: "TechNova Solutions", period: "2022 - 2023", description: "Assisted in building responsive UI components and improving website performance.", achievements: ["Optimized page load times by 20%", "Implemented 10+ reusable components"] }
      ]);
    }

    // 7. Projects
    console.log("Checking Projects...");
    const projCount = await db.collection<any>("projects").countDocuments();
    if (projCount === 0) {
      console.log("Seeding Projects...");
      await db.collection<any>("projects").insertMany([
        { _id: crypto.randomUUID(), title: "E-Commerce Analytics Dashboard", description: "A comprehensive dashboard for visualizing sales data and customer demographics.", image: "📊", tags: ["Power BI", "SQL", "Python"], githubUrl: "#", liveUrl: "#" },
        { _id: crypto.randomUUID(), title: "Campus Queue Manager", description: "A full-stack application addressing long queue times on campus.", image: "🎓", tags: ["Next.js", "TypeScript", "Tailwind CSS"], githubUrl: "#", liveUrl: "#" },
        { _id: crypto.randomUUID(), title: "Sales Forecasting Model", description: "Machine learning model to predict future sales based on historical data.", image: "📈", tags: ["Python", "Scikit-Learn", "Pandas"], githubUrl: "#", liveUrl: "#" }
      ]);
    }

    // 8. Certifications
    console.log("Checking Certifications...");
    const certCount = await db.collection<any>("certifications").countDocuments();
    if (certCount === 0) {
      console.log("Seeding Certifications...");
      await db.collection<any>("certifications").insertMany([
        { _id: crypto.randomUUID(), name: "Google Data Analytics Professional Certificate", issuer: "Coursera / Google", date: "2023", description: "Comprehensive data analytics training.", link: "#" },
        { _id: crypto.randomUUID(), name: "Full-Stack Web Development Bootcamp", issuer: "Udemy", date: "2022", description: "Modern web development from scratch.", link: "#" }
      ]);
    }

    // 9. Contact
    console.log("Checking Contact...");
    const existingContact = await db.collection<any>("contacts").findOne({});
    if (!existingContact) {
      console.log("Seeding Contact...");
      await db.collection<any>("contacts").insertOne({
        _id: crypto.randomUUID(),
        email: "amaechiphilipekaba@gmail.com",
        phone: "+234 XXX XXX XXXX",
        location: "Lagos, Nigeria"
      });
    }

    // 10. Section Configs
    console.log("Checking Section Configs...");
    const configCount = await db.collection<any>("section_configs").countDocuments();
    if (configCount === 0) {
      console.log("Seeding Section Configs...");
      await db.collection<any>("section_configs").insertMany([
        { _id: crypto.randomUUID(), sectionId: "skills", title: "Technical Skills", description: "A specialized toolkit for data analysis and web development." },
        { _id: crypto.randomUUID(), sectionId: "services", title: "My Expertise", description: "Bridging the gap between data and digital solutions." },
        { _id: crypto.randomUUID(), sectionId: "experience", title: "Professional Journey", description: "A timeline of my career growth and achievements." },
        { _id: crypto.randomUUID(), sectionId: "projects", title: "Featured Projects", description: "Showcasing some of my best work." },
        { _id: crypto.randomUUID(), sectionId: "certifications", title: "Certifications", description: "Formal recognition of my skills and dedication." },
        { _id: crypto.randomUUID(), sectionId: "contact", title: "Get in Touch", description: "I'm always open to discussing new projects and opportunities." }
      ]);
    }

    // 11. Social Links
    console.log("Checking Social Links...");
    const socialCount = await db.collection<any>("social_links").countDocuments();
    if (socialCount === 0) {
      console.log("Seeding Social Links...");
      await db.collection<any>("social_links").insertMany([
        { _id: crypto.randomUUID(), platform: "GitHub", url: "https://github.com/AmPhilDanny", icon: "Github" },
        { _id: crypto.randomUUID(), platform: "LinkedIn", url: "https://linkedin.com/in/amaechiphilipekaba", icon: "Linkedin" },
        { _id: crypto.randomUUID(), platform: "X", url: "https://x.com", icon: "Twitter" },
        { _id: crypto.randomUUID(), platform: "Instagram", url: "https://instagram.com", icon: "Instagram" }
      ]);
    }

    revalidatePath("/");
    console.log("Initialization complete!");
    return { success: true };
  } catch (error: any) {
    console.error("Initialization failed:", error.message);
    return { success: false, error: error.message };
  }
}
