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
  async redirects() {
    return [
      {
        source: "/webinar/team-discovery/complete",
        destination: "/semina/w01/complete",
        permanent: true,
      },
      {
        source: "/webinar/cpi-fit-talent/complete",
        destination: "/semina/w02/complete",
        permanent: true,
      },
      {
        source: "/webinar/team-discovery",
        destination: "/semina/w01",
        permanent: true,
      },
      {
        source: "/webinar/cpi-fit-talent",
        destination: "/semina/w02",
        permanent: true,
      },
      {
        source: "/webinar",
        destination: "/semina",
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
