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
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Music,
  // Ikon baru untuk Skills
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
} from "lucide-react";

import RevealOnScroll from "@/components/RevealOnScroll"; // Pastikan ini diimpor
import membersData from "@/data/members.json";
import worksData from "@/data/works.json";

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

  return (
    <div className="min-h-screen pt-30 pb-24 space-y-8">
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
              <div className="absolute bottom-2 left-2 px-2 py-1 rounded-full text-[10px] font-medium bg-[color-mix(in_srgb,var(--accent)_60%,transparent)] text-white/90 backdrop-blur">
                {member.availability_status === "available" ? "online" : "busy"}
              </div>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.3}>
            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-heading">
                  {member.name.toLowerCase()}
                </h1>
                <p className="text-sm font-medium text-[var(--accent)]">
                  {member.role}
                </p>
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

      <RevealOnScroll delay={0.4}>
        <section className="px-6 mx-auto max-w-5xl space-y-16">
          <div className="space-y-4">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Sparkles size={14} /> about {firstName.toLowerCase()}
            </h2>
            <p className="text-sm leading-relaxed opacity-80 text-justify w-full">
              {member.bio_long}
            </p>
          </div>

          {member.skills && member.skills.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <Pickaxe size={14} /> some skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {member.skills.slice(0, 12).map((s: any) => (
                  <Badge
                    key={s.name}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1.5"
                  >
                    {getSkillIcon(s)}
                    {s.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* EDITED: Fav Songs Section with RevealOnScroll */}
          {member.fav_songs && member.fav_songs.length > 0 && (
            <RevealOnScroll delay={0.5}>
              {" "}
              {/* Tambahkan RevealOnScroll di sini */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold flex items-center gap-2">
                  <Music size={14} /> fav songs
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {member.fav_songs
                    .slice(0, 4)
                    .map((songId: string, index: number) => (
                      // Berikan delay tambahan untuk efek berjenjang jika diinginkan
                      <iframe
                        key={songId}
                        className="rounded-lg"
                        src={`https://open.spotify.com/embed/track/${songId}?utm_source=generator&theme=0`}
                        width="100%"
                        height="80"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                      ></iframe>
                    ))}
                </div>
              </div>
            </RevealOnScroll>
          )}

          {memberWorks.length > 0 && (
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
          )}
        </section>
      </RevealOnScroll>

      <RevealOnScroll delay={0.5}>
        <section className="px-6 mx-auto max-w-5xl">
          <div className="flex justify-between items-center pt-10 border-t border-[color-mix(in_srgb,var(--foreground)_12%,transparent)]">
            {prevMember ? (
              <Link
                href={`/profile/${prevMember.slug}`}
                className="text-[11px] flex items-center gap-1 opacity-70 hover:opacity-100 transition"
              >
                <ChevronLeft size={14} />{" "}
                {prevMember.name.split(" ")[0].toLowerCase()}
              </Link>
            ) : (
              <span />
            )}
            {nextMember ? (
              <Link
                href={`/profile/${nextMember.slug}`}
                className="text-[11px] flex items-center gap-1 opacity-70 hover:opacity-100 transition"
              >
                {nextMember.name.split(" ")[0].toLowerCase()}{" "}
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
