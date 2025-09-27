"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

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
}

interface MemberCardProps extends React.HTMLAttributes<HTMLDivElement> {
  member: RawMember;
  showSkills?: boolean;
  compact?: boolean; // smaller layout variant
}

// removed platform label helper; no longer rendering social platform chips

export function MemberCard({
  member,
  showSkills = false,
  compact = false,
  className,
  ...rest
}: MemberCardProps) {
  const avatar = member.avatar || member.photo || "/vercel.svg";
  const isOnline = member.availability_status === "available";
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
            src={avatar}
            alt={member.name}
            fill
            sizes={
              compact
                ? "(max-width: 768px) 240px, 320px"
                : "(max-width: 768px) 320px, 448px"
            }
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            priority={false}
          />

          {/* Gradient overlay bottom */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-background/90 via-background/60 to-transparent" />

          {/* Name and role overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0">
                <h3
                  className={cn(
                    "font-semibold tracking-tight text-foreground",
                    compact ? "text-lg" : "text-xl"
                  )}
                >
                  {member.name}
                </h3>
              </div>
              {isOnline && (
                <span className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2 py-1 text-[10px] font-medium text-accent">
                  <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                  Online
                </span>
              )}
            </div>

            {/* Skills tags removed for a cleaner player card */}
          </div>
        </div>

        {/* Footer action (kept minimal, outside overlay) */}
        <div
          className={cn("absolute inset-x-0 top-0 p-3 flex justify-end")}
          aria-hidden
        >
          {member.social_links && (
            <div className="flex items-center gap-1.5">
              {/* Reserved for future icons if needed; left blank for clean player look */}
            </div>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex justify-end pointer-events-none">
          <div className="pointer-events-auto">
            <Button
              variant="outline"
              size={compact ? "sm" : "md"}
              className="border-border bg-background/80 backdrop-blur-sm"
            >
              <Link href={`/profile/${member.slug}`}>View Profile</Link>
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
