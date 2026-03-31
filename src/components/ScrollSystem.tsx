"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

/**
 * ScrollSystem Component: Global navigation and feedback system.
 * 
 * Progress Bar: Real-time visual indicator of page scroll depth using Framer Motion.
 * Back-to-Top: Smart floating button that appears after 400px of scroll for easy navigation.
 */
export function ScrollSystem() {

  const [isVisible, setIsVisible] = useState(false);

  const { scrollYProgress } = useScroll();
  
  // Smooth spring for the progress bar
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button after scrolling 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* ─── SCROLL PROGRESS BAR ─── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-primary via-secondary to-primary z-[500] origin-left"
        style={{ 
          scaleX,
          boxShadow: "0 2px 10px var(--glow-primary)"
        }}
      />

      {/* ─── BACK TO TOP BUTTON ─── */}
      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.8 }}
            onClick={scrollToTop}
            aria-label="Back to Top"
            className="fixed bottom-10 right-10 z-[200] group p-4 rounded-2xl bg-white/10 dark:bg-zinc-900/10 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl transition-all duration-300 active:scale-90"
            style={{ 
              boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5), 0 0 20px var(--glow-primary)"
            }}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <ChevronUp 
              className="w-6 h-6 text-primary group-hover:-translate-y-1 transition-transform duration-300" 
              strokeWidth={2.5}
            />
            
            {/* Visual Flare */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
