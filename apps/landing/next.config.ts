import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/vagas',
        destination: 'https://admin.wolterscontratacao.com/#/candidatar',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
