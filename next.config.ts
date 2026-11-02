import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const nextConfig = (phase: string): NextConfig => ({
  // Keep production builds from overwriting the running dev server artifacts.
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
  eslint: {
    // Allow production builds to succeed even if there are ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Ensure Turbopack resolves the workspace root to this project folder
  // This avoids serving static assets from an inferred parent directory
  turbopack: {
    root: __dirname,
  },
});

export default nextConfig;
