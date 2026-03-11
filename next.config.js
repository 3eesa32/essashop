/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // دي عشان فيرسيل ميرخمش عليك في أي تحذيرات تافهة وقت الـ Build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
