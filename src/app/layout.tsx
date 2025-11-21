import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import FeedbackWidget from "@/components/FeedbackWidget";
import { ConditionalHeader } from "@/components/ConditionalHeader";
import { AuthProvider } from "@/components/auth/AuthProvider";

const lato = Lato({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "CC Paragon - Customer Care Management System",
  description: "Website ",
  icons: {
    icon: "/logomini.png",
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
        className={`${lato.variable} font-sans antialiased`}
        style={{ fontFamily: 'var(--font-lato), sans-serif' }}
      >
        <AuthProvider>
          <ConditionalHeader />
          <main className="min-h-screen">
            {children}
          </main>
          <FeedbackWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
