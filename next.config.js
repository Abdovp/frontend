/** @type {import('next').NextConfig} */
const normalizeApiProxyTarget = (value) => {
  if (!value) return 'https://api.boyashop.store';

  const trimmed = value.trim();
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  return withProtocol.replace(/\/$/, '');
};

const apiProxyTarget = normalizeApiProxyTarget(
  process.env.API_PROXY_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'https://api.boyashop.store'
);

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  compress: true, // Enable gzip compression
  poweredByHeader: false, // Remove X-Powered-By header
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
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  async redirects() {
    return [
      {
        source: '/products/:slug',
        destination: '/product/:slug',
        permanent: true,
      },
      {
        source: '/car-charger',
        destination: '/product/car-charger',
        permanent: true,
      },
      {
        source: '/pack',
        destination: '/product/pack',
        permanent: true,
      },
      {
        source: '/magnetic-holder',
        destination: '/product/magnetic-holder',
        permanent: true,
      },
      {
        source: '/car-vacuum',
        destination: '/product/car-vacuum',
        permanent: true,
      },
      {
        source: '/garden-sprinkler',
        destination: '/product/garden-sprinkler',
        permanent: true,
      },
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
