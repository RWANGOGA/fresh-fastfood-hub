/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // This line prevents the "unconfigured qualities" error from your logs
    qualities: [75, 90], 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '', 
        pathname: '/**', 
      },
    ],
  },
};

export default nextConfig;