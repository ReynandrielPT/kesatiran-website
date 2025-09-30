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
import { motion } from "framer-motion";
import { useState } from "react";

export default function Home() {
  // Curate a lighter, more casual surface slice
  const recentProjects = works.slice(0, 3);
  const recentGames = games.slice(0, 2);
  const circle = members.slice(0, 9); // just a handful for the collage
  // Home hero circle image: try a custom image in public first, fallback to first member
  const [useMemberCircle, setUseMemberCircle] = useState(false);
  const heroCircleSrc = useMemberCircle
    ? members[0].avatar || members[0].photo
    : "/media/works/circle.jpg"; // place your image here (public/media/works/circle.jpg)
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
      <section className="pt-45 px-6 py-6 mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-14 items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 text-sm font-medium text-accent uppercase tracking-wider"
            >
              <Sparkles size={16} /> Just a small friend circle
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-semibold leading-tight tracking-tighter text-heading"
            >
              We make tiny things
              <span className="block text-muted-foreground">
                that make us smile
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-base md:text-lg max-w-prose text-muted-foreground"
            >
              No pitch deck. No roadmap. Just a rotating pile of hobby projects,
              mini games, sketches & experiments while we study. Everything here
              is unfinished in a cozy way.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-3 pt-2"
            >
              <Link href="/team">
                <Button variant="gradient" size="md">
                  Meet the Circle
                </Button>
              </Link>
              <Link href="/works">
                <Button variant="outline" size="md">
                  Projects
                </Button>
              </Link>
              <Link href="/games">
                <Button variant="ghost" size="md">
                  Games
                </Button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="relative mt-4 pt-4"
            >
              <div className="flex items-center gap-2 text-xs px-4 py-2 rounded-lg bg-secondary text-muted-foreground w-fit">
                <Clock size={12} /> Currently{" "}
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
            </motion.div>
          </div>
          {/* Single Circular Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            viewport={{ once: true }}
            className="flex justify-center items-center"
          >
            <div className="relative size-80 rounded-full overflow-hidden border-4 border-accent/40 shadow-lg">
              <Image
                src={heroCircleSrc}
                alt={useMemberCircle ? members[0].name : "Circle image"}
                fill
                sizes="320px"
                className="object-cover"
                onError={() => setUseMemberCircle(true)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recently made stuff */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mx-auto max-w-6xl px-6 space-y-12"
      >
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold flex items-center gap-3">
            <Briefcase size={22} /> Recent Little Projects
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            Half-finished things we still like enough to show.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {recentProjects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href="/works" className="group">
                <Card className="p-4 flex flex-col gap-4 h-full bg-secondary border border-border hover:border-accent/40 transition-all duration-300">
                  <div className="aspect-video relative rounded-md overflow-hidden">
                    <Image
                      src={p.thumb}
                      alt={p.title}
                      fill
                      sizes="(max-width:768px) 100vw, 240px"
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-base font-semibold line-clamp-2 group-hover:text-accent transition-colors">
                      {p.title}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.slice(0, 2).map((t) => (
                        <Badge key={t} size="sm" variant="secondary">
                          {t}
                        </Badge>
                      ))}
                      {p.tags.length > 2 && (
                        <Badge size="sm" variant="outline">
                          +{p.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Games (small) */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mx-auto max-w-6xl px-6 space-y-10"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <Gamepad2 size={22} /> Quick Little Games
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Break-time loops & tiny mechanics.
            </p>
          </div>
          <Link
            href="/games"
            className="text-sm text-accent hover:underline flex items-center gap-1.5"
          >
            All Games <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {recentGames.map((g, i) => (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href="/games" className="group">
                <div className="bg-secondary rounded-lg p-3 text-center border border-border hover:border-accent/40 transition-all duration-300">
                  <div className="relative aspect-square rounded-md overflow-hidden mb-3">
                    <Image
                      src={g.cover}
                      alt={g.title}
                      fill
                      sizes="(max-width:768px) 50vw, 200px"
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-1">
                    {g.title}
                  </h3>
                  <div className="flex flex-wrap gap-1 justify-center mt-2">
                    {g.tags.slice(0, 1).map((t) => (
                      <Badge key={t} size="xs" variant="secondary">
                        {t}
                      </Badge>
                    ))}
                    {g.tags.length > 1 && (
                      <Badge size="xs" variant="outline">
                        +{g.tags.length - 1}
                      </Badge>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mx-auto max-w-6xl px-6 space-y-10"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <Users size={22} /> The Circle
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              A few of the friends behind the projects.
            </p>
          </div>
          <Link
            href="/team"
            className="text-sm text-accent hover:underline flex items-center gap-1.5"
          >
            Full Team <ArrowRight size={14} />
          </Link>
        </div>
        <div className="relative overflow-hidden">
          {/* Desktop Gallery View */}
          <div className="hidden lg:flex gap-6 justify-center items-center py-8">
            {members.slice(0, 7).map((member, i) => {
              const centerIndex = Math.floor(7 / 2); // Index 3 is center
              const distanceFromCenter = Math.abs(i - centerIndex);
              const isCenter = i === centerIndex;
              const scale = isCenter ? 1 : 0.8 - distanceFromCenter * 0.1;
              const opacity = isCenter ? 1 : 0.6 - distanceFromCenter * 0.15;

              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className="flex-shrink-0"
                  style={{
                    transform: `scale(${scale})`,
                    opacity: opacity,
                    transition: "all 0.3s ease",
                  }}
                >
                  <Link
                    href={`/profile/${member.slug}`}
                    className="group block"
                  >
                    <Card className="p-6 flex flex-col gap-4 w-48 h-64 bg-secondary border border-border hover:border-accent/40 transition-all duration-300 hover:scale-105">
                      <div className="relative aspect-square rounded-xl overflow-hidden">
                        <Image
                          src={member.avatar || member.photo}
                          alt={member.name}
                          fill
                          sizes="160px"
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex flex-col gap-2 text-center">
                        <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-1">
                          {member.name}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {member.role.split(",")[0]}
                        </p>
                        <div className="flex flex-wrap gap-1 justify-center">
                          <Badge size="xs" variant="secondary">
                            {member.department.split(",")[0].toLowerCase()}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile/Tablet Horizontal Scroll */}
          <div className="lg:hidden overflow-x-auto scrollbar-hide py-4">
            <div className="flex gap-4 px-4" style={{ width: "max-content" }}>
              {members.slice(0, 7).map((member, i) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className="flex-shrink-0"
                >
                  <Link
                    href={`/profile/${member.slug}`}
                    className="group block"
                  >
                    <Card className="p-4 flex flex-col gap-3 w-40 h-56 bg-secondary border border-border hover:border-accent/40 transition-all duration-300">
                      <div className="relative aspect-square rounded-lg overflow-hidden">
                        <Image
                          src={member.avatar || member.photo}
                          alt={member.name}
                          fill
                          sizes="120px"
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex flex-col gap-2 text-center">
                        <h3 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-1">
                          {member.name}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {member.role.split(",")[0]}
                        </p>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

// animation keyframes (scoped via style jsx for now)
// could move to globals if reused elsewhere
// Avoid heavy motion – gentle vertical slide
// Using small line-height container to mask overflow
// Each phrase is 1rem tall (h-4 with text-[11px])
export const dynamic = "force-static";
