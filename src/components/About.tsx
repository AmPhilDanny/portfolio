"use client";

import { motion } from "framer-motion";
import { Code, Database, LineChart, Server } from "lucide-react";

const features = [
  {
    name: "Data Analysis",
    description: "Extracting insights from complex datasets using SQL, Python, Excel, and Power BI. Making data-driven business decisions.",
    icon: LineChart,
  },
  {
    name: "Frontend Development",
    description: "Building responsive, accessible, and performant user interfaces with React, Next.js, and modern CSS frameworks.",
    icon: Code,
  },
  {
    name: "Backend Systems",
    description: "Developing robust APIs and server-side logic using Node.js, Express, and appropriate architectural patterns.",
    icon: Server,
  },
  {
    name: "Database Management",
    description: "Designing and optimizing database schemas, writing complex queries, and managing both SQL and NoSQL databases.",
    icon: Database,
  },
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-white dark:bg-black relative">
      <div className="container px-4 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
              About Me
            </h2>
            <div className="space-y-6 text-lg text-gray-600 dark:text-gray-400">
              <p>
                I am a passionate and detail-oriented Certified Data Analyst and Junior Full-Stack Developer. With a strong foundation in both interpreting complex datasets and building robust web applications, I bring a unique perspective to technology solutions.
              </p>
              <p>
                My journey in tech has equipped me with the ability to not just write clean, efficient code, but to understand the <span className="text-gray-900 dark:text-gray-200 font-medium">"why"</span> behind the data. I thrive in environments where I can leverage my analytical skills to drive business decisions while simultaneously executing technical implementations.
              </p>
              <p>
                When I'm not coding or analyzing data, you can find me continuously learning new technologies and keeping up with the latest industry trends.
              </p>
            </div>
            
            <div className="mt-10 grid grid-cols-2 gap-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">2+</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Years of Data Exp.</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">20+</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Projects Completed</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid sm:grid-cols-2 gap-6"
          >
            {features.map((feature, index) => (
              <div 
                key={feature.name} 
                className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors"
                style={{
                  transform: `translateY(${index % 2 !== 0 ? '24px' : '0'})`
                }}
              >
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
