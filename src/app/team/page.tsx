"use client";

import React, { useState, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Users, Filter, Sparkles } from "lucide-react";
import membersData from "@/data/members.json";
import { RawMember } from "@/components/MemberCard";

interface Skill {
  name: string;
  category: string;
  level: string;
}

export default function TeamPage() {
  // Casual tag filter: use role words + departments reduced to a simple set
  const [activeTag, setActiveTag] = useState<string>("all");

  const tags = useMemo(() => {
    const base = new Set<string>();
    membersData.forEach((m: RawMember) => {
      if (m.department) base.add(m.department.toLowerCase());
      m.role
        .split(/[,/]|and|&/i)
        .map((r: string) => r.trim().toLowerCase())
        .filter(Boolean)
        .forEach((r: string) => base.add(r));
    });
    return Array.from(base).slice(0, 10); // keep it small
  }, []);

  const filtered = membersData.filter((m: RawMember) => {
    if (activeTag === "all") return true;
    const haystack = [m.department, m.role].join(" ").toLowerCase();
    return haystack.includes(activeTag);
  });

  const warmIntroRef = useRef(null);
  const warmIntroInView = useInView(warmIntroRef, { once: true, amount: 0.3 });

  const ourLittleCircleRef = useRef(null);
  const ourLittleCircleInView = useInView(ourLittleCircleRef, {
    once: true,
    amount: 0.3,
  });

  const peopleBehindRef = useRef(null);
  const peopleBehindInView = useInView(peopleBehindRef, {
    once: true,
    amount: 0.3,
  });

  const avatarStripRef = useRef(null);
  const avatarStripInView = useInView(avatarStripRef, {
    once: true,
    amount: 0.3,
  });

  const simpleTagFiltersRef = useRef(null);
  const simpleTagFiltersInView = useInView(simpleTagFiltersRef, {
    once: true,
    amount: 0.3,
  });

  const nobodyUnderThatTagRef = useRef(null);
  const nobodyUnderThatTagInView = useInView(nobodyUnderThatTagRef, {
    once: true,
    amount: 0.3,
  });

  const friendlyFooterRef = useRef(null);
  const friendlyFooterInView = useInView(friendlyFooterRef, {
    once: true,
    amount: 0.3,
  });

  const circleEnergyRef = useRef(null);
  const circleEnergyInView = useInView(circleEnergyRef, {
    once: true,
    amount: 0.3,
  });

  const backHomeRef = useRef(null);
  const backHomeInView = useInView(backHomeRef, { once: true, amount: 0.3 });

  const memberGridRef = useRef(null);
  const memberGridInView = useInView(memberGridRef, {
    once: true,
    amount: 0.3,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen pb-24 space-y-20">
      {/* Warm Intro */}
      <motion.section
        ref={warmIntroRef}
        className="pt-50 px-6 mx-auto max-w-6xl"
        initial={{ opacity: 0, y: 50 }}
        animate={warmIntroInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-8">
          <motion.div
            ref={ourLittleCircleRef}
            className="flex items-center gap-2 text-sm font-medium text-accent"
            initial={{ opacity: 0, y: 20 }}
            animate={ourLittleCircleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Sparkles size={16} /> OUR LITTLE CIRCLE
          </motion.div>
          <motion.div
            ref={peopleBehindRef}
            className="max-w-3xl space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={peopleBehindInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-4xl sm:text-5xl font-semibold leading-tight tracking-tighter">
              People behind the tiny things
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              Not a formal org chart—just friends building and doodling on the
              internet while sharing music links, snack pics and half-finished
              ideas.
            </p>
            <p className="text-sm text-muted-foreground">Total members: 7</p>
          </motion.div>
          {/* Avatar strip */}
          <motion.div
            ref={avatarStripRef}
            className="flex -space-x-4 overflow-hidden pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={avatarStripInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {membersData.slice(0, 12).map((m: RawMember) => (
              <Link
                key={m.id}
                href={`/profile/${m.slug}`}
                className="relative inline-block h-14 w-14 rounded-full ring-2 ring-background hover:z-20 transition-transform hover:scale-110"
              >
                <Image
                  src={m.avatar || m.photo || ""}
                  alt={m.name}
                  fill
                  sizes="56px"
                  className="object-cover rounded-full"
                />
              </Link>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Simple tag filters */}
      <motion.section
        ref={simpleTagFiltersRef}
        className="px-6 mx-auto max-w-6xl space-y-6"
        initial={{ opacity: 0, y: 50 }}
        animate={simpleTagFiltersInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => setActiveTag("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTag === "all"
                ? "bg-accent text-accent-foreground"
                : "bg-secondary text-muted-foreground hover:bg-tertiary hover:text-foreground"
            }`}
          >
            All
          </button>
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTag(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                activeTag === t
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-muted-foreground hover:bg-tertiary hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </motion.section>

      {/* Member Grid – lighter cards */}
      <section className="px-6 mx-auto max-w-6xl">
        <motion.div
          ref={memberGridRef}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={memberGridInView ? "show" : "hidden"}
        >
          {filtered.map((m: RawMember) => (
            <motion.div key={m.id} variants={itemVariants}>
              <Link href={`/profile/${m.slug}`} className="group">
                <Card className="p-5 flex flex-col gap-5 h-full">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-xl overflow-hidden ring-1 ring-[color-mix(in_srgb,var(--foreground)_15%,transparent)] group-hover:ring-[var(--accent)]/60 transition">
                      <Image
                        src={m.avatar || m.photo || ""}
                        alt={m.name}
                        fill
                        sizes="64px"
                        className="object-cover group-hover:scale-[1.05] transition"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold truncate">
                        {m.name}
                      </h3>
                      <p className="text-[11px] opacity-60 truncate">
                        {m.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-[11px] leading-relaxed line-clamp-3 opacity-70">
                    {m.bio_short}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-auto">
                    {m.skills?.slice(0, 3).map((s: Skill) => (
                      <Badge key={s.name} size="xs" variant="soft">
                        {s.name}
                      </Badge>
                    ))}
                    {m.skills && m.skills.length > 3 && (
                      <Badge size="xs" variant="outline">
                        +{m.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        {filtered.length === 0 && (
          <motion.div
            ref={nobodyUnderThatTagRef}
            className="text-center py-24 text-sm opacity-60"
            initial={{ opacity: 0, y: 20 }}
            animate={nobodyUnderThatTagInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            nobody under that tag right now
          </motion.div>
        )}
      </section>

      {/* Friendly footer blurb inside page (main site footer can still exist) */}
      <motion.section
        ref={friendlyFooterRef}
        className="px-6 mx-auto max-w-6xl pt-10"
        initial={{ opacity: 0, y: 50 }}
        animate={friendlyFooterInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <div className="rounded-2xl p-8 bg-[color-mix(in_srgb,var(--foreground)_4%,transparent)] ring-1 ring-[color-mix(in_srgb,var(--foreground)_10%,transparent)] flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <motion.div
            ref={circleEnergyRef}
            className="flex-1 space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={circleEnergyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Users size={16} /> circle energy
            </h2>
            <p className="text-[12px] opacity-70 leading-relaxed max-w-md">
              we cheer for each other's half-finished stuff & random ideas.
              profiles are just snapshots; ask us what we're poking at now.
            </p>
          </motion.div>
          <motion.div
            ref={backHomeRef}
            initial={{ opacity: 0, y: 20 }}
            animate={backHomeInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/">
              <Button variant="outline" size="sm" pill>
                back home
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
