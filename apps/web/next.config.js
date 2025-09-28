/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@intakeoff/design-system', '@intakeoff/sdk'],
  experimental: {
    optimizePackageImports: ['@intakeoff/design-system'],
  },
  eslint: {
    dirs: ['src'],
  },
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
}

module.exports = nextConfig