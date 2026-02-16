import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/vagas',
                destination: '/candidatar',
                permanent: true,
            },
        ];
    },
};

export default withNextIntl(nextConfig);
