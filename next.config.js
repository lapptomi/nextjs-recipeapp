/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    // Allow loading images only from S3 when using Next.js <Image> component
    remotePatterns: [
      {
        // Allow loading images from a domain that starts with "https://example.com"
        protocol: 'https',
        hostname: '**'
        // hostname: `${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com`,

      }
    ],
    // Cache images for 1 minute
    minimumCacheTTL: 60
  }
};

module.exports = nextConfig;
