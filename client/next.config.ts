import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    // Allow loading images only from S3 when using Next.js <Image> component
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com`,
      },
    ],
    // Cache images for 1 minute
    minimumCacheTTL: 60,
    unoptimized: true,
  },
};

export default nextConfig;
