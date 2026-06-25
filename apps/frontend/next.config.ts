import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.BASE_URL ?? "",
  },
  experimental: {
    optimizePackageImports: [
      "@clerk/nextjs",
      "@clerk/localizations",
      "@clerk/backend",
      "lucide-react",
      "@radix-ui/react-avatar",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-dialog",
      "@radix-ui/react-popover",
      "@radix-ui/react-separator",
      "@radix-ui/react-tooltip",
    ],
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

if (!process.env.VITEST && !process.env.STORYBOOK) {
  initOpenNextCloudflareForDev();
}
