import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FeedbackWidget from "@/components/FeedbackWidget";
import { ConditionalHeader } from "@/components/ConditionalHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CC Paragon - Customer Care Management System",
  description: "Fullstack CRUD system for managing products, SOPs, and knowledge base",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConditionalHeader />
        <main className="min-h-screen">
          {children}
        </main>
        <FeedbackWidget />
      </body>
    </html>
  );
}
