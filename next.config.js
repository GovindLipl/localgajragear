const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://111.118.252.246:4001/api/:path*',
      },
    ]
  },
  publicRuntimeConfig: {
    staticFolder: '/static',
  },
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://111.118.252.246:4001',
    IMAGE_URL: process.env.IMAGE_URL || '/',
  },
}
module.exports = nextConfig
