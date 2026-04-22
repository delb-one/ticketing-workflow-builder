/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['vm-7e0k5ab1vqyshab2dubjwx9s.vusercontent.net'],
}

export default nextConfig
