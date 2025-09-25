import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "Kesatiran - Creative Digital Team",
  description:
    "A creative team dedicated to building beautiful, functional, and meaningful digital experiences.",
  keywords: [
    "web development",
    "ui/ux design",
    "cloud infrastructure",
    "team",
    "portfolio",
  ],
  authors: [{ name: "Kesatiran Team" }],
  openGraph: {
    title: "Kesatiran - Creative Digital Team",
    description:
      "A creative team dedicated to building beautiful, functional, and meaningful digital experiences.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${merriweather.variable} antialiased`}
      >
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
