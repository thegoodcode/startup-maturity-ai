// next.config.js
// Configuration file for Next.js 15 with experimental features enabled
// This enables Partial Prerendering (PPR) and other cutting-edge optimizations

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for Next.js 15
  experimental: {
    // Partial Prerendering (PPR) - combines static and dynamic rendering
    // This allows parts of the page to be statically generated while others remain dynamic
    ppr: true,

    // React Server Components improvements
    serverComponentsExternalPackages: [
      '@langchain/groq',
      '@langchain/core',
      '@langchain/community',
      'langchain',
    ],

    // Optimize bundling for AI/ML packages
    bundlePagesRouterDependencies: true,
  },

  // Webpack configuration for handling large AI packages
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    // Optimize for serverless functions
    if (isServer) {
      config.externals = [
        ...(config.externals || []),
        {
          // Mark heavy packages as external to reduce bundle size
          sharp: 'commonjs sharp',
          canvas: 'commonjs canvas',
        },
      ]
    }

    // Handle potential issues with ESM packages
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
      '.mjs': ['.mjs', '.js', '.ts', '.tsx'],
    }

    return config
  },

  // Environment variables that should be available to the client
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Optimize images and other assets
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },

  // Security headers for production
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  // Optimize for Vercel deployment
  poweredByHeader: false,
  compress: true,

  // Redirect configuration for better SEO
  async redirects() {
    return [
      // Add any redirects here if needed
    ]
  },
}

module.exports = nextConfig
