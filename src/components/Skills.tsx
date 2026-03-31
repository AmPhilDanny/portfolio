"use client";

import { motion } from "framer-motion";

const skillsData = [
  {
    category: "Data Analysis",
    skills: ["SQL", "Python", "Power BI", "Excel", "Tableau", "Pandas", "NumPy", "Data Visualization"],
  },
  {
    category: "Frontend Development",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML5", "CSS3", "Framer Motion", "Redux"],
  },
  {
    category: "Backend Development",
    skills: ["Node.js", "Express.js", "RESTful APIs", "MongoDB", "PostgreSQL", "Prisma", "Authentication"],
  },
  {
    category: "Tools & Others",
    skills: ["Git", "GitHub", "VS Code", "Postman", "Agile", "Problem Solving", "Communication", "Vercel"],
  },
];

/**
 * Skills Section: Provides a categorized overview of technical proficiencies.
 * Groups skills into domains like Data Analysis, Frontend, and Backend.
 * Features animated cards and hover-responsive skill badges.
 */
export default function Skills() {

  return (
    <section id="skills" className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
      <div className="container px-4 mx-auto max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4"
          >
            Technical Skills
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-400"
          >
            A comprehensive overview of my technical expertise in data analysis and software development.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {skillsData.map((category, idx) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="tech-card p-8 rounded-2xl shadow-sm"
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                {category.category}
              </h3>

              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill) => (
                  <span 
                    key={skill}
                    className="px-4 py-2 bg-primary/5 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium border border-primary/10 hover:border-primary hover:text-primary transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
