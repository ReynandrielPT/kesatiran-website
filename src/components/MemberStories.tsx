"use client";

import { usePrefersReducedMotion } from "@/lib/motion/use-reveal";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import Link from "next/link";
import members from "@/data/members.json";
import { EditorialImage } from "./Editorial";

export function MemberStories() {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", (value) =>
    setActive(
      Math.min(
        members.length - 1,
        Math.max(0, Math.floor(value * members.length)),
      ),
    ),
  );
  const member = members[active];
  function goTo(index: number) {
    const section = ref.current;
    if (!section) return;
    const travel = section.offsetHeight - window.innerHeight;
    window.scrollTo({
      top:
        window.scrollY +
        section.getBoundingClientRect().top +
        travel * ((index + 0.2) / members.length),
      behavior: "smooth",
    });
  }
  if (reduced)
    return (
      <section
        ref={ref}
        className="member-static editorial-section"
        aria-label="Meet the circle"
      >
        <h2>Meet the circle.</h2>
        <div>
          {members.map((m) => (
            <Link href={`/profile/${m.slug}`} key={m.id}>
              <EditorialImage
                src={m.photo || m.avatar}
                alt={m.name}
                sizes="160px"
              />
              <h3>{m.name}</h3>
              <p>{m.role}</p>
            </Link>
          ))}
        </div>
      </section>
    );
  return (
    <section
      ref={ref}
      className="member-stories"
      style={{ height: `${100 + members.length * 55}svh` }}
      aria-label="Meet the circle"
    >
      <div className="member-stage">
        <div className="section-meta">
          <span className="eyebrow">Meet the circle</span>
          <span>Scroll to meet everyone ↓</span>
        </div>
        <div className="member-composition">
          <AnimatePresence initial={false} mode="wait">
            <motion.article
              className="member-slide"
              key={member.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: [0.215, 0.61, 0.355, 1] }}
            >
              <header className="member-headline">
                <p className="eyebrow">{member.role}</p>
                <h2>{member.name}</h2>
              </header>
              <motion.div
                className="member-photo"
                initial={{ clipPath: "inset(0 0 12% 0)", scale: 0.97 }}
                animate={{ clipPath: "inset(0)", scale: 1 }}
                transition={{ duration: 0.35 }}
              >
                <EditorialImage
                  src={member.photo || member.avatar}
                  alt={member.name}
                  sizes="(max-width:700px) 140px, 240px"
                  quality={95}
                />
              </motion.div>
              <div className="member-copy-stage">
                <p className="member-bio">
                  {member.bio_preview ||
                    member.bio_short ||
                    `Part of the circle. Exploring ${member.department.toLowerCase()}.`}
                </p>
                <p className="member-location">{member.institute}</p>
                <Link
                  href={`/profile/${member.slug}`}
                  className="editorial-link"
                >
                  Explore profile <span>↗</span>
                </Link>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
        <div className="member-controls">
          <span className="member-count">
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(members.length).padStart(2, "0")}
          </span>
          <div className="member-steps" aria-label="Choose a member">
            {members.map((m, i) => (
              <button
                key={m.id}
                onClick={() => goTo(i)}
                aria-label={`Meet ${m.name}`}
                aria-current={i === active ? "step" : undefined}
              >
                <span />
              </button>
            ))}
          </div>
          <Link href="/team">All members ↗</Link>
        </div>
      </div>
    </section>
  );
}
