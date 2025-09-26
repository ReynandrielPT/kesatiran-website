"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
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

// Helper: choose first letter (or 2 if short) for social chip fallback
function platformLabel(platform: string) {
  if (platform.length <= 3) return platform.toUpperCase();
  return platform[0].toUpperCase();
}

export function MemberCard({
  member,
  showSkills = false,
  compact = false,
  className,
  ...rest
}: MemberCardProps) {
  const avatar = member.avatar || member.photo || "/vercel.svg";
  const isOnline = member.availability_status === "available";
  const SkillLimit = compact ? 2 : 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <Card
        className={cn(
          "group flex flex-col h-full transition-all duration-300",
          "bg-secondary border border-border hover:border-accent/40",
          compact ? "p-4" : "p-6",
          className
        )}
        {...rest}
      >
        <div
          className={cn(
            "flex",
            compact ? "items-center gap-4" : "flex-col items-center gap-5"
          )}
        >
          {/* Avatar */}
          <div
            className={cn(
              "relative rounded-lg overflow-hidden",
              compact ? "h-14 w-14" : "h-24 w-24"
            )}
          >
            <Image
              src={avatar}
              alt={member.name}
              fill
              sizes={compact ? "56px" : "96px"}
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Presence dot */}
            {isOnline && (
              <div className="absolute bottom-1 right-1">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                </span>
              </div>
            )}
          </div>

          {/* Heading + role (layout switches depending on compact) */}
          <div
            className={cn("text-center", compact && "text-left flex-1 min-w-0")}
          >
            <h3
              className={cn(
                "font-semibold tracking-tight text-foreground group-hover:text-accent",
                compact ? "text-base" : "text-lg"
              )}
            >
              {member.name}
            </h3>
            <p
              className={cn(
                "text-muted-foreground truncate max-w-[14rem] mx-auto",
                compact ? "text-xs mt-0.5" : "text-sm mt-1",
                compact && "mx-0"
              )}
            >
              {member.role}
            </p>
          </div>
        </div>

        {/* Bio */}
        <p
          className={cn(
            "text-muted-foreground flex-1",
            compact ? "text-xs mt-3" : "text-sm text-center mt-4"
          )}
        >
          {member.bio_short}
        </p>

        {/* Skills */}
        {showSkills && member.skills && member.skills.length > 0 && (
          <div
            className={cn(
              "flex flex-wrap gap-1.5",
              compact ? "mt-3" : "mt-5 justify-center"
            )}
          >
            {member.skills.slice(0, SkillLimit).map((skill) => (
              <Badge
                key={skill.name}
                variant="secondary"
                size={compact ? "sm" : "md"}
              >
                {skill.name}
              </Badge>
            ))}
            {member.skills.length > SkillLimit && (
              <Badge variant="secondary" size={compact ? "sm" : "md"}>
                +{member.skills.length - SkillLimit} more
              </Badge>
            )}
          </div>
        )}

        {/* Socials + Profile Button */}
        <div
          className={cn(
            "flex items-center",
            compact ? "mt-4 gap-2" : "mt-6 flex-col gap-4"
          )}
        >
          <div
            className={cn(
              "flex items-center gap-2",
              compact ? "order-2 ml-auto" : "order-1"
            )}
          >
            {member.social_links &&
              Object.entries(member.social_links)
                .slice(0, 4)
                .map(([platform, url]) => (
                  <Button
                    key={platform}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-accent"
                  >
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {url && platformLabel(platform)}
                    </a>
                  </Button>
                ))}
          </div>

          <Button
            variant="outline"
            className={cn(
              "border-border",
              compact ? "order-1" : "order-2 w-full"
            )}
            size={compact ? "sm" : "md"}
          >
            <Link href={`/profile/${member.slug}`}>View Profile</Link>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
