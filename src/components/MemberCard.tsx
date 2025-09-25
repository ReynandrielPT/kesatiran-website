"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MemberCardProps {
  member: {
    id: string;
    name: string;
    slug: string;
    avatar: string;
    role: string;
    bio_short: string;
    social_links: Record<string, string>;
    skills?: Array<{ name: string; category: string; level: string }>;
  };
  className?: string;
  showSkills?: boolean;
}

export function MemberCard({
  member,
  className,
  showSkills = false,
}: MemberCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl p-6 transition-all duration-300 hover-lift",
        className
      )}
      style={{
        backgroundColor: "var(--card)",
        color: "var(--text)",
        boxShadow: "var(--shadow)",
      }}
    >
      {/* Avatar */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          <Image
            src={member.avatar}
            alt={member.name}
            width={96}
            height={96}
            className="rounded-full object-cover transition-transform duration-300 group-hover:scale-110"
            style={{
              boxShadow: "0 0 0 4px var(--accent)",
            }}
          />
          {/* Online status indicator */}
          <div
            className="absolute bottom-2 right-2 h-6 w-6 rounded-full border-4 border-white"
            style={{ backgroundColor: "var(--accent)" }}
          />
        </div>
      </div>

      {/* Info */}
      <div className="text-center">
        <h3
          className="text-xl font-semibold mb-1"
          style={{ color: "var(--text)" }}
        >
          {member.name}
        </h3>
        <p
          className="text-sm font-medium mb-3"
          style={{ color: "var(--accent)" }}
        >
          {member.role}
        </p>
        <p
          className="text-sm leading-relaxed mb-4"
          style={{ color: "var(--muted)" }}
        >
          {member.bio_short}
        </p>

        {/* Skills (optional) */}
        {showSkills && member.skills && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1 justify-center">
              {member.skills.slice(0, 3).map((skill) => (
                <span
                  key={skill.name}
                  className="px-2 py-1 text-xs rounded-full"
                  style={{
                    backgroundColor: "var(--accent)",
                    color: "white",
                  }}
                >
                  {skill.name}
                </span>
              ))}
              {member.skills.length > 3 && (
                <span
                  className="px-2 py-1 text-xs rounded-full"
                  style={{
                    backgroundColor: "var(--muted)",
                    color: "white",
                  }}
                >
                  +{member.skills.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Social Links */}
        <div className="flex justify-center space-x-3 mb-4">
          {Object.entries(member.social_links)
            .slice(0, 3)
            .map(([platform, url]) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{
                  backgroundColor: "var(--bg)",
                  color: "var(--muted)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--accent)";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--bg)";
                  e.currentTarget.style.color = "var(--muted)";
                }}
              >
                <span className="text-xs font-bold">
                  {platform.charAt(0).toUpperCase()}
                </span>
              </a>
            ))}
        </div>

        {/* View Profile Button */}
        <Link
          href={`/profile/${member.slug}`}
          className="inline-block px-6 py-2 text-sm font-medium rounded-full transition-all duration-200"
          style={{
            backgroundColor: "var(--accent)",
            color: "white",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "var(--shadow-lg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "var(--shadow)";
          }}
        >
          View Profile
        </Link>
      </div>

      {/* Hover overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />
    </div>
  );
}
