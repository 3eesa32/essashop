/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // إذا كنت ستجلب صور من روابط خارجية (مثل سحب صور من السيرفر القديم)، نضع الدومين هنا
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mo-essa.work',
      },
    ],
  },
};

export default nextConfig;