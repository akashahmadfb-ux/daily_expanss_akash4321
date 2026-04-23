/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@daily-expanss/ui', '@daily-expanss/shared', '@daily-expanss/db', '@daily-expanss/ai'],
  images: { domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com'] },
  experimental: { serverComponentsExternalPackages: ['@prisma/client'] },
};
module.exports = nextConfig;
