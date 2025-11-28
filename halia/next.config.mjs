/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // Diciamo a Next.js di accettare le richieste che arrivano dai domini di GitHub
      allowedOrigins: ["localhost:3000", "*.app.github.dev", "*.github.dev"],
    },
  },
};

export default nextConfig;
