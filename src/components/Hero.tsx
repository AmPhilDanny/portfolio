"use client";

import { motion } from "framer-motion";
import { ArrowRight, Download, Mail, Code } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

export default function Hero({ 
  data 
}: { 
  data?: { name?: string, title?: string, description?: string, cvUrl?: string | null, imageUrl?: string | null } | null 
}) {
  const name = data?.name || "Amaechi Philip Ekaba";
  const title = data?.title || "Certified Data Analyst & Junior Full-Stack Developer";
  const description = data?.description || "Transforming complex data into actionable insights and building modern, responsive web applications. Passionate about solving problems at the intersection of data and development.";
  const cvUrl = data?.cvUrl || "/resume.pdf";
  const imageUrl = data?.imageUrl || "/profile.jpg";

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px] -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[128px] -z-10 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container px-4 mx-auto relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 max-w-6xl mx-auto">
          {/* Left Text Column */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left flex-1">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Available for Work
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6"
          >
            Hi, I'm <span className="tech-text-gradient">{name}</span>
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl md:text-3xl font-medium text-gray-700 dark:text-gray-300 mb-8"
          >
            {title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl"
          >
            {description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link
              href="#contact"
              className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3.5 text-sm font-medium text-white transition-all bg-primary rounded-full hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900 group"
            >
              Get in Touch
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
            
            <a
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3.5 text-sm font-medium text-gray-900 transition-all bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:text-primary focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:text-primary"
            >
              Download CV
              <Download className="w-4 h-4 ml-2" />
            </a>
          </motion.div>
          </div>

          {/* Right Image Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 relative w-full"
          >
            <div className="relative w-full max-w-[420px] aspect-[4/5] mx-auto group">
              {/* Complex background glow layers */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 via-secondary/20 to-primary/20 rounded-[2rem] blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-700" />
              <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent rounded-[2rem] -z-10" />
              
              {/* Main Image Frame */}
              <div className="relative w-full h-full rounded-[2rem] border-2 border-white/10 dark:border-white/5 overflow-hidden shadow-2xl backdrop-blur-[2px]">
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent z-10" />
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 hover:scale-105"
                />
                
                {/* Tech scanline effect overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.07] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-20" />
              </div>
              
              {/* Refined floating tech elements */}
              <motion.div 
                animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 p-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-primary/20 z-30"
              >
                <Code className="w-6 h-6 text-primary" />
              </motion.div>
              
              <motion.div 
                animate={{ y: [0, 12, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -left-6 p-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-secondary/20 z-30"
              >
                <div className="w-6 h-6 flex items-center justify-center font-bold text-secondary text-xl font-mono">{"{ }"}</div>
              </motion.div>

              {/* Data visualization elements */}
              <div className="absolute -right-8 bottom-1/4 flex flex-col gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-4 group-hover:translate-x-0">
                <div className="h-1.5 w-16 bg-primary/40 rounded-full" />
                <div className="h-1.5 w-24 bg-secondary/40 rounded-full" />
                <div className="h-1.5 w-12 bg-accent/40 rounded-full" />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
