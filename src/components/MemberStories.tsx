"use client";

import { usePrefersReducedMotion } from "@/lib/motion/use-reveal";

import { useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import members from "@/data/members.json";
import { EditorialImage } from "./Editorial";

export function MemberStories() {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(
      members.length - 1,
      Math.max(0, Math.floor(value * members.length)),
    );
    if (next !== activeRef.current) {
      activeRef.current = next;
      setActive(next);
    }
  });
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
          <article className="member-slide">
            <header className="member-headline" key={`heading-${member.id}`}>
              <p className="eyebrow">{member.role}</p>
              <h2>{member.name}</h2>
            </header>
            <div className="member-depth-scene">
              <div
                className="member-orbit member-orbit-one"
                aria-hidden="true"
              />
              <div
                className="member-orbit member-orbit-two"
                aria-hidden="true"
              />
              <div className="member-card-stack">
                <div
                  className="member-backplate member-backplate-far"
                  aria-hidden="true"
                />
                <div
                  className="member-backplate member-backplate-near"
                  aria-hidden="true"
                />
                {members.map((m, i) => (
                  <div
                    key={m.id}
                    className="member-depth-card"
                    data-active={i === active}
                    aria-hidden={i !== active}
                  >
                    <Image
                      src={m.photo}
                      alt={i === active ? m.name : ""}
                      fill
                      sizes="(max-width:700px) 140px, 240px"
                      quality={85}
                      loading="lazy"
                    />
                    <span className="member-card-edge" aria-hidden="true" />
                    <span className="member-card-label" aria-hidden="true">
                      KESATIRAN / {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                ))}
              </div>
              <span className="member-depth-caption" aria-hidden="true">
                Independent minds. Shared orbit.
              </span>
            </div>
            <div className="member-copy-stage" key={`copy-${member.id}`}>
              <p className="member-bio">
                {member.bio_preview ||
                  member.bio_short ||
                  `Part of the circle. Exploring ${member.department.toLowerCase()}.`}
              </p>
              <p className="member-location">{member.institute}</p>
              <Link href={`/profile/${member.slug}`} className="editorial-link">
                Explore profile <span>↗</span>
              </Link>
            </div>
          </article>
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
