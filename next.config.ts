import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // This one is for our mock data images
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      // This one is for our live Firebase Storage images
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      // THIS IS THE NEW ONE FOR THE LOCAL EMULATOR
      {
        protocol: "http",
        hostname: "localhost",
        port: "9199",
        pathname: "/v0/b/rentify-kenya.appspot.com/o/**",
      },
    ],
  },
};

export default nextConfig;
