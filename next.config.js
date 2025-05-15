/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'your-nextauth-secret',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  },
  experimental: {
    serverActions: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  }
};

module.exports = nextConfig;