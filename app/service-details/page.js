"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ServiceDetailsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const serviceId = searchParams.get('id');

    // حالات الصفحة
    const [service, setService] = useState(null);
    const [brief, setBrief] = useState('');
    const [showAuthModal, setShowAuthModal] = useState(false);
    
    // محاكاة حالة تسجيل الدخول (سنربطها بالـ API لاحقاً)
    const [isLoggedIn, setIsLoggedIn] = useState(false); 

    // جلب بيانات الخدمة بناءً على الـ ID
    useEffect(() => {
        if (!serviceId) return;

        // بيانات تجريبية مؤقتة مطابقة لما في قاعدة البيانات الخاصة بك
        const dummyDatabase = {
            '1': { id: 1, cat: 'branding', name: 'هوية مطعم برجريتو', desc: 'تصميم شعار عصري مع قائمة طعام ومطبوعات تغليف للمطعم.', long_desc: 'نقدم لك هوية بصرية متكاملة تشمل الشعار، الألوان الأساسية، تصميم المنيو، وتغليف المنتجات الخاصة بمطعمك لضمان تجربة مستخدم متناسقة وجذابة.', img: 'brand_identity.webp', price: '5000', contract: { delivery: '7 أيام عمل', revisions: '3 تعديلات', files: 'AI, PDF, PNG', rights: 'ملكية كاملة للعميل' }, reviews: [] },
            '2': { id: 2, cat: 'packaging', name: 'تغليف منتجات ألبان', desc: 'تصميم استيكر وعبوات لمنتجات غذائية بألوان جذابة.', long_desc: 'تصميم احترافي للعبوات يضمن بروز منتجك على الأرفف التنافسية.', img: 'packaging_sleeve.webp', price: '3500', contract: { delivery: '5 أيام عمل', revisions: 'تعديلان', files: 'PDF, 3D Mockup', rights: 'ملكية كاملة' }, reviews: [] }
            // أضف المزيد للرقم 3، 4، إلخ للتجربة
        };

        const foundService = dummyDatabase[serviceId];
        if (foundService) {
            setService(foundService);
        } else {
            // إذا لم يتم العثور على الخدمة، العودة لصفحة الخدمات
            router.push('/services');
        }
    }, [serviceId, router]);

    // مراقب الحركات (Scroll Reveal)
    useEffect(() => {
        if (!service) return; // انتظر حتى يتم تحميل الخدمة
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

        document.querySelectorAll('.reveal-up').forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [service]);

    // وظيفة الإضافة للسلة
    const handleAddToCart = () => {
        if (!isLoggedIn) {
            setShowAuthModal(true);
            return;
        }
        // توجيه لصفحة السلة مع إرسال المعرف والبريف
        const encodedBrief = encodeURIComponent(brief);
        router.push(`/cart?action=add&id=${service.id}&brief=${encodedBrief}`);
    };

    // دالة مساعدة لترجمة الأقسام
    const getCatName = (cat) => {
        const catNames = { 'branding': 'هوية بصرية', 'packaging': 'تغليف منتجات', 'digital': 'دعاية رقمية' };
        return catNames[cat] || cat;
    };

    if (!service) {
        return <div className="min-h-screen flex items-center justify-center font-bold text-stone-400">جاري تحميل الخدمة...</div>;
    }

    return (
        <main className="py-24 md:py-32 px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
                
                {/* شريط التنقل */}
                <nav className="flex mb-8 text-xs md:text-sm font-bold text-stone-400 reveal-up">
                    <Link href="/services" className="hover:text-[#c2410c] transition-colors">الخدمات</Link>
                    <span className="mx-2">/</span>
                    <span className="text-stone-600">{service.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
                    
                    {/* صورة الخدمة */}
                    <div className="space-y-4 reveal-up">
                        <div className="hero-image-card aspect-square w-full relative z-10 shadow-sm bg-stone-100">
                            <img src={`/products/${service.img}`} className="w-full h-full object-cover" alt={service.name} />
                        </div>
                    </div>

                    {/* تفاصيل الخدمة */}
                    <div className="flex flex-col justify-start">
                        
                        <div className="reveal-up" style={{ transitionDelay: '0.1s' }}>
                            <span className="inline-block text-[#c2410c] font-black text-[10px] md:text-xs uppercase tracking-widest bg-white px-5 py-2 rounded-full border border-[#e7e5e4] shadow-sm w-fit mb-4">
                                {getCatName(service.cat)}
                            </span>
                            
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 leading-[1.2] tracking-tighter text-[#44403c]">{service.name}</h1>
                            
                            <div className="flex items-center gap-4 mb-8">
                                <span className="text-3xl md:text-4xl font-black text-[#c2410c]">{service.price} ج.م</span>
                                <span className="px-4 py-1.5 bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] rounded-full text-[10px] md:text-xs font-black uppercase shadow-sm">متاح للتنفيذ فوراً</span>
                            </div>

                            <p className="text-sm md:text-lg text-stone-500 font-bold leading-relaxed mb-8 whitespace-pre-line">
                                {service.long_desc || service.desc}
                            </p>
                        </div>

                        {/* صندوق التعاقد */}
                        <div className="contract-box p-6 md:p-8 mb-8 shadow-sm reveal-up" style={{ transitionDelay: '0.2s' }}>
                            <h3 className="font-black text-lg mb-5 flex items-center gap-2 text-[#44403c]">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                بنود التعاقد والضمانات
                            </h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm font-bold text-stone-500">
                                <li className="flex items-center gap-2"><span className="text-[#c2410c]">●</span> مدة التسليم: {service.contract?.delivery || 'يحدد لاحقاً'}</li>
                                <li className="flex items-center gap-2"><span className="text-[#c2410c]">●</span> التعديلات: {service.contract?.revisions || '3 تعديلات'}</li>
                                <li className="flex items-center gap-2"><span className="text-[#c2410c]">●</span> الملفات: {service.contract?.files || 'AI, PDF, PNG'}</li>
                                <li className="flex items-center gap-2"><span className="text-[#c2410c]">●</span> حقوق الملكية: {service.contract?.rights || 'ملكية كاملة للعميل'}</li>
                            </ul>
                        </div>

                        {/* حقل الملاحظات */}
                        <div className="mb-8 reveal-up" style={{ transitionDelay: '0.25s' }}>
                            <label className="block font-black text-[10px] md:text-xs uppercase tracking-widest text-stone-400 mb-3 pr-2">ملاحظاتك للمشروع (اختياري)</label>
                            <textarea 
                                value={brief}
                                onChange={(e) => setBrief(e.target.value)}
                                className="apple-input h-32" 
                                placeholder="اكتب لنا تفاصيل مشروعك، الألوان المفضلة، أو أي ملاحظات تود إضافتها للبدء..."
                            ></textarea>
                        </div>

                        {/* أزرار الإجراءات */}
                        <div className="flex flex-col md:flex-row gap-4 reveal-up" style={{ transitionDelay: '0.3s' }}>
                            <button onClick={handleAddToCart} className="btn-capsule flex-1 py-4 md:py-5 bg-[#c2410c] text-white shadow-lg hover:shadow-xl hover:shadow-[#c2410c]/20 text-sm md:text-base w-full border-none">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                                إضافة للسلة وبدء المشروع
                            </button>
                            
                            <a href="https://wa.me/201201111622" target="_blank" rel="noopener noreferrer" className="btn-capsule py-4 md:py-5 px-8 bg-white border-2 border-[#e7e5e4] text-[#44403c] hover:border-[#c2410c] hover:text-[#c2410c] text-sm md:text-base w-full md:w-auto text-decoration-none">
                                استشارة فنية
                            </a>
                        </div>
                    </div>
                </div>

                {/* نافذة تسجيل الدخول المنبثقة (Modal) */}
                {showAuthModal && (
                    <div className="fixed inset-0 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-md z-[3000]" onClick={() => setShowAuthModal(false)}>
                        <div className="apple-card w-full max-w-md p-10 text-center shadow-2xl bg-white" onClick={(e) => e.stopPropagation()}>
                            <div className="w-20 h-20 bg-[#fff7ed] border border-[#ffedd5] rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c2410c" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                            </div>
                            <h2 className="text-2xl font-black mb-3 text-[#44403c] tracking-tighter">سجل دخولك أولاً</h2>
                            <p className="text-stone-500 font-bold mb-8 text-sm leading-relaxed">يجب تسجيل الدخول لتتمكن من إضافة الخدمات للسلة وبدء التعاقد.</p>
                            <div className="space-y-3">
                                <Link href="/account" className="btn-capsule block w-full py-4 bg-[#c2410c] text-white text-sm">تسجيل الدخول / إنشاء حساب</Link>
                                <button onClick={() => setShowAuthModal(false)} className="text-stone-400 font-bold text-xs uppercase hover:text-[#44403c] transition-colors mt-4 block w-full bg-transparent border-none cursor-pointer">تجاهل الآن</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}