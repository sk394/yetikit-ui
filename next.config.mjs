import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // Registry sources are read from disk at render time (docs + previews).
  outputFileTracingIncludes: {
    '/*': ['./registry/**/*', './registry.json'],
  },
};

export default withMDX(config);
