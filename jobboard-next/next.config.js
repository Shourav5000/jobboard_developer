/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: "/jobboard_developer",
  assetPrefix: "/jobboard_developer"
};

module.exports = nextConfig;
