/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
      optimizeCss: false, // disable CSS optimization to prevent lightningcss errors on Vercel
    },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // allows any hostname
      },
    ],
  },
};
export default nextConfig;
