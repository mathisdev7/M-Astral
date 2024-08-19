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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
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
