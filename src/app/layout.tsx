import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

import { getSettings } from "@/app/actions/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settingsData = await getSettings();
  return {
    title: "Amaechi Philip Ekaba | Data Analyst & Full-Stack Developer",
    description: "Portfolio of Amaechi Philip Ekaba - Certified Data Analyst and Junior Full-Stack Developer showcasing projects, skills, and services.",
    icons: settingsData?.faviconUrl ? { icon: settingsData.faviconUrl } : undefined,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settingsData = await getSettings();

  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`${inter.variable} min-h-screen font-sans antialiased bg-background text-foreground flex flex-col`}>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar logoUrl={settingsData?.logoUrl} />
          <main className="flex-1 pt-16">
            {children}
          </main>
          <Footer data={settingsData} />
        </ThemeProvider>
      </body>
    </html>
  );
}
