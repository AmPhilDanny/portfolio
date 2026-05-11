import Link from "next/link";
import { Mail } from "lucide-react";

/**
 * Custom Brand Icon Components
 * Modern lucide-react versions have removed brand icons to avoid trademark issues.
 * These custom SVG components ensure a consistent, branded experience.
 */
const GithubIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const iconMap: Record<string, any> = {
  Github: GithubIcon,
  GitHub: GithubIcon,
  LinkedIn: LinkedinIcon,
  Linkedin: LinkedinIcon,
  Twitter: TwitterIcon,
  X: TwitterIcon,
  Instagram: InstagramIcon,
  Facebook: FacebookIcon,
  Kaggle: (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.825 23.859c-.022.028-.118.141-.308.141h-3.156c-.189 0-.338-.097-.403-.187L7.333 14.41l-2.311 2.351v6.942c0 .19-.145.297-.312.297H1.355c-.167 0-.312-.107-.312-.297V.297C1.043.107 1.188 0 1.355 0h3.355c.167 0 .312.107.312.297v10.026L14.738.22c.083-.118.23-.22.428-.22h3.326c.216 0 .311.144.208.31l-7.531 11.232 7.657 12.317z"/>
    </svg>
  )
};

/**
 * Footer Component: Site-wide footer with dynamic social links.
 */
export function Footer({ data, socials }: { data?: any, socials?: any[] }) {
  const currentYear = new Date().getFullYear();
  
  const displaySocials = socials && socials.length > 0 ? socials : [
    { platform: "GitHub", url: data?.githubUrl, icon: "Github" },
    { platform: "LinkedIn", url: data?.linkedinUrl, icon: "LinkedIn" },
    { platform: "Twitter", url: data?.twitterUrl, icon: "Twitter" },
    { platform: "Instagram", url: data?.instagramUrl, icon: "Instagram" },
    { platform: "Facebook", url: data?.facebookUrl, icon: "Facebook" },
  ].filter(link => link.url); 

  const email = data?.email || "philipdaniel.philip@gmail.com";
  const copyright = data?.copyrightText || `NovaxFolio | Amaechi Philip Ekaba. All rights reserved.`;

  return (
    <footer className="bg-muted/40 border-t border-border mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          {displaySocials.map((link, idx) => {
            const Icon = iconMap[link.icon || link.platform] || Mail;
            return (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <span className="sr-only">{link.platform}</span>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </a>
            );
          })}
          
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


