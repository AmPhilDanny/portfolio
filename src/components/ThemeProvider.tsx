"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * ThemeProvider Component: Wraps the application to provide shared theme state (Light/Dark).
 * Uses next-themes under the hood for persistent preference management.
 * In NovaxFolio, this enables the 'class' strategy for Tailwind CSS 4 compatibility.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
