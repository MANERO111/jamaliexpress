import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/sanctum/csrf-cookie',
        destination: 'http://95.216.199.94/sanctum/csrf-cookie',
      },
      {
        source: '/api/:path*',
        destination: 'http://95.216.199.94/api/:path*',
      },
    ];
  },
};

export default nextConfig;
