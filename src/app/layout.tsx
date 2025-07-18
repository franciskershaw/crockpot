import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/components/layout/navigation/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crockpot - Cook with Confidence",
  description:
    "Discover thousands of recipes, plan your meals effortlessly, and generate smart shopping lists. Transform the way you cook with Crockpot.",
  keywords: "recipes, cooking, meal planning, shopping lists, food, cuisine",
  authors: [{ name: "Crockpot Team" }],
  openGraph: {
    title: "Crockpot - Cook with Confidence",
    description:
      "Discover thousands of recipes, plan your meals effortlessly, and generate smart shopping lists.",
    type: "website",
    locale: "en_GB",
    siteName: "Crockpot",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-surface-warm`}
      >
        <Navbar />
        <main className="px-4">{children}</main>
      </body>
    </html>
  );
}
