import type { NextConfig } from 'next';

/**
 * Security headers. `frame-ancestors 'none'` and a strict CSP are safe here
 * because the site ships no third-party scripts, no inline event handlers and
 * no remote images.
 */
const csp = [
  "default-src 'self'",
  // Next injects a small inline bootstrap; 'unsafe-inline' is scoped to scripts
  // only in development, where React refresh also needs 'unsafe-eval'.
  process.env.NODE_ENV === 'development'
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  typedRoutes: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },
  experimental: {
    optimizePackageImports: [],
  },
  /**
   * The methodology page was folded into Platform, where the reporting it
   * governs actually lives. Permanent, because the content moved rather than
   * disappeared and any existing link should follow it.
   */
  async redirects() {
    return [
      { source: '/methodology', destination: '/platform#value-stages', permanent: true },
      { source: '/modules/index', destination: '/modules', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
