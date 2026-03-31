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

  const themeStyles = `
    :root {
      --primary: ${settingsData?.primaryColor || "#3b82f6"};
      --secondary: ${settingsData?.secondaryColor || "#10b981"};
      --background: ${settingsData?.backgroundColor || "#020617"};
      --accent: ${settingsData?.accentColor || "#f59e0b"};
      ${settingsData?.fontFamily ? `--font-site: '${settingsData.fontFamily}', sans-serif;` : ""}
    }
    [data-theme="dark"] {
      --background: ${settingsData?.backgroundColor || "#020617"};
    }
    ${settingsData?.fontFamily ? `body { font-family: '${settingsData.fontFamily}', sans-serif; }` : ""}
    ${settingsData?.customCss || ""}
  `;


  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&family=Roboto:wght@300;400;500;700&family=Poppins:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700&family=Fira+Code:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
      </head>

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
