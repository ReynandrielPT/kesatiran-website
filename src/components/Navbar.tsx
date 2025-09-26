"use client";

import React from "react";
import Link from "next/link";
import { Menu, X, Home, Users, Briefcase, Gamepad2 } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import ThemeSwitcher from "./ThemeSwitcher";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Team", href: "/team", icon: Users },
  { name: "Works", href: "/works", icon: Briefcase },
  { name: "Games", href: "/games", icon: Gamepad2 },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  useEffect(() => {
    const navbar = document.getElementById("navbar-header");
    if (!navbar) return;

    const handleScroll = () => {
      if (window.scrollY > 50) {
        navbar.classList.add("backdrop-blur-md", "bg-background/60");
      } else {
        navbar.classList.remove("backdrop-blur-md", "bg-background/60");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className="fixed top-0 z-50 w-full transition-all duration-300 ease-in-out bg-transparent"
      id="navbar-header"
    >
      <nav className="mx-auto app-container flex items-center h-16 gap-6">
        {/* Brand / Logo mark */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="size-8 rounded-md bg-accent flex items-center justify-center text-accent-foreground font-bold text-sm shadow-md group-hover:rotate-6 transition-transform">
            K
          </div>
          <span className="text-lg font-semibold tracking-tight text-heading">
            Kesatiran
          </span>
        </Link>
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 flex-grow justify-center">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  "text-muted-foreground hover:text-foreground",
                  active && "text-accent"
                )}
              >
                <span className="flex items-center gap-1.5">
                  <item.icon size={16} /> {item.name}
                </span>
                {active && (
                  <span
                    className={cn(
                      "pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-1 h-0.5 rounded-full bg-accent transition-all duration-300 w-4"
                    )}
                  />
                )}
              </Link>
            );
          })}
        </div>
        <div className="ml-auto flex items-center gap-3">
          {/* Theme Switcher (desktop) */}
          <div className="hidden md:block">
            <ThemeSwitcher />
          </div>
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden h-9 w-9 flex items-center justify-center rounded-md border border-border bg-secondary hover:bg-tertiary transition-colors"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-secondary/95 backdrop-blur-sm border-t border-border">
          <div className="px-5 py-4 flex flex-col gap-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "px-3 py-2 text-base font-medium rounded-md transition-colors flex items-center gap-3",
                  isActive(item.href)
                    ? "bg-tertiary text-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-tertiary"
                )}
              >
                <item.icon size={20} />
                {item.name}
              </Link>
            ))}
            <div className="pt-2 border-t border-border">
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
