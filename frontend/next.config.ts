import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Cloudinary — imágenes en producción
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      // localhost — imágenes durante desarrollo (servidas desde el backend o frontend)
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
};

export default nextConfig;
