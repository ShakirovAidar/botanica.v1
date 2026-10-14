import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        // Serve the original booking app at / without a browser redirect.
        { source: "/", destination: "/legacy.html" }
      ],
      afterFiles: [],
      fallback: []
    };
  }
};

export default nextConfig;
