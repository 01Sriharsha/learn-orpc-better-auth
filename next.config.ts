import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "test-better-auth.t3.storageapi.dev",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
