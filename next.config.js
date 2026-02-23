/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pdfkit'],
  },
  transpilePackages: ['remark-gfm'],
};

module.exports = nextConfig;
