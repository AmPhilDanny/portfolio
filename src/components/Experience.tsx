"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";

const experiences = [
  {
    role: "Data Analyst & Junior Full-Stack Developer",
    company: "Freelance / Independent",
    period: "2022 - Present",
    description: "Developed end-to-end web applications and performed complex data analysis to drive business decisions.",
    achievements: [
      "Built responsive, dynamic web interfaces using React and Next.js.",
      "Designed and optimized relational databases with SQL and PostgreSQL.",
      "Extracted key business insights using Python and Power BI, creating interactive dashboards.",
      "Implemented RESTful APIs and backend services using Node.js."
    ]
  },
  {
    role: "Data Analyst Intern",
    company: "Tech Solutions Inc.",
    period: "2021 - 2022",
    description: "Assisted the data team in cleaning, processing, and analyzing large datasets to identify market trends.",
    achievements: [
      "Automated data cleaning processes using Python and pandas, saving 10 hours weekly.",
      "Created visualizations in Tableau that helped increase sales conversions by 15%.",
      "Collaborated with cross-functional teams to define KPIs and deliver weekly reports."
    ]
  }
];

export default function Experience() {
  return (
    <section id="experience" className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
      <div className="container px-4 mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4"
          >
            Professional Experience
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-400"
          >
            My career journey and professional achievements.
          </motion.p>
        </div>

        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-8 md:pl-0"
            >
              <div className="md:grid md:grid-cols-5 md:gap-8 items-start">
                <div className="hidden md:block md:col-span-1 border-r-2 border-gray-200 dark:border-gray-800 h-full relative">
                  <div className="absolute top-0 right-[-9px] w-4 h-4 rounded-full bg-primary ring-4 ring-background" />
                  <div className="pt-1 pr-6 text-right">
                    <span className="text-sm font-semibold text-primary flex items-center justify-end gap-2">
                      <Calendar className="w-4 h-4" />
                      {exp.period}
                    </span>
                  </div>
                </div>
                
                <div className="md:col-span-4 tech-card p-8 rounded-2xl relative shadow-sm">
                  {/* Mobile timeline marker */}
                  <div className="md:hidden absolute -left-[33px] top-6 w-4 h-4 rounded-full bg-primary ring-4 ring-background" />
                  <div className="md:hidden mb-4 text-sm font-semibold text-primary flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {exp.period}
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {exp.role}
                    </h3>
                  </div>
                  <h4 className="border-b border-gray-100 dark:border-gray-800 pb-4 text-lg font-medium text-gray-600 dark:text-gray-400 mb-4">
                    {exp.company}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {exp.description}
                  </p>
                  <ul className="space-y-3">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
