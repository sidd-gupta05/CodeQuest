import type { NextConfig } from 'next';
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL('https://placehold.co')],
    dangerouslyAllowSVG: true,
    domains: ['placehold.co'],
  },
};

export default withFlowbiteReact(nextConfig);