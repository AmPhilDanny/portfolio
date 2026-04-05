"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, LogIn, LogOut, Terminal } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Navigation Items configuration
 */
const navigation = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Services", href: "#services" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

/**
 * Navbar Component: The main navigation header.
 * Features a dynamic blur effect on scroll and a mobile-responsive drawer.
 * Supports custom logo URLs from the admin settings.
 */
export function Navbar({ 
  logoUrl, 
  siteName = "NovaxFolio", 
  showSiteName = true,
  isAdmin = false 
}: { 
  logoUrl?: string | null;
  siteName?: string | null;
  showSiteName?: boolean;
  isAdmin?: boolean;
}) {


  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/85 backdrop-blur-xl border-b border-border shadow-sm"
            : "bg-background/60 backdrop-blur-md"
        }`}
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
          aria-label="Global"
        >
          {/* Logo Brand Block */}
          <Link
            href="/"
            className="flex items-center gap-3 group shrink-0 transition-transform duration-300 hover:scale-[1.02]"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex items-center gap-2.5">
              {logoUrl ? (
                <div className="relative flex shrink-0">
                  <img src={logoUrl} alt={`${siteName || 'NovaxFolio'} Logo`} className="h-9 w-auto max-w-[140px] rounded-md object-contain transition-all duration-300 group-hover:brightness-110" />
                  <div className="absolute inset-0 rounded-md bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity blur-lg -z-10" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center border border-white/20 shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300">
                  <Terminal className="h-5 w-5 text-white" strokeWidth={2.5} />
                </div>
              )}

              {logoUrl && showSiteName && (
                <div className="w-px h-6 bg-border/60 self-center mx-0.5" />
              )}
            </div>

            {(!logoUrl || showSiteName) && (
              <span className="flex items-baseline tracking-tight">
                <span className="text-xl font-extrabold text-foreground transition-colors group-hover:text-primary">
                  {(siteName || "NovaxFolio").slice(0, Math.ceil((siteName || "NovaxFolio").length / 2))}
                </span>
                <span className="text-xl font-medium text-primary ml-0.5 group-hover:text-foreground transition-colors">
                  {(siteName || "NovaxFolio").slice(Math.ceil((siteName || "NovaxFolio").length / 2))}
                </span>
              </span>
            )}
          </Link>


          {/* Desktop nav links — hidden below lg */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop right section */}
          <div className="hidden lg:flex items-center gap-3 border-l border-border pl-4">
            <ThemeToggle />
            <Link
              href={isAdmin ? "/api/auth/signout" : "/login"}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted transition-all duration-200"
              title={isAdmin ? "Admin Logout" : "Admin Login"}
            >
              {isAdmin ? <LogOut className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
              <span>{isAdmin ? 'Logout' : 'Login'}</span>
            </Link>
          </div>

          {/* Mobile/Tablet right section */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Horizontal scrollable pill nav for sm+ screens */}
            <div
              className="hidden sm:flex items-center gap-1 overflow-x-auto"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none", maxWidth: "240px" }}
            >
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 whitespace-nowrap"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <ThemeToggle />

            <button
              type="button"
              id="mobile-menu-toggle"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer panel */}
          <div
            className="absolute right-0 top-0 h-full w-72 sm:w-80 bg-background border-l border-border shadow-2xl flex flex-col"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 group shrink-0 min-w-0">
                {logoUrl ? (
                  <img src={logoUrl} alt={`${siteName || 'NovaxFolio'} Logo`} className="h-8 w-auto max-w-[120px] rounded-md object-contain" />
                ) : (
                  <div className="w-8 h-8 shrink-0 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                    <Terminal className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
                  </div>
                )}
                
                {(!logoUrl || showSiteName) && (
                  <span className="flex items-baseline tracking-tighter truncate">
                    <span className="text-lg font-bold text-foreground">
                      {(siteName || "NovaxFolio").slice(0, Math.ceil((siteName || "NovaxFolio").length / 2))}
                    </span>
                    <span className="text-lg font-medium text-primary ml-0.5">
                      {(siteName || "NovaxFolio").slice(Math.ceil((siteName || "NovaxFolio").length / 2))}
                    </span>
                  </span>
                )}
              </Link>

              <button
                type="button"
                aria-label="Close menu"
                className="p-2 shrink-0 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav links list */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {navigation.map((item, i) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-semibold text-foreground hover:bg-muted hover:text-primary transition-all duration-200 group"
                >
                  <span className="font-mono text-xs text-primary/50 group-hover:text-primary w-5 transition-colors">
                    {String(i + 1).padStart(2, "0")}.
                  </span>
                  {item.name}
                </Link>
              ))}

              <div className="pt-2 mt-2 border-t border-border">
                <Link
                  href={isAdmin ? "/api/auth/signout" : "/login"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-semibold text-foreground hover:bg-muted hover:text-primary transition-all duration-200"
                >
                  {isAdmin ? <LogOut className="h-4 w-4 text-primary" /> : <LogIn className="h-4 w-4 text-primary" />}
                  {isAdmin ? 'Admin Logout' : 'Admin Login'}
                </Link>
              </div>
            </nav>

            {/* Accent footer bar */}
            <div className="p-4 border-t border-border">
              <div className="h-1 rounded-full bg-gradient-to-r from-primary via-secondary to-accent" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
