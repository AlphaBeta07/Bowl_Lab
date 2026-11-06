/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Prevents double GSAP initialization effects in dev mode
  images: {
    domains: ["images.unsplash.com", "localhost"],
    unoptimized: true,
  },
};

export default nextConfig;

