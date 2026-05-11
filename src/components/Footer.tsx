import Link from "next/link";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon, FacebookIcon, KaggleIcon } from "@/components/Icons";

const iconMap: Record<string, any> = {
  Github: GithubIcon,
  GitHub: GithubIcon,
  LinkedIn: LinkedinIcon,
  Linkedin: LinkedinIcon,
  Twitter: TwitterIcon,
  X: TwitterIcon,
  Instagram: InstagramIcon,
  Facebook: FacebookIcon,
  Kaggle: KaggleIcon
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


