/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",
      "res.cloudinary.com",
      "randomuser.me",
      "images.unsplash.com",
      "img.icons8.com",
      "cdn.worldvectorlogo.com",
      "cdn-icons-png.flaticon.com",
      "images.pexels.com",
      "cdn.iconscout.com",
    ],
    unoptimized: true,
  },
  experimental: {
    serverActions: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
