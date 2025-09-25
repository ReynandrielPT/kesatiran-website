"use client";
import members from "@/data/members.json";
import works from "@/data/works.json";
import games from "@/data/games.json";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  ArrowRight,
  Users,
  Gamepad2,
  Briefcase,
  Sparkles,
  Clock,
} from "lucide-react";

export default function Home() {
  // Curate a lighter, more casual surface slice
  const recentProjects = works.slice(0, 3);
  const recentGames = games.slice(0, 2);
  const circle = members.slice(0, 9); // just a handful for the collage
  const statusPhrases = [
    "editing pixel art",
    "debugging a sound loop",
    "arguing about indentation",
    "collecting reference screenshots",
    "renaming a variable again",
    "tuning game feel",
  ];

  return (
    <div className="min-h-screen pb-24 space-y-24">
      {/* Hero – softer, personal */}
      <section className="pt-16 px-6 mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-14 items-start">
          <div className="space-y-7">
            <div className="flex items-center gap-2 text-[11px] font-medium text-[var(--accent)]">
              <Sparkles size={14} /> just a small friend circle
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold leading-[1.05] tracking-[-1px]">
              <span className="block">we make tiny things</span>
              <span className="block opacity-80">that make us smile</span>
            </h1>
            <p className="text-sm md:text-base max-w-prose text-[color-mix(in_srgb,var(--foreground)_70%,transparent)]">
              No pitch deck. No roadmap. Just a rotating pile of hobby projects,
              mini games, sketches & experiments while we study. Everything here
              is unfinished in a cozy way.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link href="/team">
                <Button variant="gradient" size="sm" pill>
                  meet the circle
                </Button>
              </Link>
              <Link href="/works">
                <Button variant="outline" size="sm" pill>
                  projects
                </Button>
              </Link>
              <Link href="/games">
                <Button variant="ghost" size="sm" pill>
                  games
                </Button>
              </Link>
            </div>
            <div className="relative mt-4">
              <div className="flex items-center gap-2 text-[11px] px-3 py-2 rounded-full bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-[color-mix(in_srgb,var(--accent)_85%,transparent)] w-fit">
                <Clock size={12} /> currently{" "}
                <span className="inline-flex overflow-hidden relative w-40 h-4">
                  <span className="animate-[statusSlide_10s_linear_infinite] absolute inset-0 flex flex-col justify-start">
                    {statusPhrases.map((p) => (
                      <span key={p} className="h-4 leading-4">
                        {p}
                      </span>
                    ))}
                  </span>
                </span>
              </div>
            </div>
          </div>
          {/* Avatar Collage */}
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 relative">
            {circle.map((m, i) => (
              <Link
                key={m.id}
                href={`/profile/${m.slug}`}
                className="group aspect-square rounded-xl overflow-hidden relative ring-1 ring-inset ring-[color-mix(in_srgb,var(--foreground)_12%,transparent)] hover:ring-[var(--accent)]/50 transition"
              >
                <Image
                  src={m.avatar || m.photo}
                  alt={m.name}
                  fill
                  sizes="120px"
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-end p-2 transition">
                  <span className="text-[11px] font-medium text-white/90 truncate">
                    {m.name.split(" ")[0]}
                  </span>
                </div>
              </Link>
            ))}
            <Link
              href="/team"
              className="aspect-square rounded-xl flex items-center justify-center text-xs font-medium bg-[color-mix(in_srgb,var(--foreground)_6%,transparent)] hover:bg-[color-mix(in_srgb,var(--foreground)_12%,transparent)] transition ring-1 ring-inset ring-[color-mix(in_srgb,var(--foreground)_12%,transparent)]"
            >
              + more
            </Link>
          </div>
        </div>
      </section>

      {/* Recently made stuff */}
      <section className="mx-auto max-w-6xl px-6 space-y-12">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Briefcase size={18} /> recent little projects
          </h2>
          <p className="text-xs opacity-60 max-w-sm">
            Half-finished things we still like enough to show.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {recentProjects.map((p) => (
            <Link key={p.id} href="/works" className="group">
              <Card className="p-3 flex flex-col gap-3 h-full">
                <div className="aspect-video relative rounded-md overflow-hidden bg-[color-mix(in_srgb,var(--foreground)_8%,transparent)]">
                  <Image
                    src={p.thumb}
                    alt={p.title}
                    fill
                    sizes="(max-width:768px) 100vw, 240px"
                    className="object-cover group-hover:scale-[1.03] transition"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-semibold line-clamp-2">
                    {p.title}
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {p.tags.slice(0, 2).map((t) => (
                      <Badge key={t} size="xs" variant="soft">
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
            </Link>
          ))}
        </div>
      </section>

      {/* Games (small) */}
      <section className="mx-auto max-w-6xl px-6 space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Gamepad2 size={18} /> quick little games
            </h2>
            <p className="text-xs opacity-60 mt-1">
              Break-time loops & tiny mechanics.
            </p>
          </div>
          <Link
            href="/games"
            className="text-[11px] text-[var(--accent)] hover:underline flex items-center gap-1"
          >
            all games <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {recentGames.map((g) => (
            <Link key={g.id} href="/games" className="group">
              <Card className="p-3 flex flex-col gap-3 h-full">
                <div className="aspect-video relative rounded-md overflow-hidden bg-[color-mix(in_srgb,var(--foreground)_8%,transparent)]">
                  <Image
                    src={g.cover}
                    alt={g.title}
                    fill
                    sizes="(max-width:768px) 100vw, 320px"
                    className="object-cover group-hover:scale-[1.03] transition"
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
            </Link>
          ))}
        </div>
      </section>

      {/* Gentle navigation tiles */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="grid sm:grid-cols-3 gap-5">
          <Link href="/team" className="group">
            <Card className="p-5 flex flex-col gap-3 h-full">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Users size={16} /> members
              </div>
              <p className="text-[11px] opacity-65">friendly bios & roles</p>
              <span className="mt-auto text-[11px] text-[var(--accent)] flex items-center gap-1">
                open
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
                <Briefcase size={16} /> projects
              </div>
              <p className="text-[11px] opacity-65">unfinished & cozy</p>
              <span className="mt-auto text-[11px] text-[var(--accent)] flex items-center gap-1">
                open
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
                <Gamepad2 size={16} /> games
              </div>
              <p className="text-[11px] opacity-65">play a tiny loop</p>
              <span className="mt-auto text-[11px] text-[var(--accent)] flex items-center gap-1">
                open
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

// animation keyframes (scoped via style jsx for now)
// could move to globals if reused elsewhere
// Avoid heavy motion – gentle vertical slide
// Using small line-height container to mask overflow
// Each phrase is 1rem tall (h-4 with text-[11px])
export const dynamic = "force-static";
