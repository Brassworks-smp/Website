/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)', // Alle Seiten
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '0' },
          { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
          { key: 'X-DNS-Prefetch-Control', value: 'off' },
          { key: 'X-Download-Options', value: 'noopen' },
          { key: 'Expect-CT', value: 'enforce; max-age=604800' },
          { key: 'Origin-Agent-Cluster', value: '?1' },
          { key: 'Vary', value: 'Origin' },
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              base-uri 'self';
              frame-ancestors 'self';
              form-action 'self';
              block-all-mixed-content;
              upgrade-insecure-requests;
              img-src 'self' data: blob: https://cdn.discordapp.com https://*.discord.com;
              font-src 'self' data:;
              script-src 'self' 'unsafe-inline' blob: https://cdn.discordapp.com https://*.discord.com;
              style-src 'self' 'unsafe-inline';
              connect-src 'self' https: wss: https://*.discord.com https://*.discordapp.com;
              object-src 'none';
              frame-src 'self' https://brassmap.572.at/ https://discord.com https://*.discord.com https://*.discordapp.com;
            `.replace(/\n/g, ' ')
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;