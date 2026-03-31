"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

/**
 * ThemeToggle Component: A sleek button for switching between Light and Dark modes.
 * Features:
 * - Lucide icons for Sun and Moon.
 * - Framer Motion animations for smooth transitions.
 * - Glassmorphism-inspired design to match NovaxFolio's aesthetic.
 */
export function ThemeToggle() {

  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button className="relative inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted focus:outline-none">
        <Sun className="h-5 w-5 opacity-0" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none transition-colors"
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 scale-100 dark:scale-0 transition-all absolute" />
      <Moon className="h-5 w-5 scale-0 dark:scale-100 transition-all" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
