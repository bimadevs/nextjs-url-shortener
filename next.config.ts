import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Nonaktifkan ESLint saat build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
