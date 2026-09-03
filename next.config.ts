import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    const pageHeaders = [
      { key: "Referrer-Policy", value: "origin" },
      { key: "Cache-Control", value: "private, no-store, no-transform" },
    ];
    return [
      { source: "/", headers: pageHeaders },
      { source: "/signup", headers: pageHeaders },
      { source: "/login", headers: pageHeaders },
      { source: "/forgot-password", headers: pageHeaders },
      { source: "/reset-password", headers: pageHeaders },
      { source: "/verify-email", headers: pageHeaders },
      { source: "/accept-invite", headers: pageHeaders },
      { source: "/dashboard", headers: pageHeaders },
      { source: "/dashboard/:path*", headers: pageHeaders },
    ];
  },
};

export default nextConfig;
