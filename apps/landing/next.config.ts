import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

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

export default withNextIntl(nextConfig);
