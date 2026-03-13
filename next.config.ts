import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow transpiling @react-three packages
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
};

export default nextConfig;
