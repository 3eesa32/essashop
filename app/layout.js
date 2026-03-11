import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Script from 'next/script';

// 1. إعدادات الميتا داتا الوصفية للموقع
export const metadata = {
  title: 'محمد عيسى | خبير براندينج وتصميم',
  description: 'خبير في بناء الهويات البصرية وتصميم المواقع الاحترافية - Micro Ads',
};

// 2. إعدادات الـ Viewport (تم نقل themeColor هنا لحل مشكلة الـ Build)
export const viewport = {
  themeColor: '#f5f5f4',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" id="html-tag">
      <head>
        {/* تحسين أداء التحميل من السيرفرات الخارجية */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* تحميل مسبق لشعار الموقع لسرعة الظهور */}
        <link rel="preload" as="image" href="/logo.png" />
        
        {/* استيراد الخطوط (Cairo) والأيقونات (Font Awesome) */}
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      </head>
      
      <body className="selection:bg-orange-200 relative">
        
        {/* كود تتبع إحصائيات جوجل - Google Analytics */}
        <Script 
          src="https://www.googletagmanager.com/gtag/js?id=G-47L3F3EKPF" 
          strategy="afterInteractive" 
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-47L3F3EKPF');
          `}
        </Script>

        {/* القائمة العلوية الثابتة */}
        <Navbar />
        
        {/* محتوى الصفحات المتغير */}
        <main>
            {children}
        </main>
        
        {/* التذييل السفلي */}
        <Footer />
        
      </body>
    </html>
  );
}
