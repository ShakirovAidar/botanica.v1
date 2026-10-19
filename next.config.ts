import type { NextConfig } from "next";

// Keep Next's workspace root anchored to this app. A parent-level lockfile can
// otherwise make local dev resolve the wrong project and return 404 for `/`.
const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
