"use client";

import React, { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface RevealOnScrollProps {
  children: React.ReactNode;
  delay?: number; // Delay in seconds
  className?: string;
  variants?: {
    hidden: { opacity: number; y?: number };
    visible: { opacity: number; y?: number };
  };
}

const defaultVariants = {
  hidden: { opacity: 0, y: 75 },
  visible: { opacity: 1, y: 0 },
};

const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  delay = 0,
  className,
  variants = defaultVariants,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 }); // Increased amount to 0.5

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ duration: 0.5, delay: delay }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
};

export default RevealOnScroll;
