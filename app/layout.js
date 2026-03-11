import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Script from 'next/script';

export const metadata = {
  title: 'محمد عيسى | خبير براندينج وتصميم',
  themeColor: '#f5f5f4',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" id="html-tag">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preload" as="image" href="/logo.png" />
        
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      </head>
      <body className="selection:bg-orange-200 relative">
        
        {/* أكواد تتبع جوجل */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-47L3F3EKPF" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-47L3F3EKPF');
          `}
        </Script>

        {/* المكونات الرئيسية التي ستظهر في كل الصفحات */}
        <Navbar />
        
        {/* هنا سيتم عرض محتوى الصفحات المتغيرة (مثل الرئيسية، من نحن، الخ) */}
        <main>
            {children}
        </main>
        
        <Footer />
        
      </body>
    </html>
  );
}