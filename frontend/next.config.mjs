/** @type {import('next').NextConfig} */
const nextConfig = {
 experimental: {
    optimizeCss: false, // ⚠️ disable until lightningcss works
  },
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
