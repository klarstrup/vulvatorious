import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    turbopackGc: true,
    turbopackLazyDynamicImports: true,
    turbopackPluginRuntimeStrategy: "workerThreads",
    agentUpgrade: "latest",
    turbopackRustReactCompiler: true,
  },
  rewrites: () => [{ source: "/rider", destination: "/rider/index.html" }],
};

export default nextConfig;
