/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  // Transpile Three.js ecosystem for proper tree-shaking.
  // Without this, Next.js bundles everything from three/drei/fiber.
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
};

export default nextConfig;
