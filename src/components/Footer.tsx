import Link from "next/link";
import { Mail, Github, Linkedin, Twitter, Instagram, Facebook } from "lucide-react";

/**
 * Footer Component: Site-wide footer with social links and copyright.
 * Dynamically renders social handles and copyright text from global settings.
 */
export function Footer({ data }: { data?: any }) {
  const currentYear = new Date().getFullYear();
  
  // Dynamic Social Links from Settings
  const socialLinks = [
    { name: "GitHub", href: data?.githubUrl, icon: Github },
    { name: "LinkedIn", href: data?.linkedinUrl, icon: Linkedin },
    { name: "Twitter", href: data?.twitterUrl, icon: Twitter },
    { name: "Instagram", href: data?.instagramUrl, icon: Instagram },
    { name: "Facebook", href: data?.facebookUrl, icon: Facebook },
  ].filter(link => link.href); // Only show links that have a URL set

  const email = data?.email || "philipdaniel.philip@gmail.com";
  const copyright = data?.copyrightText || `NovaxFolio | Amaechi Philip Ekaba. All rights reserved.`;

  return (
    <footer className="bg-muted/40 border-t border-border mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <span className="sr-only">{link.name}</span>
              <link.icon className="h-5 w-5" aria-hidden="true" />
            </a>
          ))}
          
          <a
            href={`mailto:${email}`}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <span className="sr-only">Email</span>
            <Mail className="h-5 w-5" aria-hidden="true" />
          </a>
        </div>
        
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-xs leading-5 text-muted-foreground">
            &copy; {currentYear} {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}

