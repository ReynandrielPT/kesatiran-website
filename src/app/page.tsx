"use client";
import members from "@/data/members.json";
import works from "@/data/works.json";
import games from "@/data/games.json";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Marquee } from "@/components/ui/Marquee";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Users, Gamepad2, Briefcase, Sparkles } from "lucide-react";

export default function Home() {
  const hobbyProjects = works.slice(0, 4);
  const miniGames = games.slice(0, 4);
  const circle = members;
  const techItems = [
    "TypeScript",
    "React 19",
    "Next.js 15",
    "Tailwind v4",
    "Node.js",
    "PostgreSQL",
    "Figma",
    "Kubernetes",
    "Cloud",
  ];

  return (
    <div className="min-h-screen pb-24 space-y-20">
      {/* Hero */}
      <section className="pt-14 px-6 mx-auto max-w-7xl">
        <div className="grid md:grid-cols-[1.1fr_.9fr] gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] tracking-wide bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] text-[var(--accent)]">
              <Sparkles size={14} /> Undergraduate Creative Circle
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold leading-tight gradient-title">
              We build small things
              <br /> that feel personal
            </h1>
            <p className="text-sm md:text-base max-w-prose text-[color-mix(in_srgb,var(--foreground)_72%,transparent)]">
              A circle of informatics students experimenting with code, art,
              sound and systems. This isn’t a corporate portfolio—just our
              playground of side projects, prototypes and late‑night ideas.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/team">
                <Button variant="gradient" size="sm">
                  Circle Members
                </Button>
              </Link>
              <Link href="/works">
                <Button variant="outline" size="sm">
                  Hobby Projects
                </Button>
              </Link>
              <Link href="/games">
                <Button variant="ghost" size="sm">
                  Mini Games
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <Card className="h-full glass-panel p-6 flex flex-col gap-5">
              <div className="text-sm font-medium text-[var(--accent)]">
                Snapshot
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 rounded-lg soft-border">
                  <div className="text-2xl font-semibold">{circle.length}</div>
                  <div className="text-[11px] opacity-70">members</div>
                </div>
                <div className="p-3 rounded-lg soft-border">
                  <div className="text-2xl font-semibold">{works.length}</div>
                  <div className="text-[11px] opacity-70">projects</div>
                </div>
                <div className="p-3 rounded-lg soft-border">
                  <div className="text-2xl font-semibold">{games.length}</div>
                  <div className="text-[11px] opacity-70">games</div>
                </div>
              </div>
              <div className="mt-auto space-y-3">
                <div className="text-xs uppercase tracking-wide opacity-70">
                  Toolkit vibes
                </div>
                <Marquee items={techItems} speed={32} />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Member Slider */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users size={18} /> Circle Members
          </h2>
          <Link
            href="/team"
            className="text-xs text-[var(--accent)] hover:underline flex items-center gap-1"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="relative">
          <div className="flex gap-5 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[color-mix(in_srgb,var(--foreground)_20%,transparent)]/40">
            {circle.map((m) => (
              <Link
                key={m.id}
                href={`/profile/${m.slug}`}
                className="min-w-[190px] snap-start"
              >
                <Card className="p-4 flex flex-col items-center gap-3">
                  <div className="relative">
                    <Image
                      src={m.avatar || m.photo}
                      alt={m.name}
                      width={80}
                      height={80}
                      className="rounded-full object-cover ring-2 ring-[var(--accent)]/60"
                    />
                  </div>
                  <div className="text-center w-full">
                    <div className="text-sm font-medium truncate">{m.name}</div>
                    <div className="text-[11px] opacity-60 truncate">
                      {m.role}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Hobby Projects */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Briefcase size={18} /> Hobby Projects
          </h2>
          <Link
            href="/works"
            className="text-xs text-[var(--accent)] hover:underline flex items-center gap-1"
          >
            Explore all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {hobbyProjects.map((p) => (
            <Card key={p.id} className="p-3 flex flex-col gap-3">
              <div className="aspect-video relative rounded-md overflow-hidden bg-[color-mix(in_srgb,var(--foreground)_8%,transparent)]">
                <Image
                  src={p.thumb}
                  alt={p.title}
                  fill
                  sizes="(max-width:768px) 100vw, 300px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold line-clamp-2">
                  {p.title}
                </h3>
                <div className="flex flex-wrap gap-1">
                  {p.tags.slice(0, 2).map((t) => (
                    <Badge key={t} variant="soft" size="xs">
                      {t}
                    </Badge>
                  ))}
                  {p.tags.length > 2 && (
                    <Badge size="xs" variant="outline">
                      +{p.tags.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Mini Games */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Gamepad2 size={18} /> Mini Games
          </h2>
          <Link
            href="/games"
            className="text-xs text-[var(--accent)] hover:underline flex items-center gap-1"
          >
            All games <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {miniGames.map((g) => (
            <Card key={g.id} className="p-3 flex flex-col gap-3">
              <div className="aspect-video relative rounded-md overflow-hidden bg-[color-mix(in_srgb,var(--foreground)_8%,transparent)]">
                <Image
                  src={g.cover}
                  alt={g.title}
                  fill
                  sizes="(max-width:768px) 100vw, 300px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold line-clamp-2">
                  {g.title}
                </h3>
                <div className="flex flex-wrap gap-1">
                  {g.tags.slice(0, 2).map((t) => (
                    <Badge key={t} size="xs" variant="soft">
                      {t}
                    </Badge>
                  ))}
                  {g.tags.length > 2 && (
                    <Badge size="xs" variant="outline">
                      +{g.tags.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="grid sm:grid-cols-3 gap-4">
          <Link href="/team" className="group">
            <Card className="p-5 flex flex-col gap-3 h-full">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Users size={16} /> Members
              </div>
              <p className="text-[11px] opacity-70">
                Browse circle bios & roles.
              </p>
              <span className="mt-auto text-[11px] text-[var(--accent)] flex items-center gap-1">
                Open{" "}
                <ArrowRight
                  size={12}
                  className="transition -translate-x-1 group-hover:translate-x-0"
                />
              </span>
            </Card>
          </Link>
          <Link href="/works" className="group">
            <Card className="p-5 flex flex-col gap-3 h-full">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Briefcase size={16} /> Hobby Projects
              </div>
              <p className="text-[11px] opacity-70">
                Random prototypes & builds.
              </p>
              <span className="mt-auto text-[11px] text-[var(--accent)] flex items-center gap-1">
                Open{" "}
                <ArrowRight
                  size={12}
                  className="transition -translate-x-1 group-hover:translate-x-0"
                />
              </span>
            </Card>
          </Link>
          <Link href="/games" className="group">
            <Card className="p-5 flex flex-col gap-3 h-full">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Gamepad2 size={16} /> Mini Games
              </div>
              <p className="text-[11px] opacity-70">
                Playable experiments & loops.
              </p>
              <span className="mt-auto text-[11px] text-[var(--accent)] flex items-center gap-1">
                Open{" "}
                <ArrowRight
                  size={12}
                  className="transition -translate-x-1 group-hover:translate-x-0"
                />
              </span>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}
