import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
  images: {
    remotePatterns: [new URL("https://img.clerk.com/**")],
  },
};

export default nextConfig;
