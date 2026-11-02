"use client";
import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
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
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  return (
    <div ref={ref} className={`editorial-image ${className}`}>
      <motion.div className="image-inner" style={reduce ? undefined : { y }}>
        <Image
          src={failedSource === src ? "/media/image-unavailable.svg" : src}
          alt={failedSource === src ? `${alt} — image unavailable` : alt}
          onError={() => setFailedSource(src)}
          fill
          priority={priority}
          sizes="(max-width: 700px) 100vw, 70vw"
          className="object-cover"
        />
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
