/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["192.168.10.16", "localhost", "127.0.0.1"],
  distDir: process.env.NEXT_DIST_DIR || ".next",
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.piccle.ai",
          },
        ],
        destination: "https://hr.assesta.com/:path*",
        permanent: true,
        basePath: false,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "piccle.ai",
          },
        ],
        destination: "https://hr.assesta.com/:path*",
        permanent: true,
        basePath: false,
      },
    ]
  },
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
