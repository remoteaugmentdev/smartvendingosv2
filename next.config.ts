import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pg"],
  devIndicators: false,
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
