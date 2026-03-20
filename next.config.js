/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['motion-dom', 'motion', 'motion-utils', 'framer-motion'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
}

module.exports = nextConfig
