import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/40 border-t border-border mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <a
            href="https://github.com/AmPhilDanny"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="sr-only">GitHub</span>
            <Github className="h-6 w-6" aria-hidden="true" />
          </a>
          <a
            href="https://www.linkedin.com/in/amphildanny/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="sr-only">LinkedIn</span>
            <Linkedin className="h-6 w-6" aria-hidden="true" />
          </a>
          <a
            href="mailto:philipdaniel.philip@gmail.com"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="sr-only">Email</span>
            <Mail className="h-6 w-6" aria-hidden="true" />
          </a>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-xs leading-5 text-muted-foreground">
            &copy; {currentYear} Amaechi Philip Ekaba. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
