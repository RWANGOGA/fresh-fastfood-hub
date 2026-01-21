// next.config.mjs (preferred for ES modules)
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',          // optional, leave empty
        pathname: '/**',   // allow all paths under this domain
      },
      // Optional: Add more hosts if you use other CDNs later
      // { protocol: 'https', hostname: 'example.com', pathname: '/**' },
    ],
  },
};

export default nextConfig;