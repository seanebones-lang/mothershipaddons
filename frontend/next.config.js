/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export to enable runtime API calls
  // output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://elca-ai-platform-api.onrender.com',
  },
}

module.exports = nextConfig