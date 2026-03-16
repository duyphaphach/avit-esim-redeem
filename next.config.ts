import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();
const localePattern = 'en|vi|zh|ja';

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: `/:locale(${localePattern})`,
          destination: '/:locale/redeem',
        },
      ],
    };
  },
};

export default withNextIntl(nextConfig);
