"use client";

import React from "react";
import Link from "next/link";
import { Github, Linkedin, Twitter, Mail, Heart } from "lucide-react";

const socialLinks = [
  { name: "GitHub", href: "https://github.com/kesatiran", icon: Github },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/kesatiran",
    icon: Linkedin,
  },
  { name: "Twitter", href: "https://twitter.com/kesatiran", icon: Twitter },
  { name: "Email", href: "mailto:hello@kesatiran.com", icon: Mail },
];

const quickLinks = [
  { name: "About", href: "/about" },
  { name: "Team", href: "/team" },
  { name: "Works", href: "/works" },
  { name: "Games", href: "/games" },
  { name: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer
      className="border-t border-opacity-20 mt-16"
      style={{ borderColor: "var(--muted)" }}
    >
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="text-2xl font-bold text-gradient">
              Kesatiran
            </Link>
            <p
              className="mt-4 text-sm leading-6"
              style={{ color: "var(--muted)" }}
            >
              A creative team dedicated to building beautiful, functional, and
              meaningful digital experiences. We combine technical expertise
              with artistic vision to bring ideas to life.
            </p>
            <div className="mt-6">
              <h4
                className="text-sm font-semibold"
                style={{ color: "var(--text)" }}
              >
                Connect with us
              </h4>
              <div className="flex space-x-4 mt-3">
                {socialLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full p-2 transition-all duration-200 hover:scale-110"
                    style={{
                      color: "var(--muted)",
                      backgroundColor: "var(--card)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--accent)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--muted)";
                    }}
                  >
                    <span className="sr-only">{item.name}</span>
                    <item.icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-sm font-semibold"
              style={{ color: "var(--text)" }}
            >
              Quick Links
            </h4>
            <ul className="mt-6 space-y-3">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm transition-colors duration-200 hover:underline"
                    style={{ color: "var(--muted)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--accent)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--muted)";
                    }}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4
              className="text-sm font-semibold"
              style={{ color: "var(--text)" }}
            >
              Contact
            </h4>
            <ul
              className="mt-6 space-y-3 text-sm"
              style={{ color: "var(--muted)" }}
            >
              <li>
                <a
                  href="mailto:hello@kesatiran.com"
                  className="hover:underline"
                >
                  hello@kesatiran.com
                </a>
              </li>
              <li>Available for new projects</li>
              <li>Remote & On-site work</li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div
          className="mt-12 border-t border-opacity-20 pt-8"
          style={{ borderColor: "var(--muted)" }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              © {new Date().getFullYear()} Kesatiran. All rights reserved.
            </p>
            <div
              className="flex items-center mt-4 sm:mt-0 text-sm"
              style={{ color: "var(--muted)" }}
            >
              <span>Made with</span>
              <Heart
                size={16}
                className="mx-1 text-red-500"
                fill="currentColor"
              />
              <span>and lots of coffee</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
