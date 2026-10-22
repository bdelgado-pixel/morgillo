import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: { minimumCacheTTL: 60 },
  async redirects() {
    return [{ source: "/empresa", destination: "/", permanent: false }];
  },
};
export default nextConfig;