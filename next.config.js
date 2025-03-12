/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",  // Ensures Vercel handles static pages properly
};

module.exports = nextConfig;
