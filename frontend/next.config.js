/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standard Next.js configuration - no static export
  // This enables runtime API calls and dynamic content
  // Force Vercel to use latest configuration
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