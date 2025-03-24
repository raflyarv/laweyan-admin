/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '', // Add your port if necessary
        pathname: '/uploads/**', // Match your image path structure
      },
    ],
  },
};

export default nextConfig;

