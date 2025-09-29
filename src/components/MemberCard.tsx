"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

export interface RawMember {
  id: string;
  name: string;
  slug: string;
  avatar?: string;
  photo?: string; // some data objects have photo as fallback
  role: string;
  bio_short: string;
  social_links?: Record<string, string | undefined>; // Made social_links optional
  skills?: Array<{ name: string; category: string; level: string }>;
  availability_status?: string;
  department?: string; // Added department as optional
  spotify_url?: string; // Optional Spotify track URL for this member
  audio_src?: string; // Optional local audio path for this member's favorite song
}

interface MemberCardProps extends React.HTMLAttributes<HTMLDivElement> {
  member: RawMember;
  showSkills?: boolean;
  compact?: boolean; // smaller layout variant
  usePhotoFirst?: boolean; // prefer photo over avatar for the main image
  showViewButton?: boolean; // control showing the overlay "View Profile" button
}

// removed platform label helper; no longer rendering social platform chips

export function MemberCard({
  member,
  showSkills = false,
  compact = false,
  usePhotoFirst = false,
  showViewButton = true,
  className,
  ...rest
}: MemberCardProps) {
  // Choose the displayed image based on preference
  const cover = usePhotoFirst
    ? member.photo || member.avatar || "/vercel.svg"
    : member.avatar || member.photo || "/vercel.svg";
  const isOnline = member.availability_status === "available";
  const { theme } = useTheme();
  // skills display removed in player card

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <Card
        padding="none"
        className={cn(
          "group relative h-full w-full overflow-hidden",
          "bg-secondary border border-border hover:border-accent/40",
          className
        )}
        {...rest}
      >
        {/* Full-bleed player image */}
        <div
          className={cn(
            "relative w-full h-full",
            // Provide a sensible default size when parent doesn't enforce height
            compact ? "min-h-[18rem]" : "min-h-[24rem]"
          )}
        >
          <Image
            src={cover}
            alt={member.name}
            fill
            sizes={
              compact
                ? "(max-width: 768px) 240px, 320px"
                : "(max-width: 768px) 320px, 448px"
            }
            className="object-cover transition-transform duration-500 opacity-90 group-hover:scale-[1.04] group-hover:opacity-70"
            priority={false}
          />

          {/* Gradient overlay bottom */}
          <div
            className={cn(
              "pointer-events-none absolute inset-x-0 bottom-0 h-36",
              theme === "light"
                ? "bg-gradient-to-t from-background/95 via-background/75 to-transparent"
                : "bg-gradient-to-t from-background/90 via-background/60 to-transparent"
            )}
          />

          {/* Persistent name label at bottom-left */}
          <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 pointer-events-none">
            {/* subtle gradient to improve readability */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
            <div className="relative flex items-end justify-start">
              <h3
                className={cn(
                  "font-semibold tracking-tight leading-snug line-clamp-1 max-w-full",
                  compact ? "text-base" : "text-lg"
                )}
                title={member.name}
                style={{
                  // Determine base text color by theme
                  color:
                    theme === "dark" || theme === "gaming"
                      ? "#ffffff" // light font on dark-ish themes
                      : "#111111", // dark font on light/aesthetic
                  // Stroke should contrast with font color
                  WebkitTextStroke:
                    theme === "dark" || theme === "gaming"
                      ? "0.8px rgba(0,0,0,0.7)" // dark stroke for light font
                      : "0.8px rgba(255,255,255,0.8)", // light stroke for dark font
                  // Subtle shadow matching contrast direction
                  textShadow:
                    theme === "dark" || theme === "gaming"
                      ? "0 1px 2px rgba(0,0,0,0.45)"
                      : "0 1px 2px rgba(255,255,255,0.45)",
                }}
              >
                {member.name}
              </h3>
            </div>
          </div>

          {/* Hover overlay for actions only */}
          {showViewButton && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 invisible transition-all duration-300 group-hover:opacity-100 group-hover:visible pointer-events-none p-4 sm:p-5">
              <div className="pointer-events-auto">
                <Button
                  variant="outline"
                  size={compact ? "sm" : "md"}
                  className="border-border bg-background/80 backdrop-blur-sm"
                >
                  <Link
                    href={`/profile/${member.slug}`}
                    onClick={(e) => {
                      // prevent bubbling to Card onClick (used for Spotify open)
                      e.stopPropagation();
                    }}
                  >
                    View Profile
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer action (kept minimal, outside overlay) - This was an empty div, can be removed if not used */}
        {/* <div
          className={cn("absolute top-0 right-0 p-3 flex justify-end")}
          aria-hidden
        >
          {member.social_links && (
            <div className="flex items-center gap-1.5">
            </div>
          )}
        </div> */}
      </Card>
    </motion.div>
  );
}
