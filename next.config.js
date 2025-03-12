/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true
}

module.exports = nextConfig;
module.exports = {
  distDir: "out", // Tells Next.js where to output the build
  images: {
    unoptimized: true, // Helps avoid image optimization errors
  },
};
