"use client";

import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { RoleProvider } from "@/components/context/RoleContext";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <RoleProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </ThemeProvider>
    </RoleProvider>
  );
}
