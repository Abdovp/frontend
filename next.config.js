/** @type {import('next').NextConfig} */
const apiProxyTarget =
  process.env.API_PROXY_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'https://api.boyashop.store';

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['boyashop.store'],
    formats: ['image/webp'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiProxyTarget.replace(/\/$/, '')}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
