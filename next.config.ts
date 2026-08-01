import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Team crests, press-kit photography, and player headshots will come
    // from external sources (leagues, official press kits) rather than
    // being stored in this repo. Add each source's hostname here as we
    // wire up real data — e.g. canpl.ca, thenorthernsuperleague.ca, etc.
    remotePatterns: [],
  },
};

export default nextConfig;
