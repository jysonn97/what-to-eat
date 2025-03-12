/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: "out", // Ensures Next.js knows where to output the build
  images: {
    unoptimized: true, // Helps avoid image optimization errors
  },
};

module.exports = nextConfig;
