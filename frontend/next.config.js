/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Docker standalone build - essencial para produção
  output: "standalone",

  // 🔒 SECURITY: Remove console logs em produção
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error"], // Mantém apenas console.error
          }
        : false,
  },

  // 🔒 SECURITY: Headers de segurança
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },

  // 🔒 SECURITY: Content Security Policy
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.NEXT_PUBLIC_API_URL + "/api/:path*",
      },
    ];
  },

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nyrvyuaiqmhznvwmimpz.supabase.co",
      },
      {
        protocol: "https",
        hostname: "sistemaseugerente.com.br",
      },
    ],
  },

  // 🔒 SECURITY: Otimizações de produção
  productionBrowserSourceMaps: false, // Não expõe source maps
  poweredByHeader: false, // Remove header X-Powered-By
  compress: true, // Compressão gzip

  // 🔒 SECURITY: Variáveis de ambiente públicas
  env: {
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL || "https://sistemaseugerente.com.br",
  },
};

module.exports = nextConfig;
