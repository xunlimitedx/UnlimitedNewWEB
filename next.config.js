/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: '*.uboss.co.za',
      },
      {
        protocol: 'https',
        hostname: 'uboss.co.za',
      },
      {
        protocol: 'https',
        hostname: '*.esquire.co.za',
      },
      {
        protocol: 'https',
        hostname: 'esquire.co.za',
      },
    ],
  },
  async redirects() {
    return [];
  },
};

module.exports = nextConfig;
