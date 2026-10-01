import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets e2e runs build into their own dir without touching `.next`
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
};

export default nextConfig;
