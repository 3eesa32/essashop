import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'Micro Ads | وكالة التصميم المتكاملة',
  description: 'نحول الأفكار إلى هويات بصرية ومنتجات ملموسة.',
};

export const viewport = {
  themeColor: '#f5f5f4',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {/* Navbar (سننشئه في الخطوة القادمة) */}
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="text-2xl font-black tracking-tighter text-[#c2410c]">MICRO ADS</div>
            <div className="hidden md:flex gap-8 font-bold text-sm">
              <a href="/">الرئيسية</a>
              <a href="/services">الخدمات</a>
              <a href="/portfolio">أعمالنا</a>
              <a href="/account">حسابي</a>
            </div>
          </div>
        </nav>

        <main className="min-h-screen">
          {children}
        </main>

        <footer className="bg-white border-t border-stone-200 py-12 text-center text-stone-400 font-bold text-xs">
          © 2026 Micro Ads Agency. All rights reserved.
        </footer>
      </body>
    </html>
  );
}