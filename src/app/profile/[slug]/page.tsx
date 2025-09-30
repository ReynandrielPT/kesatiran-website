"use client";

import React, { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowLeft,
  Mail,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Music,
  CodeXml,
  Server,
  Cloud,
  Palette,
  GitBranchPlus,
  Wrench,
  Network,
  Container,
  ServerCog,
  FileTerminal,
  ShieldCheck,
  Package,
  Workflow,
  Languages,
  Search,
  Star,
  Pickaxe,
  Clapperboard,
  Quote,
  GraduationCap,
  Briefcase,
  Award,
} from "lucide-react";

import RevealOnScroll from "@/components/RevealOnScroll";
import membersData from "@/data/members.json";
import worksData from "@/data/works.json";
import { titleCase } from "@/lib/utils";

interface ProfilePageProps {
  params: Promise<{
    slug: string;
  }>;
}

const getSkillIcon = (skill: { category: string }) => {
  const category = skill.category.toLowerCase();
  const iconSize = 14;
  const iconClass = "opacity-70";

  switch (category) {
    case "frontend":
      return <CodeXml size={iconSize} className={iconClass} />;
    case "backend":
      return <Server size={iconSize} className={iconClass} />;
    case "languages":
      return <Languages size={iconSize} className={iconClass} />;
    case "cloud":
      return <Cloud size={iconSize} className={iconClass} />;
    case "devops":
      return <GitBranchPlus size={iconSize} className={iconClass} />;
    case "design":
      return <Palette size={iconSize} className={iconClass} />;
    case "research":
      return <Search size={iconSize} className={iconClass} />;
    case "branding":
      return <Star size={iconSize} className={iconClass} />;
    case "orchestration":
      return <Network size={iconSize} className={iconClass} />;
    case "containerization":
      return <Container size={iconSize} className={iconClass} />;
    case "infrastructure":
      return <ServerCog size={iconSize} className={iconClass} />;
    case "scripting":
      return <FileTerminal size={iconSize} className={iconClass} />;
    case "qa":
      return <ShieldCheck size={iconSize} className={iconClass} />;
    case "product":
      return <Package size={iconSize} className={iconClass} />;
    case "methodology":
      return <Workflow size={iconSize} className={iconClass} />;
    default:
      return <Wrench size={iconSize} className={iconClass} />;
  }
};

