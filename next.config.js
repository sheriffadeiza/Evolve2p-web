/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Add redirects for common paths
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/Logins/login',
        permanent: true,
      },
      {
        source: '/signup',
        destination: '/Signups/Email',
        permanent: true,
      },
    ];
  },
  // Disable ESLint during build for deployment
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript checking during build
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has TypeScript errors.
    ignoreBuildErrors: true,
  },
  // Configure image domains
  images: {
    domains: ['evolve2p-backend.vercel.app'],
  },
  // Disable static optimization for pages that use browser APIs
  experimental: {
    // This prevents Next.js from statically optimizing pages that might use browser APIs
    // like localStorage during the initial render
    appDir: true,
  },
};

module.exports = nextConfig;
