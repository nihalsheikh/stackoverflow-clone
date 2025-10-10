import type { NextConfig } from "next";

const withMDX = require("@next/mdx")();

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    mdxRs: true,
  },

  serverExternalPackages: ["mongoose"],
};

export default withMDX(nextConfig);
