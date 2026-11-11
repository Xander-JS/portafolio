import type { NextConfig } from "next";

if (process.env.VERCEL === "1") {
  const missing = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"].filter(
    (name) => !process.env[name]?.trim(),
  );
  if (missing.length) {
    throw new Error(
      `Reaction wall: missing ${missing.join(", ")}. Configure them in Vercel for this deployment environment and redeploy.`,
    );
  }
}

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
    // Load only the icon modules actually used instead of the whole barrel (lucide-react is already
    // optimized by default in Next 16; simple-icons is not, so it's listed here).
    optimizePackageImports: ["simple-icons"],
  },
  // Serve modern, smaller image formats from the built-in optimizer.
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/projects/dj-ai-web",
        destination: "/projects/dj-ai",
        permanent: true,
      },
    ];
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
