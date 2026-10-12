/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Keep build workers bounded on the home server and CI runner.
  experimental: { cpus: 2 },
};

module.exports = nextConfig;
