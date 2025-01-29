import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https', // Allows only HTTPS (recommended for security)
        hostname: '*', // Allows all domains
      },
      {
        protocol: 'http', // Allows HTTP as well, if needed
        hostname: '*',
      },
    ],
  },
};

export default nextConfig;
