"use client";

import React, { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  Mail,
  Globe,
  Github,
  Linkedin,
  Twitter,
  MapPin,
  Calendar,
  Download,
  Briefcase,
  Star,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

// Import data
import membersData from "@/data/members.json";
import worksData from "@/data/works.json";

interface ProfilePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  // Using the React 19 `use` hook to unwrap the params promise per Next.js 15 guidance
  const { slug } = use(params);
  const member = membersData.find((m: any) => m.slug === slug);

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Member not found</h1>
          <Link href="/team">
            <Button>Back to Team</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Get member's works
  const memberWorks = worksData.filter((work: any) =>
    work.contributors.includes(member.id)
  );

  // Get other team members for navigation
  const currentIndex = membersData.findIndex((m: any) => m.slug === slug);
  const prevMember = membersData[currentIndex - 1];
  const nextMember = membersData[currentIndex + 1];

  return (
    <div className="min-h-screen">
      {/* Breadcrumb Navigation */}
      <nav className="px-6 py-4 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm">
              <Link
                href="/"
                className="hover:underline"
                style={{ color: "var(--muted)" }}
              >
                Home
              </Link>
              <ChevronRight size={16} style={{ color: "var(--muted)" }} />
              <Link
                href="/team"
                className="hover:underline"
                style={{ color: "var(--muted)" }}
              >
                Team
              </Link>
              <ChevronRight size={16} style={{ color: "var(--muted)" }} />
              <span style={{ color: "var(--text)" }}>{member.name}</span>
            </div>

            <Link href="/team">
              <Button variant="ghost" leftIcon={<ArrowLeft size={16} />}>
                Back to Team
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Profile Header */}
      <section
        className="px-6 py-12 lg:px-8"
        style={{ backgroundColor: "var(--card)" }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Avatar and Basic Info */}
            <div className="text-center lg:text-left">
              <div className="relative inline-block mb-6">
                <Image
                  src={member.avatar}
                  alt={member.name}
                  width={150}
                  height={150}
                  className="rounded-full object-cover"
                  style={{
                    boxShadow: "0 0 0 4px var(--accent)",
                  }}
                />
                {/* Status indicator */}
                <div
                  className="absolute bottom-4 right-4 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center"
                  style={{
                    backgroundColor:
                      member.availability_status === "available"
                        ? "#10B981"
                        : "#F59E0B",
                  }}
                >
                  <span className="text-xs font-bold text-white">
                    {member.availability_status === "available" ? "✓" : "•"}
                  </span>
                </div>
              </div>

              <h1
                className="text-3xl font-bold mb-2"
                style={{ color: "var(--text)" }}
              >
                {member.name}
              </h1>
              <p className="text-xl mb-4" style={{ color: "var(--accent)" }}>
                {member.role}
              </p>
              <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
                {member.department}
              </p>

              {/* Contact Information */}
              <div className="space-y-2 mb-6 text-sm">
                {member.location && (
                  <div className="flex items-center justify-center lg:justify-start gap-2">
                    <MapPin size={16} style={{ color: "var(--muted)" }} />
                    <span style={{ color: "var(--text)" }}>
                      {member.location}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <Calendar size={16} style={{ color: "var(--muted)" }} />
                  <span style={{ color: "var(--text)" }}>
                    Member since {new Date(member.member_since).getFullYear()}
                  </span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor:
                        member.availability_status === "available"
                          ? "#10B981"
                          : "#F59E0B",
                    }}
                  />
                  <span style={{ color: "var(--text)" }}>
                    {member.availability_status === "available"
                      ? "Available for projects"
                      : "Currently busy"}
                  </span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex justify-center lg:justify-start gap-4 mb-6">
                <a
                  href={`mailto:${member.contact_email}`}
                  className="p-2 rounded-full transition-colors hover:scale-110"
                  style={{
                    backgroundColor: "var(--bg)",
                    color: "var(--muted)",
                  }}
                >
                  <Mail size={20} />
                </a>
                {Object.entries(member.social_links).map(([platform, url]) => {
                  if (!url) return null;
                  const IconComponent =
                    platform === "github"
                      ? Github
                      : platform === "linkedin"
                      ? Linkedin
                      : platform === "twitter"
                      ? Twitter
                      : Globe;

                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full transition-colors hover:scale-110"
                      style={{
                        backgroundColor: "var(--bg)",
                        color: "var(--muted)",
                      }}
                    >
                      <IconComponent size={20} />
                    </a>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Button leftIcon={<Mail size={16} />}>
                  <a href={`mailto:${member.contact_email}`}>Contact</a>
                </Button>
                {member.resume_url && (
                  <Button variant="outline" leftIcon={<Download size={16} />}>
                    <a href={member.resume_url} download>
                      Download Resume
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {/* About and Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Bio */}
              <div>
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{ color: "var(--text)" }}
                >
                  About {member.name.split(" ")[0]}
                </h2>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: "var(--text)" }}
                >
                  {member.bio_long}
                </p>
              </div>

              {/* Skills */}
              <div>
                <h3
                  className="text-xl font-semibold mb-4"
                  style={{ color: "var(--text)" }}
                >
                  Skills & Expertise
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {Object.entries(
                    member.skills.reduce((acc: any, skill: any) => {
                      if (!acc[skill.category]) acc[skill.category] = [];
                      acc[skill.category].push(skill);
                      return acc;
                    }, {})
                  ).map(([category, skills]) => (
                    <div key={category}>
                      <h4
                        className="font-medium mb-3"
                        style={{ color: "var(--accent)" }}
                      >
                        {category}
                      </h4>
                      <div className="space-y-2">
                        {(skills as any[]).map((skill) => (
                          <div
                            key={skill.name}
                            className="flex items-center justify-between"
                          >
                            <span
                              className="text-sm"
                              style={{ color: "var(--text)" }}
                            >
                              {skill.name}
                            </span>
                            <div className="flex gap-1">
                              {[1, 2, 3].map((level) => (
                                <Star
                                  key={level}
                                  size={12}
                                  fill={
                                    level <=
                                    (skill.level === "expert"
                                      ? 3
                                      : skill.level === "intermediate"
                                      ? 2
                                      : 1)
                                      ? "var(--accent)"
                                      : "transparent"
                                  }
                                  style={{ color: "var(--accent)" }}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Career Highlights */}
              {member.career_highlights &&
                member.career_highlights.length > 0 && (
                  <div>
                    <h3
                      className="text-xl font-semibold mb-4"
                      style={{ color: "var(--text)" }}
                    >
                      Career Highlights
                    </h3>
                    <div className="space-y-4">
                      {member.career_highlights.map(
                        (highlight: any, index: number) => (
                          <div
                            key={index}
                            className="p-4 rounded-lg border-l-4"
                            style={{
                              backgroundColor: "var(--bg)",
                              borderLeftColor: "var(--accent)",
                              boxShadow: "var(--shadow-sm)",
                            }}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4
                                className="font-semibold"
                                style={{ color: "var(--text)" }}
                              >
                                {highlight.title}
                              </h4>
                              <span
                                className="text-sm px-2 py-1 rounded"
                                style={{
                                  backgroundColor: "var(--accent)",
                                  color: "white",
                                }}
                              >
                                {highlight.year}
                              </span>
                            </div>
                            <p
                              className="text-sm"
                              style={{ color: "var(--muted)" }}
                            >
                              {highlight.description}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Works */}
      {memberWorks.length > 0 && (
        <section className="px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2
              className="text-2xl font-bold mb-8"
              style={{ color: "var(--text)" }}
            >
              Projects by {member.name.split(" ")[0]}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memberWorks.map((work: any) => (
                <div
                  key={work.id}
                  className="p-4 rounded-lg hover-lift transition-all duration-300"
                  style={{
                    backgroundColor: "var(--card)",
                    boxShadow: "var(--shadow)",
                  }}
                >
                  <h3
                    className="font-semibold mb-2"
                    style={{ color: "var(--text)" }}
                  >
                    {work.title}
                  </h3>
                  <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>
                    {work.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {work.tags.slice(0, 3).map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-full"
                        style={{
                          backgroundColor: "var(--accent)",
                          color: "white",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Navigation to Other Members */}
      <section
        className="px-6 py-8 border-t"
        style={{ borderColor: "var(--muted)", opacity: 0.2 }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-between items-center">
            {prevMember ? (
              <Link href={`/profile/${prevMember.slug}`}>
                <Button variant="outline" leftIcon={<ChevronLeft size={16} />}>
                  {prevMember.name}
                </Button>
              </Link>
            ) : (
              <div />
            )}

            {nextMember ? (
              <Link href={`/profile/${nextMember.slug}`}>
                <Button
                  variant="outline"
                  rightIcon={<ChevronRight size={16} />}
                >
                  {nextMember.name}
                </Button>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
