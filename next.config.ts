import type { NextConfig } from 'next';

/**
 * Security headers.
 *
 * The site shipped no third-party scripts at all until the booking calendar
 * arrived, and the policy below is written to keep that true everywhere except
 * the one route that now needs it. `/calculator` gets Cal.com added to three
 * directives — the script that boots the embed, the frame it mounts, and the
 * calls that frame makes — and every other route keeps the original policy,
 * including `frame-src 'none'` and `connect-src 'self'`.
 *
 * Widening this globally would have been one line shorter and would have cost
 * the other twenty routes their guarantee.
 */
const CAL = 'https://app.cal.com https://cal.com';

function policy({ cal = false }: { cal?: boolean } = {}): string {
  const dev = process.env.NODE_ENV === 'development';

  // Next injects a small inline bootstrap; 'unsafe-eval' is development only,
  // where React refresh needs it.
  const script = ["'self'", "'unsafe-inline'", dev ? "'unsafe-eval'" : '', cal ? CAL : '']
    .filter(Boolean)
    .join(' ');

  return [
    "default-src 'self'",
    `script-src ${script}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src 'self'${cal ? ` ${CAL}` : ''}`,
    // The calendar is an iframe on the booking route and nowhere else.
    cal ? `frame-src ${CAL}` : "frame-src 'none'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "object-src 'none'",
    'upgrade-insecure-requests',
  ].join('; ');
}

const SHARED_HEADERS = [
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
];

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
      // The booking route first, and excluded from the rule below: two
      // Content-Security-Policy headers on one response are intersected by the
      // browser, so the stricter one would win and the calendar would not load.
      {
        source: '/calculator',
        headers: [
          { key: 'Content-Security-Policy', value: policy({ cal: true }) },
          ...SHARED_HEADERS,
        ],
      },
      {
        source: '/:path((?!calculator$).*)',
        headers: [{ key: 'Content-Security-Policy', value: policy() }, ...SHARED_HEADERS],
      },
    ];
  },
};

export default nextConfig;
