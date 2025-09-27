"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Users, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import membersData from "@/data/members.json";
import { RawMember, MemberCard } from "@/components/MemberCard";
import RevealOnScroll from "@/components/RevealOnScroll";
import type { ComponentProps } from "react";

interface Skill {
  name: string;
  category: string;
  level: string;
}

type ImgProps = ComponentProps<typeof Image> & { src: string };
function FallbackImage({ src, alt, ...rest }: ImgProps) {
  const [s, setS] = useState<string>(src || "/vercel.svg");
  useEffect(() => {
    setS(src || "/vercel.svg");
  }, [src]);
  return (
    <Image {...rest} alt={alt} src={s} onError={() => setS("/vercel.svg")} />
  );
}

// FIX 2: Explicitly type the imported JSON data.
// This tells TypeScript to treat the data as an array of 'RawMember', resolving all type errors.
const members: RawMember[] = membersData;

export default function TeamPage() {
  // Casual tag filter: use role words + departments reduced to a simple set
  const [activeTag, setActiveTag] = useState<string>("all");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartTime = useRef<number | null>(null);
  // Mobile carousel state for smooth infinite loop (1 card per view)
  const [posIndex, setPosIndex] = useState<number>(1); // position within extended slides (with clones)
  const [enableTransition, setEnableTransition] = useState<boolean>(true);
  const [animating, setAnimating] = useState<boolean>(false);
  const trackRef = useRef<HTMLDivElement | null>(null);

  // Desktop spotlight carousel: revolving center-focused display
  const desktopViewportRef = useRef<HTMLDivElement | null>(null);
  const desktopTrackRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [currentSpotlight, setCurrentSpotlight] = useState<number>(0); // logical index 0..total-1
  const autoAdvanceRef = useRef<NodeJS.Timeout | null>(null);
  const [slideInterval] = useState<number>(4000); // 4 seconds per slide
  // position within extendedMembers (with clones): 0..total+1, where 1..total are real
  const [deskPos, setDeskPos] = useState<number>(1);
  const [deskTransition, setDeskTransition] = useState<boolean>(true);
  const [deskAnimating, setDeskAnimating] = useState<boolean>(false);
  const [deskStride, setDeskStride] = useState<number>(0);
  const [deskBase, setDeskBase] = useState<number>(0);
  const [deskOffset, setDeskOffset] = useState<number>(0);
  const [deskReady, setDeskReady] = useState<boolean>(false);
  const queuedStepsRef = useRef<number>(0);
  const queuedDirRef = useRef<1 | -1 | 0>(0);
  const [overrideTransform, setOverrideTransform] = useState<string | null>(
    null
  );
  // (audio playback removed as requested)
  // Build casual tags from department/role for simple filtering
  const tags = useMemo(() => {
    const base = new Set<string>();
    members.forEach((m) => {
      if (m.department) base.add(m.department.toLowerCase());
      m.role
        .split(/[,/]|and|&/i)
        .map((r: string) => r.trim().toLowerCase())
        .filter(Boolean)
        .forEach((r: string) => base.add(r));
    });
    return Array.from(base).slice(0, 10); // keep it small
  }, []);

  // FIX 4: Use the typed 'members' array and remove the redundant type annotation.
  const filtered = members.filter((m) => {
    if (activeTag === "all") return true;
    const haystack = [m.department, m.role].join(" ").toLowerCase();
    return haystack.includes(activeTag);
  });

  const total = filtered.length;

  // Extended member list for seamless revolving (add clones at ends)
  const extendedMembers = useMemo(() => {
    if (total <= 1) return filtered;
    // Add one member at each end for smooth transitions
    const prev = filtered[total - 1];
    const next = filtered[0];
    return [prev, ...filtered, next];
  }, [filtered, total]);

  const extended = useMemo(() => {
    if (total > 1) {
      const first = filtered[0];
      const last = filtered[total - 1];
      return [last, ...filtered, first];
    }
    return filtered;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, activeTag]);

  // Reset carousel position when the active filter changes or the list size changes
  useEffect(() => {
    setCurrentIndex(0);
    setEnableTransition(false);
    setPosIndex(total > 1 ? 1 : 0);
    const id = requestAnimationFrame(() => setEnableTransition(true));
    return () => cancelAnimationFrame(id);
  }, [activeTag, total]);

  // Reset spotlight and deskPos when list changes
  useEffect(() => {
    setCurrentSpotlight(0);
    setDeskTransition(false);
    setDeskPos(total > 0 ? 1 : 0);
    const id = requestAnimationFrame(() => setDeskTransition(true));
    return () => cancelAnimationFrame(id);
  }, [activeTag, total]);

  // Auto-advance spotlight
  useEffect(() => {
    if (isHovered || total <= 1) {
      if (autoAdvanceRef.current) {
        clearInterval(autoAdvanceRef.current);
        autoAdvanceRef.current = null;
      }
      return;
    }

    autoAdvanceRef.current = setInterval(() => {
      // advance via deskPos to keep clones logic consistent
      setDeskPos((p) => p + 1);
    }, slideInterval);

    return () => {
      if (autoAdvanceRef.current) {
        clearInterval(autoAdvanceRef.current);
        autoAdvanceRef.current = null;
      }
    };
  }, [isHovered, total, slideInterval]);

  // Keep logical spotlight index in sync with deskPos (convert from extended index)
  useEffect(() => {
    if (total <= 0) return;
    const logical = (((deskPos - 1) % total) + total) % total; // 1->0, 2->1, ..., total->total-1
    setCurrentSpotlight(logical);
  }, [deskPos, total]);

  // Measure stride and base offset to center the active card
  useEffect(() => {
    const track = desktopTrackRef.current;
    const viewport = desktopViewportRef.current;
    if (!track || !viewport) return;

    // Hide track until measurement is ready to avoid initial left alignment flicker
    setDeskReady(false);

    const measure = () => {
      const children = Array.from(track.children) as HTMLElement[];
      const expected = extendedMembers.length;
      // For multi-item (with clones), wait until we have at least 3 elements (left clone + first + second)
      if (total > 1 && children.length < Math.min(3, expected)) {
        return;
      }
      // For single item, require at least 1
      if (total <= 1 && children.length < 1) {
        return;
      }
      const trackRect = track.getBoundingClientRect();
      const viewportRect = viewport.getBoundingClientRect();
      // choose two adjacent real items: index 1 and 2 (skip left clone at 0)
      if (total > 1 && children.length >= 3) {
        const a = children[1].getBoundingClientRect();
        const b = children[2].getBoundingClientRect();
        const strideRaw = Math.abs(b.left - a.left);
        const stride = strideRaw > 0 ? strideRaw : a.width;
        // compute base relative to track left so that selected card centers in viewport
        const base =
          viewportRect.left +
          viewportRect.width / 2 -
          a.width / 2 -
          trackRect.left;
        const offset = a.left - trackRect.left;
        setDeskStride(Math.round(stride));
        setDeskBase(Math.round(base));
        setDeskOffset(Math.round(offset));
        setDeskReady(true);
      } else if (children.length >= 1) {
        const a = children[0].getBoundingClientRect();
        const base =
          viewportRect.left +
          viewportRect.width / 2 -
          a.width / 2 -
          trackRect.left;
        const offset = a.left - trackRect.left;
        setDeskStride(Math.round(a.width));
        setDeskBase(Math.round(base));
        setDeskOffset(Math.round(offset));
        setDeskReady(true);
      }
    };

    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(track);
    ro.observe(viewport);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [extendedMembers.length]);

  // Keep currentIndex (for indicators/mobile) in sync with posIndex on mobile
  useEffect(() => {
    if (total <= 1) return;
    const normalized = (((posIndex - 1) % total) + total) % total;
    setCurrentIndex(normalized);
  }, [posIndex, total]);

  // Keyboard navigation: mobile carousel + desktop spotlight
  useEffect(() => {
    if (total <= 1) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        next();
        nextSpotlight();
      } else if (e.key === "ArrowLeft") {
        prev();
        prevSpotlight();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  // Mobile carousel actions
  const next = () => {
    if (animating || total <= 1) return;
    setAnimating(true);
    setEnableTransition(true);
    setPosIndex((p) => p + 1);
  };
  const prev = () => {
    if (animating || total <= 1) return;
    setAnimating(true);
    setEnableTransition(true);
    setPosIndex((p) => p - 1);
  };

  // Desktop spotlight actions
  const nextSpotlight = () => {
    if (deskAnimating || total <= 1) return;
    setDeskAnimating(true);
    setDeskTransition(true);
    setDeskPos((p) => p + 1);
  };
  const prevSpotlight = () => {
    if (deskAnimating || total <= 1) return;
    setDeskAnimating(true);
    setDeskTransition(true);
    setDeskPos((p) => p - 1);
  };

  // Jump to a specific spotlight index using the shortest cyclic path
  const goToSpotlight = (targetIndex: number) => {
    if (deskAnimating || total <= 1) return;
    const desiredPos = targetIndex + 1; // 1..total
    const currentPos =
      deskPos === 0 ? total : deskPos === total + 1 ? 1 : deskPos; // normalize to 1..total
    if (desiredPos === currentPos) return;
    const forward = (desiredPos - currentPos + total) % total; // steps to the right
    const backward = (currentPos - desiredPos + total) % total; // steps to the left
    setDeskAnimating(true);
    setDeskTransition(true);
    if (forward <= backward) {
      // forward move
      const maxPos = total + 1; // right clone index
      const tentative = currentPos + forward;
      if (tentative <= total) {
        // within real range
        setDeskPos(tentative);
      } else if (tentative === maxPos) {
        // lands exactly on right clone; onTransitionEnd will snap to 1
        queuedStepsRef.current = 0;
        queuedDirRef.current = 0;
        setDeskPos(maxPos);
      } else {
        // overshoots beyond right clone: go to clone first, then continue remaining
        const stepsToClone = maxPos - currentPos; // >=1
        const remain = forward - stepsToClone;
        queuedStepsRef.current = remain;
        queuedDirRef.current = 1;
        setDeskPos(maxPos);
      }
    } else {
      // backward move
      const minPos = 0; // left clone index
      const tentative = currentPos - backward;
      if (tentative >= 1) {
        setDeskPos(tentative);
      } else if (tentative === minPos) {
        queuedStepsRef.current = 0;
        queuedDirRef.current = 0;
        setDeskPos(minPos);
      } else {
        const stepsToClone = currentPos - 0; // distance to left clone: currentPos - 0
        const remain = backward - stepsToClone;
        queuedStepsRef.current = remain;
        queuedDirRef.current = -1;
        setDeskPos(minPos);
      }
    }
  };

  const currentCenteredMember = filtered[total > 0 ? currentSpotlight : 0];

  return (
    <div className="min-h-screen pb-24 space-y-20">
      {/* audio playback removed */}
      {/* Warm Intro */}
      <section className="pt-50 px-6 mx-auto max-w-6xl">
        <div className="space-y-8">
          <RevealOnScroll delay={0}>
            <div className="flex items-center gap-2 text-sm font-medium text-accent">
              <Sparkles size={16} /> OUR LITTLE CIRCLE
            </div>
          </RevealOnScroll>
          <div className="max-w-3xl space-y-4">
            <RevealOnScroll delay={0.1}>
              <h1 className="text-4xl sm:text-5xl font-semibold leading-tight tracking-tighter text-heading">
                People behind the tiny things
              </h1>
            </RevealOnScroll>
            <RevealOnScroll delay={0.2}>
              <p className="text-base sm:text-lg text-muted-foreground">
                Not a formal org chart—just friends building and doodling on the
                internet while sharing music links, snack pics and half-finished
                ideas.
              </p>
            </RevealOnScroll>
            <RevealOnScroll delay={0.3}>
              <p className="text-sm text-muted-foreground">Total members: 7</p>
            </RevealOnScroll>
          </div>
          {/* Avatar strip */}
          <RevealOnScroll delay={0.4}>
            <div className="flex -space-x-4 overflow-hidden pt-4">
              {/* FIX 5: Use 'members' array and remove incorrect type annotation. */}
              {members.slice(0, 12).map((m) => (
                <Link
                  key={m.id}
                  href={`/profile/${m.slug}`}
                  className="relative inline-block h-14 w-14 rounded-full ring-2 ring-background hover:z-20 transition-transform hover:scale-110"
                >
                  <FallbackImage
                    src={m.avatar || m.photo || "/vercel.svg"}
                    alt={m.name}
                    fill
                    sizes="56px"
                    className="object-cover rounded-full"
                  />
                </Link>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Simple tag filters */}
      <RevealOnScroll delay={0.5}>
        <section className="px-6 mx-auto max-w-6xl space-y-6">
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
        </section>
      </RevealOnScroll>

      {/* Member Carousel Gallery */}
      <section className="px-6 mx-auto max-w-6xl">
        {filtered.length === 0 ? (
          <RevealOnScroll delay={0}>
            <div className="text-center py-24 text-sm opacity-60">
              nobody under that tag right now
            </div>
          </RevealOnScroll>
        ) : (
          <div className="relative">
            {/* Desktop Spotlight Carousel (revolving center focus) */}
            <div className="hidden lg:block">
              <div
                ref={desktopViewportRef}
                className="relative overflow-hidden py-8"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {/* Navigation arrows */}
                {total > 1 && (
                  <>
                    <button
                      onClick={prevSpotlight}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card border border-border backdrop-blur-sm rounded-full p-3 text-foreground hover:text-accent transition-all shadow-lg z-20"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextSpotlight}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card border border-border backdrop-blur-sm rounded-full p-3 text-foreground hover:text-accent transition-all shadow-lg z-20"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                <div
                  ref={desktopTrackRef}
                  className="flex items-stretch justify-center gap-8 px-8"
                  style={{
                    transform: deskReady
                      ? overrideTransform ??
                        `translateX(${Math.round(
                          deskBase -
                            (deskOffset +
                              (total > 1 ? deskStride * (deskPos - 1) : 0))
                        )}px)`
                      : "none",
                    transition: deskTransition
                      ? "transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1)"
                      : "none",
                    willChange: "transform",
                    opacity: deskReady ? 1 : 0,
                  }}
                  onTransitionEnd={() => {
                    if (total <= 1) return;
                    // Seamless snap when crossing clones, and continue queued steps if any
                    if (deskPos === total + 1) {
                      // moved onto the right clone => snap to real first (index 1)
                      // freeze current transform to avoid visible jump
                      const t = desktopTrackRef.current?.style.transform;
                      if (t) setOverrideTransform(t);
                      setDeskTransition(false);
                      setDeskPos(1);
                      requestAnimationFrame(() => {
                        // Clear freeze with transitions still off so no visual jump
                        setOverrideTransform(null);
                        requestAnimationFrame(() => {
                          // Now re-enable and optionally continue queued steps
                          setDeskTransition(true);
                          const remain = queuedStepsRef.current;
                          const dir = queuedDirRef.current;
                          if (remain > 0 && dir === 1) {
                            queuedStepsRef.current = 0;
                            queuedDirRef.current = 0;
                            setDeskPos((p) => p + remain);
                          } else {
                            // release lock if nothing queued
                            setTimeout(() => setDeskAnimating(false), 10);
                          }
                        });
                      });
                      return;
                    } else if (deskPos === 0) {
                      // moved onto the left clone => snap to real last (index total)
                      const t = desktopTrackRef.current?.style.transform;
                      if (t) setOverrideTransform(t);
                      setDeskTransition(false);
                      setDeskPos(total);
                      requestAnimationFrame(() => {
                        setOverrideTransform(null);
                        requestAnimationFrame(() => {
                          setDeskTransition(true);
                          const remain = queuedStepsRef.current;
                          const dir = queuedDirRef.current;
                          if (remain > 0 && dir === -1) {
                            queuedStepsRef.current = 0;
                            queuedDirRef.current = 0;
                            setDeskPos((p) => p - remain);
                          } else {
                            setTimeout(() => setDeskAnimating(false), 10);
                          }
                        });
                      });
                      return;
                    }
                    // If no snap and no queued continuation, end animation
                    if (queuedStepsRef.current === 0) {
                      setTimeout(() => setDeskAnimating(false), 10);
                    }
                  }}
                >
                  {extendedMembers.map((member, index) => {
                    // Calculate position relative to spotlight
                    const actualIndex = total <= 1 ? 0 : index - 1; // adjust for clone at start
                    const isCenter = actualIndex === currentSpotlight;
                    const isAdjacent =
                      Math.abs(actualIndex - currentSpotlight) === 1 ||
                      (currentSpotlight === 0 && actualIndex === total - 1) ||
                      (currentSpotlight === total - 1 && actualIndex === 0);

                    return (
                      <div
                        key={`${member.id}-${index}`}
                        className="flex-shrink-0 w-[20rem] transition-all duration-700"
                        style={{
                          opacity: isCenter ? 1 : isAdjacent ? 0.4 : 0.1,
                        }}
                      >
                        <div
                          className="transition-transform duration-700"
                          style={{
                            transform: `scale(${isCenter ? 1.1 : 0.85})`,
                            filter: isCenter ? "none" : "grayscale(30%)",
                            transformOrigin: "center",
                          }}
                        >
                          <Link
                            href={`/profile/${member.slug}`}
                            className="group block"
                          >
                            <MemberCard
                              member={member}
                              compact={false}
                              showSkills={isCenter}
                              className={`w-[20rem] h-[26rem] transition-all duration-500 ${
                                isCenter
                                  ? "hover:scale-[1.05] shadow-2xl"
                                  : "hover:scale-[0.9] hover:opacity-60"
                              }`}
                            />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Spotlight indicators */}
                {total > 1 && (
                  <div className="flex justify-center mt-6 gap-2">
                    {filtered.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSpotlight(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentSpotlight
                            ? "bg-accent w-8"
                            : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Auto-advance indicator */}
                {isHovered && total > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-muted-foreground z-20">
                    Spotlight paused • Move cursor away to resume
                  </div>
                )}
              </div>
            </div>

            {/* Mobile/Tablet Carousel */}
            <div className="lg:hidden">
              <div
                className="relative overflow-hidden"
                onTouchStart={(e) => {
                  touchStartX.current = e.touches[0]?.clientX ?? null;
                  touchStartTime.current = Date.now();
                }}
                onTouchEnd={(e) => {
                  if (
                    touchStartX.current == null ||
                    touchStartTime.current == null
                  )
                    return;
                  const endX =
                    e.changedTouches[0]?.clientX ?? touchStartX.current;
                  const dx = endX - touchStartX.current;
                  const dt = Date.now() - touchStartTime.current;
                  const threshold = 40; // px
                  const maxTime = 600; // ms
                  if (dt < maxTime && Math.abs(dx) > threshold) {
                    if (dx < 0) next();
                    else prev();
                  }
                  touchStartX.current = null;
                  touchStartTime.current = null;
                }}
              >
                {/* Left fade overlay */}
                <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                {/* Right fade overlay */}
                <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                <div
                  ref={trackRef}
                  className="flex py-4"
                  style={{
                    width: `${extended.length * 100}%`,
                    transform: `translateX(-${
                      (posIndex * 100) / Math.max(extended.length, 1)
                    }%)`,
                    transition: enableTransition
                      ? "transform 380ms ease"
                      : "none",
                  }}
                  onTransitionEnd={() => {
                    if (total <= 1) return;
                    // Seamless snap when crossing clones
                    if (posIndex === extended.length - 1) {
                      // moved onto the cloned first => snap to real first (index 1)
                      setEnableTransition(false);
                      setPosIndex(1);
                      requestAnimationFrame(() => setEnableTransition(true));
                    } else if (posIndex === 0) {
                      // moved onto the cloned last => snap to real last (index total)
                      setEnableTransition(false);
                      setPosIndex(total);
                      requestAnimationFrame(() => setEnableTransition(true));
                    }
                    // end animation lock a tick later to avoid rapid double taps
                    setTimeout(() => setAnimating(false), 10);
                  }}
                >
                  {extended.map((m, i) => (
                    <div
                      key={`${m.id}-${i}`}
                      className="flex-shrink-0 flex justify-center px-3"
                      style={{
                        width: `${100 / Math.max(extended.length, 1)}%`,
                      }}
                    >
                      <RevealOnScroll delay={0}>
                        <Link
                          href={`/profile/${m.slug}`}
                          className="group block"
                        >
                          <Card className="p-6 flex flex-col gap-4 w-72 h-96 bg-secondary border border-border hover:border-accent/40 transition-all duration-300">
                            <div className="relative aspect-video rounded-xl overflow-hidden">
                              <FallbackImage
                                src={m.avatar || m.photo || "/vercel.svg"}
                                alt={m.name}
                                fill
                                sizes="280px"
                                className="object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <div className="flex flex-col gap-3 text-center">
                              <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                                {m.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {m.role}
                              </p>
                              <p className="text-xs text-muted-foreground line-clamp-4 leading-relaxed">
                                {m.bio_short}
                              </p>
                              <div className="flex flex-wrap gap-1 justify-center">
                                {m.skills?.slice(0, 4).map((s: Skill) => (
                                  <Badge
                                    key={s.name}
                                    size="xs"
                                    variant="secondary"
                                  >
                                    {s.name}
                                  </Badge>
                                ))}
                                {m.skills && m.skills.length > 4 && (
                                  <Badge size="xs" variant="outline">
                                    +{m.skills.length - 4}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </Card>
                        </Link>
                      </RevealOnScroll>
                    </div>
                  ))}
                </div>

                {/* Carousel Controls */}
                {total > 1 && (
                  <>
                    <button
                      onClick={prev}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card border border-border backdrop-blur-sm rounded-full p-3 text-foreground hover:text-accent transition-all shadow-lg z-20"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={next}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card border border-border backdrop-blur-sm rounded-full p-3 text-foreground hover:text-accent transition-all shadow-lg z-20"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Indicators */}
                {total > 1 && (
                  <div className="flex justify-center mt-6 gap-2">
                    {filtered.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (animating) return;
                          setAnimating(true);
                          setEnableTransition(true);
                          // indicator maps to logical index; translate to position index
                          setPosIndex(index + 1);
                        }}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentIndex
                            ? "bg-accent w-8"
                            : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Friendly footer blurb inside page (main site footer can still exist) */}
      <section className="px-6 mx-auto max-w-6xl pt-10">
        <div className="rounded-2xl p-8 bg-[color-mix(in_srgb,var(--foreground)_4%,transparent)] ring-1 ring-[color-mix(in_srgb,var(--foreground)_10%,transparent)] flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <RevealOnScroll delay={0}>
            <div className="flex-1 space-y-2">
              <h2 className="text-base font-semibold flex items-center gap-2">
                <Users size={16} /> circle energy
              </h2>
              <p className="text-[12px] opacity-70 leading-relaxed max-w-md">
                {/* FIX 7: Escaped the apostrophe to resolve the ESLint error. */}
                we cheer for each other&apos;s half-finished stuff & random
                ideas. profiles are just snapshots; ask us what we&apos;re
                poking at now.
              </p>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <Link href="/">
              <Button variant="outline" size="sm" pill>
                back home
              </Button>
            </Link>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}
