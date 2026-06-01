/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['boya-shop.online'],
  },
};

module.exports = nextConfig;
