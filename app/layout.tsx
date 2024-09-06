import Header from "@/components/landing/Header";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/themeProvider";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";

import { auth } from "@/auth/auth";
import Footer from "@/components/landing/Footer";
import Username from "@/components/landing/Username";
import { prisma } from "@/lib/prisma";
import "./globals.css";

export const metadata: Metadata = {
  title: "F'Threads - The Social Media",
  description:
    "F'threads is a social media platform for everyone.\nShare your thoughts, ideas, and connect with people.",
  icons: [
    {
      rel: "icon",
      url: "https://media.discordapp.net/attachments/972878173488447568/1280029206553563269/icon_2.png?ex=66d69798&is=66d54618&hm=bb23dd05c795fb1346e6eee950816cf2978b1e284e3a3853a05ceebaedfd4b2c&=&format=webp&quality=lossless",
    },
  ],
  openGraph: {
    title: "F'Threads - The Social Media",
    description: "F'threads is a social media platform for everyone.",
    url: "https://fthreads.vercel.app/",
    type: "website",
    images: [
      {
        url: "https://media.discordapp.net/attachments/972878173488447568/1280029206553563269/icon_2.png?ex=66d69798&is=66d54618&hm=bb23dd05c795fb1346e6eee950816cf2978b1e284e3a3853a05ceebaedfd4b2c&=&format=webp&quality=lossless",
        width: 800,
        height: 600,
        alt: "F'Threads Logo",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (session) {
    const user = await prisma.user.findUnique({
      where: {
        id: session?.user.id,
      },
    });

    await prisma.$disconnect();

    if (user?.id && !user.username)
      return (
        <html lang="en" suppressHydrationWarning>
          <head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
          </head>
          <body className="w-full min-h-screen dark:bg-[#0A0A0A] bg-white">
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem={true}
            >
              <Header />
              <Username userId={user.id} />
            </ThemeProvider>
          </body>
        </html>
      );
  }
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
