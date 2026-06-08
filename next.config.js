/** @type {import('next').NextConfig} */
const apiProxyTarget =
  process.env.API_PROXY_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'https://api.boyashop.store';

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'boyashop.store',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.boyashop.store',
        pathname: '/**',
      },
    ],
    formats: ['image/webp'],
  },
  async redirects() {
    return [
      {
        source: '/images/pack.png',
        destination: '/images/pack.webp',
        permanent: true,
      },
      {
        source: '/images/magnetic-holder.png',
        destination: '/images/magnetic-holder.webp',
        permanent: true,
      },
    ];
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
