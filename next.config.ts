import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow GitHub avatar CDN
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  // Silence optional mysql2 import warnings in environments without DB
  serverExternalPackages: ["mysql2"],
};

export default nextConfig;
