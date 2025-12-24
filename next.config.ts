import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['bcryptjs', '@neondatabase/serverless', 'drizzle-orm'],
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs', '@neondatabase/serverless', 'drizzle-orm'],
  },
};

export default nextConfig;
