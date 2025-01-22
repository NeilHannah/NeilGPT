
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  optimizeFonts: true,
  productionBrowserSourceMaps: false
};

module.exports = nextConfig;
