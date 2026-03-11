"use client";
import React, { useState } from 'react';

export default function PortfolioPage() {
    // 1. حالة الفلتر النشط
    const [activeFilter, setActiveFilter] = useState('all');

    const behanceLink = "https://www.behance.net/3eesa32";

    // 2. مصفوفة الأعمال المحدثة
    // (تأكد أن الصور موجودة في مجلد public/media/ في مشروع Next.js)
    const portfolioItems = [
        { id: 1, img: 'olios_branding.webp', title: 'Olios Branding', category: 'هوية بصرية', filter: 'branding' },
        { id: 2, img: 'ncc_holding_app.webp', title: 'NCC Holding', category: 'تصميم رقمي', filter: 'digital' },
        { id: 3, img: 'taashera_digital_design.webp', title: 'Taashera Digital', category: 'تصميم رقمي', filter: 'digital' },
        { id: 4, img: 'bread_packages.webp', title: 'Bread Packaging', category: 'تغليف', filter: 'packaging' },
        { id: 5, img: 'dermazone_cosmetics_crafting.webp', title: 'Dermazone', category: 'تغليف', filter: 'packaging' },
        { id: 6, img: 'frozen_vegetables.webp', title: 'Frozen Vegetables', category: 'تغليف', filter: 'packaging' },
        { id: 7, img: 'rice_package_2.webp', title: 'Rice Package', category: 'تغليف', filter: 'packaging' },
        { id: 8, img: 'tuna_package.webp', title: 'Tuna Package', category: 'تغليف', filter: 'packaging' },
        { id: 9, img: 'oil_labels.webp', title: 'Oil Labels', category: 'تغليف', filter: 'packaging' },
        { id: 10, img: 'tomato_label.webp', title: 'Tomato Label', category: 'تغليف', filter: 'packaging' },
        { id: 11, img: 'meat_labels.webp', title: 'Meat Labels', category: 'تغليف', filter: 'packaging' },
        { id: 12, img: 'jam_labels_2.webp', title: 'Jam Labels', category: 'تغليف', filter: 'packaging' },
        { id: 13, img: 'bcw_instagram_posts.webp', title: 'BCW Instagram', category: 'سوشيال ميديا', filter: 'social' },
        { id: 14, img: 'downy_event.webp', title: 'Downy Event', category: 'فعاليات', filter: 'events' },
        { id: 15, img: 'fairy_event.webp', title: 'Fairy Event', category: 'فعاليات', filter: 'events' },
        { id: 16, img: 'gytex_event.webp', title: 'Gytex Event', category: 'فعاليات', filter: 'events' },
        { id: 17, img: 'yum_menu.webp', title: 'Yum Menu', category: 'مطبوعات', filter: 'print' },
        { id: 18, img: 'yum_sleeves.webp', title: 'Yum Sleeves', category: 'مطبوعات', filter: 'print' },
    ];

    // أزرار الفلترة
    const filterButtons = [
        { label: 'الكل', value: 'all' },
        { label: 'تغليف المنتجات', value: 'packaging' },
        { label: 'هويات بصرية', value: 'branding' },
        { label: 'سوشيال ميديا', value: 'social' },
        { label: 'فعاليات', value: 'events' },
        { label: 'تصميم رقمي', value: 'digital' }
    ];

    // دالة فلترة الأعمال بناءً على الزر النشط
    const filteredItems = portfolioItems.filter(item => 
        activeFilter === 'all' || item.filter === activeFilter
    );

    return (
        <main className="relative pt-32 pb-24 overflow-hidden min-h-screen bg-[#f5f5f7] text-[#1d1d1f] text-right">
            
            {/* النقش الخلفي */}
            <div className="absolute inset-0 bg-pattern pointer-events-none"></div>

            {/* قسم العنوان (Hero) */}
            <section className="relative z-10 max-w-4xl mx-auto px-6 text-center mb-12">
                <div className="fade-in-up">
                    <h1 className="text-4xl md:text-7xl font-black mb-4 tracking-tighter text-[#1d1d1f]">
                        بصمة <span className="text-[#c2410c]">بصرية</span>
                    </h1>
                    <p className="text-[#86868b] text-sm md:text-lg font-bold leading-relaxed max-w-xl mx-auto mb-8">
                        نتجاوز حدود التصميم المألوف لنخلق هويات ومنتجات تتحدث عن نفسها. تصفح أعمالنا واكتشف الفارق.
                    </p>
                </div>
            </section>

            {/* أزرار الفلترة */}
            <section className="relative z-10 fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="filter-container">
                    {filterButtons.map(btn => (
                        <button 
                            key={btn.value}
                            onClick={() => setActiveFilter(btn.value)}
                            className={`filter-btn ${activeFilter === btn.value ? 'active' : ''}`}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>
            </section>

            {/* شبكة عرض الأعمال */}
            <section className="relative z-10 w-full mb-20 fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="smart-grid">
                    {filteredItems.map(item => (
                        <a 
                            key={item.id} 
                            href={behanceLink} 
                            target="_blank" 
                            rel="noreferrer"
                            className="portfolio-card"
                        >
                            <img src={`/media/${item.img}`} alt={item.title} className="card-img" loading="lazy" />
                            
                            <div className="glass-btn">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10 10-4.48 10-10zm-13.43 1.25h1.61c.02 1.09-.53 1.63-1.61 1.63h-1.61v-1.63zm0-2.45h1.41c.96 0 1.41.42 1.41 1.24 0 .81-.45 1.21-1.41 1.21h-1.41v-2.45zm5.1 3.5c-.86 0-1.52-.42-1.83-1.07h3.62c-.06.7-.61 1.07-1.79 1.07zm1.74-2.12h-3.48c.11-.75.72-1.12 1.67-1.12.98 0 1.62.37 1.81 1.12zm-8.41-2.93h2.37c1.78 0 2.68.86 2.68 2.29 0 .8-.29 1.41-.86 1.82.78.41 1.21 1.05 1.21 1.96 0 1.63-.98 2.51-2.91 2.51h-2.49V9.25zm8.5 2.15c0-1.56-1.01-2.35-2.82-2.35-1.79 0-2.92.89-3.14 2.47h6.05c-.03-.04-.06-.08-.09-.12zM15.4 7.84h3.18v.83h-3.18v-.83z"/>
                                </svg>
                            </div>

                            <div className="card-gradient">
                                <span className="text-[#c2410c] font-black text-[9px] md:text-xs uppercase tracking-widest mb-1">
                                    {item.category}
                                </span>
                                <h3 className="text-white font-black text-sm md:text-xl line-clamp-1">
                                    {item.title}
                                </h3>
                            </div>
                        </a>
                    ))}
                </div>
            </section>

            {/* دعوة للإجراء (Call to Action) */}
            <section className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                <div className="bg-white p-10 md:p-14 rounded-[2rem] shadow-sm border border-stone-200">
                    <div className="w-16 h-16 bg-[#fff5f5] text-[#c2410c] rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black mb-4 text-[#1d1d1f]">استكشف القصة الكاملة</h2>
                    <p className="text-[#86868b] font-bold text-xs md:text-sm mb-8 max-w-md mx-auto">
                        خلف كل تصميم هنا فكرة وتحدي قمنا بحله. قم بزيارة حسابنا الرسمي على Behance لرؤية تفاصيل المشاريع بالكامل.
                    </p>
                    <a href={behanceLink} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#1d1d1f] hover:bg-[#333336] text-white px-8 py-4 rounded-full text-xs md:text-sm font-black uppercase tracking-widest transition-colors shadow-xl no-underline">
                        زيارة Behance
                    </a>
                </div>
            </section>

        </main>
    );
}