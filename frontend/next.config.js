/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standard Next.js deployment - dynamic dashboard needs API access
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://elca-blockbusters-api.onrender.com',
  },
}

module.exports = nextConfig