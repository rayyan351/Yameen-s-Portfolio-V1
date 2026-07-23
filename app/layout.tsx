import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Navbar from "@/components/layout/Navbar";

// Editorial Serif Pairing
const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-serif-custom",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Humanist Sans-Serif
const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans-custom",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// Refined Monospace
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-custom",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yameen Munir - AI & Data Science · Freelance Developer | London, UK",
  description: "A creative editorial portfolio showcasing custom interactive web development and machine learning projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorantGaramond.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-dvh w-full min-w-0 max-w-full overflow-x-clip bg-paper text-ink selection:bg-clay selection:text-paper antialiased flex flex-col">
        {/* Fixed paper texture */}
        <div className="grain-overlay" aria-hidden="true" />
        
        <SmoothScroll>
          <Navbar />
          <main
  id="site-main"
  className="flex min-w-0 w-full max-w-full flex-1 flex-col overflow-x-clip"
>
  {children}
</main>
        </SmoothScroll>
      </body>
    </html>
  );
}
