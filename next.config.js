/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    esmExternals: 'loose',
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    domains: ['lh3.googleusercontent.com', 'firebasestorage.googleapis.com'],
  },
};
