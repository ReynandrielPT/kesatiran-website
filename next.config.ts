import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Allow production builds to succeed even if there are ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Ensure Turbopack resolves the workspace root to this project folder
  // This avoids serving static assets from an inferred parent directory
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
