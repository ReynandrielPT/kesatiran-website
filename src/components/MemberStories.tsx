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
                src={m.avatar || m.photo}
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
          <div className="member-photo-stage">
            <AnimatePresence initial={false} mode="sync">
              <motion.div
                className="member-photo"
                key={member.id}
                initial={{ opacity: 0, y: 25, scale: 0.96, rotate: 2 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, y: -20, scale: 0.98, rotate: -2 }}
                transition={{ duration: 0.3, ease: [0.215, 0.61, 0.355, 1] }}
              >
                <EditorialImage
                  src={member.photo || member.avatar}
                  alt={member.name}
                  sizes="(max-width:700px) 180px, 320px"
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="member-copy-stage">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.16 }}
              >
                <p className="eyebrow">{member.role}</p>
                <h2>{member.name}</h2>
                <p className="member-bio">
                  {member.bio_short ||
                    `Part of the circle. Exploring ${member.department.toLowerCase()}.`}
                </p>
                <p className="member-location">{member.institute}</p>
                <Link
                  href={`/profile/${member.slug}`}
                  className="editorial-link"
                >
                  Get to know {member.name.split(" ")[0]} <span>↗</span>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
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
