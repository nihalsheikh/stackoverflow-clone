import type { NextConfig } from "next";

const withMDX = require("@next/mdx")();

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    mdxRs: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  serverExternalPackages: ["mongoose"],

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*" },
      { protocol: "http", hostname: "*" },
    ],
  },
};

export default withMDX(nextConfig);
