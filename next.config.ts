import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    qualities: [25, 50, 75, 85, 100],
  },
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/your-crockpot",
        has: [
          {
            type: "cookie",
            key: "authjs.session-token",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
