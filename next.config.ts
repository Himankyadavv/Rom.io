// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Add the allowed domains for external images here
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      // Add other external image domains if you use them, e.g.:
      // {
      //   protocol: 'https',
      //   hostname: 'example.com',
      //   port: '',
      //   pathname: '/my-images/**',
      // },
    ],
  },
};

module.exports = nextConfig;
