import type { NextConfig } from 'next';
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: '**.supabase.co' }
    ],
    dangerouslyAllowSVG: true,
    domains: ['placehold.co', 'unrlzieuyrsibokkqqbm.supabase.co'],
  },
};

export default withFlowbiteReact(nextConfig);