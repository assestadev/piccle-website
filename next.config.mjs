/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["192.168.10.16", "localhost", "127.0.0.1"],
  distDir: process.env.NEXT_DIST_DIR || ".next",
  turbopack: {
    root: process.cwd(),
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.assesta.com",
      },
    ],
  },
}

export default nextConfig
