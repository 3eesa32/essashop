"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // متغيرات مؤقتة لحين ربطها بنظام تسجيل الدخول الجديد
    const isAdmin = false; 

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // التحكم في منع التمرير عند فتح القائمة
    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [isSidebarOpen]);

    return (
        <>
            {/* الخلفية السوداء الشفافة */}
            <div 
                id="overlay" 
                className={`fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-[105] transition-opacity duration-300 ${isSidebarOpen ? 'block' : 'hidden'}`} 
                onClick={toggleSidebar}
            ></div>

            {/* القائمة الجانبية */}
            <aside 
                id="sidebar" 
                className={`w-72 bg-white shadow-2xl z-[110] flex flex-col border-l border-[#e7e5e4] fixed inset-y-0 right-0 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="p-8 text-center border-b border-[#e7e5e4] relative">
                    <button onClick={toggleSidebar} className="absolute top-6 left-6 w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-500 hover:text-red-500 transition-colors">
                        <i className="fa-solid fa-times text-lg"></i>
                    </button>
                    <div className="flex items-center justify-center mx-auto mb-4">
                        <img src="/logo.png" alt="محمد عيسى" style={{ width: '51px', height: '40px' }} className="object-contain" fetchPriority="high" />
                    </div>
                    <h1 className="text-xl font-black text-[#44403c] tracking-tighter">القائمة الرئيسية</h1>
                </div>
                
                <nav className="flex-1 p-4 overflow-y-auto">
                    <Link href="/" className={`sidebar-link ${pathname === '/' ? 'active' : ''}`}>
                        <i className="fa-solid fa-house w-8 text-center text-lg"></i><span>الرئيسية</span>
                    </Link>
                    <Link href="/services" className={`sidebar-link ${pathname === '/services' ? 'active' : ''}`}>
                        <i className="fa-solid fa-layer-group w-8 text-center text-lg"></i><span>خدماتي</span>
                    </Link>
                    <Link href="/portfolio" className={`sidebar-link ${pathname === '/portfolio' ? 'active' : ''}`}>
                        <i className="fa-solid fa-briefcase w-8 text-center text-lg"></i><span>أعمالي</span>
                    </Link>
                    <Link href="/packages" className={`sidebar-link ${pathname === '/packages' ? 'active' : ''}`}>
                        <i className="fa-solid fa-box-open w-8 text-center text-lg"></i><span>الباقات</span>
                    </Link>
                    <Link href="/about" className={`sidebar-link ${pathname === '/about' ? 'active' : ''}`}>
                        <i className="fa-solid fa-info-circle w-8 text-center text-lg"></i><span>عننا</span>
                    </Link>
                    
                    <div className="my-4 border-t border-[#e7e5e4]"></div>
                    
                    <Link href="/messages" className={`sidebar-link ${pathname === '/messages' ? 'active' : ''}`}>
                        <i className="fa-solid fa-comments w-8 text-center text-lg"></i><span>مركز المراسلة</span>
                    </Link>
                    <Link href={isAdmin ? '/dashboard' : '/account'} className={`sidebar-link ${pathname.includes('dashboard') || pathname === '/account' ? 'active' : ''}`}>
                        <i className="fa-solid fa-user w-8 text-center text-lg"></i><span>{isAdmin ? 'لوحة الإدارة' : 'حسابي'}</span>
                    </Link>
                </nav>
            </aside>

            {/* الشريط العلوي */}
            <nav className="fixed w-full top-0 z-[100] glass-nav py-4" id="main-nav">
              <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center relative h-10">
                
                <div className="flex items-center md:hidden order-1 relative z-[100] w-[44px] h-[44px]">
                    <button onClick={toggleSidebar} type="button" className="w-[44px] h-[44px] bg-stone-200/50 rounded-xl flex items-center justify-center text-stone-700 hover:text-[#c2410c] transition-all">
                        <i className="fa-solid fa-bars text-xl"></i>
                    </button>
                </div>

                <div className="hidden md:flex items-center gap-8 order-2">
                  <Link href="/" className={`text-sm font-black transition-all ${pathname === '/' ? 'nav-link-active' : 'text-stone-400 hover:text-stone-900'}`}>الرئيسية</Link>
                  <Link href="/services" className={`text-sm font-black transition-all ${pathname === '/services' ? 'nav-link-active' : 'text-stone-400 hover:text-stone-900'}`}>خدماتي</Link>
                  <Link href="/portfolio" className={`text-sm font-black transition-all ${pathname === '/portfolio' ? 'nav-link-active' : 'text-stone-400 hover:text-stone-900'}`}>أعمالي</Link>
                  <Link href="/packages" className={`text-sm font-black transition-all ${pathname === '/packages' ? 'nav-link-active' : 'text-stone-400 hover:text-stone-900'}`}>الباقات</Link>
                  <Link href="/about" className={`text-sm font-black transition-all ${pathname === '/about' ? 'nav-link-active' : 'text-stone-400 hover:text-stone-900'}`}>عننا</Link>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 order-2">
                    <Link href="/" className="group block">
                        <img src="/logo.png" alt="محمد عيسى" style={{ width: '51px', height: '40px' }} className="group-hover:rotate-12 transition-all duration-500 object-contain" fetchPriority="high" />
                    </Link>
                </div>

                <div className="flex items-center gap-2 order-3">
                    <Link href="/messages" className="hidden md:flex text-stone-800 p-2.5 relative group bg-stone-200/50 rounded-xl hover:bg-orange-100 transition-all" title="الرسائل">
                        <i className="fa-solid fa-comment-dots text-lg mt-0.5"></i>
                    </Link>
                    <Link href={isAdmin ? '/dashboard' : '/account'} className="hidden md:flex text-stone-800 p-2.5 relative group bg-stone-200/50 rounded-xl hover:bg-orange-100 transition-all" title="حسابي">
                        <i className="fa-solid fa-user text-lg mt-0.5"></i>
                    </Link>
                    <Link href="/cart" className="text-stone-800 p-2.5 relative group bg-stone-200/50 rounded-xl md:bg-stone-50 hover:bg-orange-100 transition-all" title="السلة">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
                        </svg>
                    </Link>
                </div>
              </div>
            </nav>
        </>
    );
}