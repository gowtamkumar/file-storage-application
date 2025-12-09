import type { NextConfig, SizeLimit } from "next";
const maxFileSize = process.env.MAX_FILE_SIZE 
  ? `${process.env.MAX_FILE_SIZE}mb` 
  : '64mb' as SizeLimit;
const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    proxyClientMaxBodySize: maxFileSize as SizeLimit, // Allow 64MB file uploads
    serverActions: {
      bodySizeLimit: maxFileSize as SizeLimit, // Increase body size limit for server actions
      allowedOrigins: ['*'],
    },
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/nest/:path*',
        destination: 'http://localhost:4000/:path*',
      },
    ];
  },
};

export default nextConfig;
