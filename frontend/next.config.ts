import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Diese Header gelten für ALLE Pfade deiner App
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            // Erzwingt HTTPS (HSTS)
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            // Verhindert, dass deine Seite in einem Frame/Iframe angezeigt wird (Clickjacking-Schutz)
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            // Verhindert, dass der Browser versucht, den Inhaltstyp zu erraten (MIME-Sniffing)
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            // Kontrolliert, wie viel Info beim Verlassen deiner Seite an andere Seiten gesendet wird
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            // Schützt vor Cross-Site-Scripting (XSS) in älteren Browsern
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          /*
          {
            // strict Content Security Policy (CSP)
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://dein-backend.railway.app;"
          },
          */
        ],
      },
    ];
  },
};

export default nextConfig;
