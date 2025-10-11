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
  // Add this to force www
  async redirects() {
    return [
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "crockpot.app",
          },
        ],
        destination: "https://www.crockpot.app/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
