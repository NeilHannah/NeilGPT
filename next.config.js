
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com", // Replace with specific trusted domains
      },
      {
        protocol: "https",
        hostname: "cdn.example.com", // Add as needed
      },
    ],
  },
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  optimizeFonts: true,
  productionBrowserSourceMaps: false,
  output: "standalone", // Optimizes for serverless deployment
  experimental: {
    turbo: true, // Experimental feature for faster builds
  },
};

module.exports = nextConfig;
