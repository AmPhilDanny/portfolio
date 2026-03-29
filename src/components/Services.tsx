"use client";

import { motion } from "framer-motion";
import { LineChart, Layout, Server, Database } from "lucide-react";

const services = [
  {
    title: "Data Analysis & Visualization",
    description: "Transforming raw data into meaningful insights using advanced analytical tools and creating interactive dashboards that drive business decisions.",
    icon: LineChart,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900",
  },
  {
    title: "Frontend Web Development",
    description: "Building responsive, fast, and accessible web applications using modern JavaScript frameworks like React and Next.js.",
    icon: Layout,
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900",
  },
  {
    title: "Backend Development",
    description: "Creating robust and scalable server-side applications, RESTful APIs, and microservices using Node.js and Express.",
    icon: Server,
    color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-900",
  },
  {
    title: "Database Design & Management",
    description: "Designing efficient database schemas, writing optimized queries, and managing both relational (SQL) and non-relational (NoSQL) databases.",
    icon: Database,
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-white dark:bg-black relative">
      <div className="container px-4 mx-auto max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4"
          >
            My Services
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-400"
          >
            Bridging the gap between data insights and technical implementation.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow group"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 border ${service.color} transition-transform group-hover:scale-110`}>
                <service.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
