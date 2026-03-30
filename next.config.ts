import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.12.22', '192.168.12.*', 'localhost'],
};

export default nextConfig;
