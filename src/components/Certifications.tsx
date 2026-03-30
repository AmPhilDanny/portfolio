"use client";

import { motion } from "framer-motion";
import { Award, ExternalLink } from "lucide-react";

const certifications = [
  {
    name: "Certified Data Analyst",
    issuer: "Google Professional Certificate",
    date: "2023",
    description: "Rigorous training on data cleaning, analysis, visualization, and tools like R, SQL, and Tableau.",
    link: "#"
  },
  {
    name: "Full-Stack Web Development Certificate",
    issuer: "freeCodeCamp",
    date: "2022",
    description: "Comprehensive coursework covering HTML, CSS, JavaScript, React, Node.js, and databases.",
    link: "#"
  },
  {
    name: "Microsoft Certified: Power BI Data Analyst Associate",
    issuer: "Microsoft",
    date: "2023",
    description: "Validated expertise in data modeling, visualization, and extracting insights using Power BI.",
    link: "#"
  }
];

export default function Certifications() {
  return (
    <section id="certifications" className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
      <div className="container px-4 mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4"
          >
            Certifications
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-400"
          >
            Continuous learning and professional validations.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="tech-card p-6 rounded-2xl flex flex-col hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                {cert.name}
              </h3>
              <p className="text-sm font-semibold text-primary mb-4">
                {cert.issuer} • {cert.date}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-grow">
                {cert.description}
              </p>
              <a 
                href={cert.link} 
                className="inline-flex items-center text-sm font-medium text-primary hover:opacity-80 mt-auto"
              >
                View Credential <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
