import Header from "@/components/landing/Header";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/themeProvider";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";

import Footer from "@/components/landing/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "F'Threads",
  description: "F'Threads is a social media platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="w-full min-h-screen">
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem={true}
          >
            <Header />
            <Toaster />
            <Footer />
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
