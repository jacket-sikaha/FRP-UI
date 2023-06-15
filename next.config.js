/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Recommended for the `pages` directory, default in `app`.
  experimental: {
    appDir: true,
    serverActions: true, // enable Server Actions
  },
};

module.exports = nextConfig;
