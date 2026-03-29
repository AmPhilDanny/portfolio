"use client";

import { motion } from "framer-motion";
import { ExternalLink, FolderOpen } from "lucide-react";

// Replace Lucide Github brand icon with custom SVG due to removal in recent versions.
const GithubIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);

const projects = [
  {
    title: "E-Commerce Analytics Dashboard",
    description: "A comprehensive dashboard for visualizing sales data, customer demographics, and product performance using complex datasets.",
    image: "📊", 
    tags: ["Power BI", "SQL", "Python", "Data Cleaning"],
    githubUrl: "#",
    liveUrl: "#"
  },
  {
    title: "Campus Queue Manager",
    description: "A full-stack application addressing long queue times on campus. Features real-time updates, role-based access, and analytics.",
    image: "🎓",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js", "MongoDB"],
    githubUrl: "#",
    liveUrl: "#"
  },
  {
    title: "Sales Forecasting Model",
    description: "Machine learning model to predict future sales based on historical data, seasonal trends, and promotional events.",
    image: "📈",
    tags: ["Python", "Scikit-Learn", "Pandas", "Matplotlib"],
    githubUrl: "#",
    liveUrl: "#"
  },
  {
    title: "Real Estate Property Platform",
    description: "A responsive website for browsing properties, featuring advanced search filters, user authentication, and property management.",
    image: "🏠",
    tags: ["React", "Express", "PostgreSQL", "Firebase Auth"],
    githubUrl: "#",
    liveUrl: "#"
  }
];

export default function Projects({ data }: { data?: any[] }) {
  const displayProjects = data && data.length > 0 ? data : projects;

  return (
    <section id="projects" className="py-24 bg-white dark:bg-black relative">
      <div className="container px-4 mx-auto max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4"
          >
            Featured Projects
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-400"
          >
            Showcasing some of my best work in data analysis and web development.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {displayProjects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="h-48 bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-6xl relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                  <div className="flex gap-4">
                    <a href={project.githubUrl} className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur text-white rounded-full transition-colors">
                      <GithubIcon className="w-5 h-5" />
                    </a>
                    <a href={project.liveUrl} className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur text-white rounded-full transition-colors">
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </div>
                {project.image}
              </div>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <FolderOpen className="w-5 h-5 text-blue-500" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {project.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tags.map((tag: string) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-white dark:bg-black text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 text-xs font-semibold rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
