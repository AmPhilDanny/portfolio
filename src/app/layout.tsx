import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollSystem } from "@/components/ScrollSystem";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

import { getSettings } from "@/app/actions/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settingsData = await getSettings();
  return {
    title: settingsData?.siteName ? `${settingsData.siteName} | Data & Dev Portfolio` : "NovaxFolio | Amaechi Philip Ekaba - Data & Dev Portfolio",
    description: "A professional, database-driven portfolio showcasing technical expertise in Data Analysis and Full-Stack Engineering.",
    icons: settingsData?.faviconUrl ? { icon: settingsData.faviconUrl } : undefined,
  };
}


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.Node;
}>) {
  const settingsData = await getSettings();

  const themeStyles = `
    :root {
      --primary: ${settingsData?.primaryColor || "#2563eb"};
      --secondary: ${settingsData?.secondaryColor || "#059669"};
      --background: #f8fafc;
      --foreground: #0f172a;
      --accent: ${settingsData?.accentColor || "#d97706"};
      ${settingsData?.fontFamily ? `--font-site: '${settingsData.fontFamily}', sans-serif;` : ""}
    }
    .dark {
      --background: ${settingsData?.backgroundColor || "#020617"};
      --foreground: #e2e8f0;
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
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ScrollSystem />


          <Navbar 
            logoUrl={settingsData?.logoUrl} 
            siteName={settingsData?.siteName} 
            showSiteName={settingsData?.showSiteName !== "false"} 
          />
          <main className="flex-1 pt-16">
            {children}
          </main>
          <Footer data={settingsData} />
        </ThemeProvider>
      </body>
    </html>
  );
}

