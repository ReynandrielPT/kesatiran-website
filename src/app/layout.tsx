import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./spatial.css";
import { SpatialWorld } from "@/components/spatial/SpatialWorld";
import { MotionConfig } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SkewVeil } from "@/components/motion/SkewVeil";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kesatiran — A Shared Creative Universe",
  description:
    "A circle of friends exploring art, code, music, and games. Step into our shared creative universe.",
  keywords: [
    "web development",
    "ui/ux design",
    "cloud infrastructure",
    "team",
    "portfolio",
  ],
  authors: [{ name: "Kesatiran Team" }],
  openGraph: {
    title: "Kesatiran — A Shared Creative Universe",
    description:
      "A circle of friends exploring art, code, music, and games. Step into our shared creative universe.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        {/* `reducedMotion="user"` makes framer-motion honour the OS setting for
              every component in the tree at once: transforms and opacity are
              applied instantly instead of tweened. Without it, each reveal has
              to remember to check the media query itself, and the ones that
              forget leave content stuck at opacity 0 for those users. */}
        <MotionConfig reducedMotion="user">
          <SpatialWorld />
          <SkewVeil />
          <div className="site-shell min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </MotionConfig>
      </body>
    </html>
  );
}
