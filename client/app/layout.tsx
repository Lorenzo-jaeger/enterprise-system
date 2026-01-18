import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { Toaster } from "@/components/ui/sonner";

import { ThemeProvider } from "@/components/providers/theme-provider"
import { UserNav } from "@/components/organisms/user-nav"

export const metadata: Metadata = {
  title: "Enterprise System",
  description: "Scalable Full-Stack Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <div className="relative min-h-screen">
                <div className="absolute top-4 right-4 z-50">
                    <UserNav />
                </div>
                {children}
            </div>
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
