"use client";
import { usePrefersReducedMotion } from "@/lib/motion/use-reveal";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SplitTitle } from "./motion/SplitTitle";
export function ChapterTitle({
  title,
  label,
  description,
}: {
  title: string;
  label: string;
  description: string;
}) {
  return (
    <header className="chapter-heading">
      <p className="eyebrow">{label}</p>
      <SplitTitle as="h1" text={title} className="display-title" />
      <div className="chapter-intro">
        <span className="small-cross">✳</span>
        <p>{description}</p>
      </div>
    </header>
  );
}
export function EditorialImage({
  src,
  alt,
  className = "",
  priority = false,
  mobileSrc,
  sizes = "(max-width: 700px) 100vw, 70vw",
  quality = 90,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  mobileSrc?: string;
  sizes?: string;
  quality?: number;
}) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  return (
    <div ref={ref} className={`editorial-image ${className}`}>
      <motion.div className="image-inner" style={reduce ? undefined : { y }}>
        <picture>
          {mobileSrc && (
            <source media="(max-width: 700px)" srcSet={mobileSrc} />
          )}
          <Image
            src={failedSource === src ? "/media/image-unavailable.svg" : src}
            alt={failedSource === src ? `${alt} — image unavailable` : alt}
            onError={() => setFailedSource(src)}
            fill
            priority={priority}
            sizes={sizes}
            quality={quality}
            className="object-cover"
          />
        </picture>
      </motion.div>
    </div>
  );
}
export function TextLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="editorial-link">
      <span>{children}</span>
      <ArrowUpRight size={20} />
    </Link>
  );
}
