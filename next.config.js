/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    // إعدادات الصور لو هترفعها على سيرفر خارجي مستقبلاً
    images: {
        domains: ['res.cloudinary.com'],
    },
};

export default nextConfig;