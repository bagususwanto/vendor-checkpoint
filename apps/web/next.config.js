/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/vendor-checkpoint',
  assetPrefix: '/vendor-checkpoint',
  allowedDevOrigins: ['http://localhost:3000'],
};

export default nextConfig;