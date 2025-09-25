"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { MemberCard } from "@/components/MemberCard";
import { ArrowRight, Play, ExternalLink, Users, Briefcase } from "lucide-react";

// Import data
import membersData from "@/data/members.json";
import worksData from "@/data/works.json";
import gamesData from "@/data/games.json";

export default function Home() {
  const featuredWorks = worksData.slice(0, 3);
  const featuredGames = gamesData.slice(0, 4);

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="fade-in-up">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6">
                <span style={{ color: "var(--text)" }}>Creative</span>
                <br />
                <span className="text-gradient">Digital Team</span>
              </h1>
              <p
                className="text-lg leading-8 mb-8 max-w-2xl"
                style={{ color: "var(--muted)" }}
              >
                We are Kesatiran, a passionate team of developers, designers,
                and creators building beautiful, functional, and meaningful
                digital experiences that make a difference.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/team">
                  <Button size="lg" leftIcon={<Users size={20} />}>
                    Meet Our Team
                  </Button>
                </Link>
                <Link href="/works">
                  <Button
                    variant="secondary"
                    size="lg"
                    leftIcon={<Briefcase size={20} />}
                  >
                    View Our Works
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative h-96 w-full overflow-hidden rounded-2xl lg:h-[500px]">
                <div
                  className="w-full h-full flex items-center justify-center text-white font-bold text-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent), var(--muted))",
                  }}
                >
                  Kesatiran Team
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              {/* Floating elements for visual interest */}
              <div
                className="absolute -top-4 -right-4 h-24 w-24 rounded-full opacity-80"
                style={{ backgroundColor: "var(--accent)" }}
              />
              <div
                className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full opacity-60"
                style={{ backgroundColor: "var(--muted)" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="px-6 py-16 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2
              className="text-3xl font-bold tracking-tight sm:text-4xl mb-4"
              style={{ color: "var(--text)" }}
            >
              Meet Our Team
            </h2>
            <p
              className="text-lg leading-8 max-w-2xl mx-auto"
              style={{ color: "var(--muted)" }}
            >
              Talented individuals who bring diverse skills and perspectives to
              create exceptional results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {membersData.map((member: any, index: number) => (
              <div
                key={member.id}
                className="fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <MemberCard member={member} showSkills />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/team">
              <Button variant="outline" rightIcon={<ArrowRight size={16} />}>
                View All Team Members
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Works Section */}
      <section
        className="px-6 py-16 sm:py-24 lg:px-8"
        style={{ backgroundColor: "var(--card)" }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2
              className="text-3xl font-bold tracking-tight sm:text-4xl mb-4"
              style={{ color: "var(--text)" }}
            >
              Featured Works
            </h2>
            <p
              className="text-lg leading-8 max-w-2xl mx-auto"
              style={{ color: "var(--muted)" }}
            >
              A showcase of our latest projects, from web applications to design
              systems and everything in between.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredWorks.map((work: any, index: number) => (
              <div
                key={work.id}
                className="group relative overflow-hidden rounded-xl hover-lift transition-all duration-300"
                style={{
                  backgroundColor: "var(--bg)",
                  boxShadow: "var(--shadow)",
                }}
              >
                {/* Work Image */}
                <div className="relative h-48 overflow-hidden">
                  <div
                    className="w-full h-full flex items-center justify-center text-white font-semibold transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--accent), var(--muted))",
                    }}
                  >
                    {work.title}
                  </div>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300" />

                  {/* Play/View overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-white"
                      style={{ backgroundColor: "var(--accent)" }}
                    >
                      {work.type === "visual" ? (
                        <Play size={16} />
                      ) : (
                        <ExternalLink size={16} />
                      )}
                      <span className="text-sm font-medium">
                        {work.type === "visual" ? "Watch Demo" : "View Project"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Work Info */}
                <div className="p-6">
                  <h3
                    className="text-xl font-semibold mb-2"
                    style={{ color: "var(--text)" }}
                  >
                    {work.title}
                  </h3>
                  <p
                    className="text-sm mb-4 line-clamp-2"
                    style={{ color: "var(--muted)" }}
                  >
                    {work.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
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

                  {/* Collaboration type */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: "var(--muted)" }}>
                      {work.collaboration_type === "solo"
                        ? "Solo Project"
                        : "Team Project"}
                    </span>
                    <ArrowRight
                      size={16}
                      style={{ color: "var(--accent)" }}
                      className="transform transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/works">
              <Button rightIcon={<ArrowRight size={16} />}>
                View All Works
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Games Preview Section */}
      <section className="px-6 py-16 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2
              className="text-3xl font-bold tracking-tight sm:text-4xl mb-4"
              style={{ color: "var(--text)" }}
            >
              Games We&apos;ve Created
            </h2>
            <p
              className="text-lg leading-8 max-w-2xl mx-auto"
              style={{ color: "var(--muted)" }}
            >
              Interactive experiences and games that combine creativity with
              technical innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {featuredGames.map((game: any) => (
              <div
                key={game.id}
                className="group relative overflow-hidden rounded-lg hover-lift transition-all duration-300 cursor-pointer"
                style={{
                  backgroundColor: "var(--card)",
                  boxShadow: "var(--shadow)",
                }}
              >
                {/* Game Cover */}
                <div className="relative h-40 overflow-hidden">
                  <div
                    className="w-full h-full flex items-center justify-center text-white font-medium transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--accent), var(--gaming-accent, var(--accent)))",
                    }}
                  >
                    {game.title}
                  </div>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300" />
                </div>

                {/* Game Info */}
                <div className="p-4">
                  <h3
                    className="font-semibold mb-1 text-sm"
                    style={{ color: "var(--text)" }}
                  >
                    {game.title}
                  </h3>
                  <p className="text-xs mb-2" style={{ color: "var(--muted)" }}>
                    {game.genre} • {game.platforms.join(", ")}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {game.tags.slice(0, 2).map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs rounded-full"
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
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/games">
              <Button variant="outline" rightIcon={<ArrowRight size={16} />}>
                Explore All Games
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
