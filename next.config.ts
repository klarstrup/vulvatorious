import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rewrites: () => [{ source: "/rider", destination: "/rider/index.html" }],
};

export default nextConfig;
