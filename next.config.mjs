import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin('./messages/i18n.ts');
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            hostname: 'localhost',
            pathname: '/**',
          },{
            hostname: 'via.placeholder.com',
            pathname: '/**'
          }
        ],
      },
};

export default withNextIntl(nextConfig);