export default function ProfilePage({ params }: ProfilePageProps) {
  const { slug } = use(params);
  const member = membersData.find((m: any) => m.slug === slug);

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold">member wandered off</h1>
          <Link href="/team">
            <Button variant="outline" size="sm" pill>
              back to circle
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const memberWorks = worksData.filter((work: any) =>
    work.contributors.includes(member.id)
  );
  const currentIndex = membersData.findIndex((m: any) => m.slug === slug);
  const prevMember = membersData[currentIndex - 1];
  const nextMember = membersData[currentIndex + 1];

  const firstName = member.name.split(" ")[0];
  // Derive institute from explicit field or parse from department string
  let instituteName: string | null = (member as any).institute ?? null;
  if (!instituteName && member.department) {
    const dept = String(member.department);
    const lower = dept.toLowerCase();
    const separators = [" on ", " at "];
    for (const sep of separators) {
      const idx = lower.indexOf(sep);
      if (idx !== -1) {
        instituteName = dept.slice(idx + sep.length).trim();
        break;
      }
    }
    if (!instituteName) {
      const m = dept.match(
        /(Institut|Universitas|University|Politeknik|College|School|Sekolah|SMK|SMA)[\s\S]*$/i
      );
      if (m) instituteName = m[0].trim();
    }
  }
  const funFacts: string[] = [];
  if (member.location) funFacts.push(member.location);
  const joinedYear = member.member_since
    ? new Date(member.member_since).getFullYear()
    : null;
  if (joinedYear) funFacts.push(`joined ${joinedYear}`);
  funFacts.push(
    member.availability_status === "available" ? "free to jam" : "heads down"
  );
  if (member.skills && member.skills.length) {
    funFacts.push(member.skills[0].name.toLowerCase() + " fan");
  }

  // Helpers for CV-like sections
  const experiences: any[] =
    (member as any).experiences ??
    ((member as any).career_highlights
      ? (member as any).career_highlights.map((ch: any) => ({
          title: ch.title,
          company: ch.company ?? undefined,
          year: ch.year,
          description: ch.description,
        }))
      : []);

  const achievements: any[] = (member as any).achievements ?? [];
  const education: any[] = (member as any).education ?? [];

  const starsForLevel = (level?: string) => {
    const l = (level ?? "").toString().toLowerCase();
    if (l.includes("expert")) return 5;
    if (l.includes("advanced")) return 4;
    if (l.includes("intermediate")) return 3;
    if (l.includes("beginner")) return 2;
    if (l.includes("novice")) return 1;
    return 3; // default mid
  };

  return (
    <div className="min-h-screen pt-30 pb-24 space-y-16">
      <RevealOnScroll delay={0.1}>
        <div className="px-6 max-w-5xl mx-auto">
          <Link
            href="/team"
            className="inline-flex items-center text-[12px] opacity-60 hover:opacity-100 transition"
          >
            <ArrowLeft size={14} /> back to circle
          </Link>
        </div>
      </RevealOnScroll>

      <section className="px-6 mx-auto max-w-5xl">
        <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 items-start">
          <RevealOnScroll delay={0.2}>
            <div className="relative h-40 w-40 rounded-2xl overflow-hidden ring-1 ring-[color-mix(in_srgb,var(--foreground)_15%,transparent)]">
              <Image
                src={member.avatar}
                alt={member.name}
                fill
                sizes="160px"
                className="object-cover"
              />
              <div className="absolute bottom-2 left-2 px-2 py-1 rounded-full text-[10px] font-medium bg-[color-mix(in_srgb,var(--accent)_60%,transparent)] text-accent-foreground backdrop-blur">
                {member.availability_status === "available" ? "online" : "busy"}
              </div>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.3}>
            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-heading">
                    {titleCase(member.name)}
                  </h1>
                  {member.department && (
                    <Badge
                      size="sm"
                      variant="secondary"
                      className="align-middle"
                    >
                      {member.department}
                    </Badge>
                  )}
                </div>
                <p className="text-sm font-medium text-[var(--accent)]">
                  {member.role}
                </p>
                {instituteName && (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="inline-flex items-center gap-1 text-xs opacity-75">
                      <GraduationCap size={12} /> {titleCase(instituteName)}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-sm leading-relaxed max-w-prose opacity-80">
                {member.bio_short}
              </p>
              <div className="flex flex-wrap gap-2">
                {funFacts.map((f) => (
                  <Badge key={f} size="xs" variant="soft">
                    {f}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-3 pt-1">
                <Button size="xs" pill variant="gradient">
                  <a href={`mailto:${member.contact_email}`}>say hi</a>
                </Button>
                <div className="flex gap-2">
                  {Object.entries(member.social_links ?? {})
                    .slice(0, 4)
                    .map(([platform, url]) => {
                      if (!url) return null;
                      const Icon =
                        platform === "github"
                          ? Github
                          : platform === "linkedin"
                          ? Linkedin
                          : platform === "twitter"
                          ? Twitter
                          : platform === "instagram"
                          ? Instagram
                          : Mail;
                      return (
                        <a
                          key={platform}
                          href={url as string}
                          target="_blank"
                          rel="noreferrer"
                          className="h-8 w-8 rounded-full flex items-center justify-center text-[11px] ring-1 ring-[color-mix(in_srgb,var(--foreground)_18%,transparent)] hover:ring-[var(--accent)]/60 transition"
                        >
                          <Icon size={14} />
                        </a>
                      );
                    })}
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="px-6 mx-auto max-w-5xl space-y-16">
        <RevealOnScroll delay={0.4}>
          <div className="space-y-4">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Sparkles size={14} /> about {titleCase(firstName)}
            </h2>
            <p className="text-sm leading-relaxed opacity-80 text-justify w-full">
              {member.bio_long}
            </p>
          </div>
        </RevealOnScroll>

        {experiences && experiences.length > 0 && (
          <RevealOnScroll delay={0.43}>
            <div className="space-y-4">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <Briefcase size={14} /> experience
              </h3>
              <div className="space-y-3">
                {experiences.slice(0, 6).map((ex: any, idx: number) => (
                  <RevealOnScroll key={idx} delay={idx * 0.05}>
                    <div className="p-3 rounded-lg bg-[color-mix(in_srgb,var(--foreground)_6%,transparent)] ring-1 ring-[color-mix(in_srgb,var(--foreground)_12%,transparent)]">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <div className="text-sm font-medium">
                          {titleCase(ex.title ?? ex.role ?? "")}
                        </div>
                        {(ex.company || ex.organization) && (
                          <div className="text-xs opacity-70">
                            @ {titleCase(ex.company ?? ex.organization)}
                          </div>
                        )}
                        {(ex.year || ex.period || ex.start || ex.end) && (
                          <div className="text-xs opacity-50 sm:ml-auto">
                            {ex.period ??
                              (ex.start
                                ? [ex.start, ex.end ?? "present"].join(" — ")
                                : ex.year)}
                          </div>
                        )}
                      </div>
                      {ex.description && (
                        <p className="text-xs opacity-70 mt-1">
                          {ex.description}
                        </p>
                      )}
                    </div>
                  </RevealOnScroll>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        )}

        {/* Education */}
        {(education.length > 0 || instituteName) && (
          <RevealOnScroll delay={0.44}>
            <div className="space-y-4">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <GraduationCap size={14} /> education
              </h3>
              <div className="space-y-3">
                {education.length > 0 ? (
                  education.slice(0, 4).map((ed: any, idx: number) => (
                    <RevealOnScroll key={idx} delay={idx * 0.05}>
                      <div className="p-3 rounded-lg bg-[color-mix(in_srgb,var(--foreground)_6%,transparent)] ring-1 ring-[color-mix(in_srgb,var(--foreground)_12%,transparent)]">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <div className="text-sm font-medium">
                            {titleCase(
                              [ed.degree, ed.subject]
                                .filter(Boolean)
                                .join(" in ") || "Education"
                            )}
                          </div>
                          <div className="text-xs opacity-70">
                            {titleCase(ed.institution ?? instituteName ?? "")}
                          </div>
                          {(ed.period || ed.start || ed.end || ed.year) && (
                            <div className="text-xs opacity-50 sm:ml-auto">
                              {ed.period ??
                                (ed.start
                                  ? [ed.start, ed.end ?? "present"].join(" — ")
                                  : ed.year)}
                            </div>
                          )}
                        </div>
                        {ed.description && (
                          <p className="text-xs opacity-70 mt-1">
                            {ed.description}
                          </p>
                        )}
                      </div>
                    </RevealOnScroll>
                  ))
                ) : (
                  <div className="p-3 rounded-lg bg-[color-mix(in_srgb,var(--foreground)_6%,transparent)] ring-1 ring-[color-mix(in_srgb,var(--foreground)_12%,transparent)]">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">
                        {titleCase(member.department || "Student")}
                      </div>
                      <div className="text-xs opacity-70">
                        {titleCase(instituteName!)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </RevealOnScroll>
        )}

        {member.skills && member.skills.length > 0 && (
          <RevealOnScroll delay={0.45}>
            <div className="space-y-4">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <Pickaxe size={14} /> skills
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {member.skills.slice(0, 12).map((s: any, index: number) => {
                  const stars = starsForLevel(s.level);
                  return (
                    <RevealOnScroll key={s.name} delay={index * 0.05}>
                      <div className="flex items-center justify-between p-2 rounded-md bg-[color-mix(in_srgb,var(--foreground)_6%,transparent)] ring-1 ring-[color-mix(in_srgb,var(--foreground)_12%,transparent)]">
                        <div className="flex items-center gap-2 text-sm">
                          {getSkillIcon(s)}
                          <span>{s.name}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={
                                i < stars
                                  ? "text-[var(--accent)]"
                                  : "opacity-30"
                              }
                              fill={i < stars ? "currentColor" : "none"}
                              strokeWidth={i < stars ? 0 : 2}
                            />
                          ))}
                        </div>
                      </div>
                    </RevealOnScroll>
                  );
                })}
              </div>
            </div>
          </RevealOnScroll>
        )}

        {achievements && achievements.length > 0 && (
          <RevealOnScroll delay={0.47}>
            <div className="space-y-4">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <Award size={14} /> achievements & competitions
              </h3>
              <div className="flex flex-wrap gap-2">
                {achievements.slice(0, 12).map((a: any, idx: number) => (
                  <RevealOnScroll key={idx} delay={idx * 0.05}>
                    <Badge
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1.5"
                    >
                      <Award size={12} className="opacity-70" />
                      <span className="text-xs">
                        {titleCase(a.title ?? a.name ?? "Achievement")}
                        {a.placement ? ` — ${a.placement}` : ""}
                        {a.year ? ` (${a.year})` : ""}
                      </span>
                    </Badge>
                  </RevealOnScroll>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        )}

        {member.fav_songs && member.fav_songs.length > 0 && (
          <RevealOnScroll delay={0.5}>
            <div className="space-y-4">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <Music size={14} /> fav songs
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {member.fav_songs
                  .slice(0, 4)
                  .map((songId: string, index: number) => (
                    <RevealOnScroll key={songId} delay={index * 0.1}>
                      <iframe
                        className="rounded-lg w-full"
                        src={`https://open.spotify.com/embed/track/${songId}?utm_source=generator&theme=0`}
                        width="100%"
                        height="80"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                      ></iframe>
                    </RevealOnScroll>
                  ))}
              </div>
            </div>
          </RevealOnScroll>
        )}

        {member.fav_media && member.fav_media.length > 0 && (
          <RevealOnScroll delay={0.55}>
            <div className="space-y-4">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <Clapperboard size={14} /> fav movies & series
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {member.fav_media
                  .slice(0, 4)
                  .map((imdbId: string, index: number) => (
                    <RevealOnScroll key={imdbId} delay={index * 0.1}>
                      <div className="aspect-video w-full">
                        <iframe
                          src={`https://multiembed.mov/?video_id=${imdbId}`}
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          allowFullScreen
                          className="rounded-lg"
                        ></iframe>
                      </div>
                    </RevealOnScroll>
                  ))}
              </div>
            </div>
          </RevealOnScroll>
        )}

        {memberWorks.length > 0 && (
          <RevealOnScroll delay={0.6}>
            <div className="space-y-5">
              <h3 className="text-base font-semibold">
                little things helped on
              </h3>
              <div className="grid sm:grid-cols-2 gap-5">
                {memberWorks.slice(0, 4).map((w: any, index: number) => (
                  <RevealOnScroll key={w.id} delay={index * 0.1}>
                    <div className="p-4 rounded-xl bg-[color-mix(in_srgb,var(--foreground)_6%,transparent)] ring-1 ring-[color-mix(in_srgb,var(--foreground)_12%,transparent)] flex flex-col gap-3">
                      <h4 className="text-sm font-medium line-clamp-2">
                        {w.title}
                      </h4>
                      <p className="text-[11px] opacity-60 line-clamp-3">
                        {w.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-auto">
                        {w.tags.slice(0, 2).map((t: string) => (
                          <Badge key={t} size="xs" variant="soft">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </RevealOnScroll>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        )}

        {member.personal_quote && (
          <RevealOnScroll delay={0.65}>
            <div className="relative rounded-lg border border-border bg-card/50 p-6">
              <Quote className="absolute -top-3 -left-3 h-8 w-8 text-accent/30" />
              <p className="text-sm italic leading-relaxed text-muted-foreground">
                {member.personal_quote}
              </p>
            </div>
          </RevealOnScroll>
        )}
      </section>

      <RevealOnScroll delay={0.7}>
        <section className="px-6 mx-auto max-w-5xl">
          <div className="flex justify-between items-center pt-10 border-t border-[color-mix(in_srgb,var(--foreground)_12%,transparent)]">
            {prevMember ? (
              <Link
                href={`/profile/${prevMember.slug}`}
                className="text-[11px] flex items-center gap-1 opacity-70 hover:opacity-100 transition"
              >
                <ChevronLeft size={14} />{" "}
                {titleCase(prevMember.name.split(" ")[0])}
              </Link>
            ) : (
              <span />
            )}
            {nextMember ? (
              <Link
                href={`/profile/${nextMember.slug}`}
                className="text-[11px] flex items-center gap-1 opacity-70 hover:opacity-100 transition"
              >
                {titleCase(nextMember.name.split(" ")[0])}{" "}
                <ChevronRight size={14} />
              </Link>
            ) : (
              <span />
            )}
          </div>
        </section>
      </RevealOnScroll>
    </div>
  );
}
