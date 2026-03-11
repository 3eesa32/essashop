"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function PackagesPage() {
    // --- 1. حالة الصفحة والنوافذ المنبثقة ---
    const [isLoggedIn, setIsLoggedIn] = useState(false); // محاكاة (يمكنك تغييرها لـ true للتجربة)
    const [userName, setUserName] = useState("محمد عيسى"); // محاكاة لاسم العميل

    // حالات التحكم في النوافذ (Modals)
    const [activeModal, setActiveModal] = useState(null); // 'guest', 'order', 'success', 'image', null
    const [selectedPackage, setSelectedPackage] = useState(null); // الباقة التي تم اختيارها
    const [isSubmitting, setIsSubmitting] = useState(false); // حالة الإرسال

    // --- 2. بيانات الباقات (محاكاة لقاعدة البيانات) ---
    const allPackages = [
        {
            id: 1,
            name: "الباقة الأساسية",
            price: "5000",
            img: "/products/brand_identity.webp", // تأكد من المسار بناءً على ملفاتك
            details: "تصميم شعار، ألوان الهوية، بطاقة عمل",
            features: ["تصميم شعار احترافي", "اختيار ألوان الهوية", "تصميم بطاقة عمل واحدة", "ملفات مفتوحة المصدر"]
        },
        {
            id: 2,
            name: "باقة السوشيال ميديا",
            price: "8500",
            img: "/products/instagram_posts.webp",
            details: "15 تصميم بوست، فيديو ريلز، غلاف صفحة",
            features: ["15 تصميم بوست مخصص", "تصميم فيديو ريلز (15 ثانية)", "تصميم غلاف للصفحة", "كتابة المحتوى (اختياري)"]
        },
        {
            id: 3,
            name: "الباقة الماسية المتكاملة",
            price: "15000",
            img: "/products/packaging_sleeve.webp",
            details: "هوية كاملة، تغليف، تصميم موقع تعريفي",
            features: ["هوية بصرية متكاملة", "تصميم عبوة/تغليف للمنتج", "تصميم موقع إلكتروني تعريفي (صفحة واحدة)", "دعم فني لمدة شهر"]
        }
    ];

    // --- 3. وظائف معالجة الأحداث ---

    // عند الضغط على صورة الباقة
    const handleImageClick = (pkg) => {
        setSelectedPackage(pkg);
        setActiveModal('image');
    };

    // عند الضغط على زر "اطلب الباقة"
    const handleOrderClick = (pkg) => {
        setSelectedPackage(pkg);
        if (!isLoggedIn) {
            setActiveModal('guest');
        } else {
            setActiveModal('order');
        }
    };

    // عند إرسال فورم الطلب
    const submitOrder = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // محاكاة إرسال البيانات للسيرفر (API Call)
        setTimeout(() => {
            setIsSubmitting(false);
            setActiveModal('success');
        }, 1500);
    };

    // إغلاق أي نافذة منبثقة
    const closeModal = () => {
        setActiveModal(null);
        setSelectedPackage(null);
    };

    return (
        <main className="pt-[114px] pb-32 text-right"> 
            <section className="max-w-6xl mx-auto px-6">
                
                {/* --- عنوان الصفحة --- */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-8xl font-black mb-4 tracking-tighter text-[#44403c]">الباقة <span className="text-[#c2410c]">المختارة</span></h1>
                    <p className="text-stone-500 text-sm md:text-xl font-bold uppercase tracking-widest leading-relaxed">أفضل حل متكامل لبدء هويتك التجارية باحترافية</p>
                </div>

                {/* --- شبكة عرض الباقات --- */}
                <div className="flex flex-wrap justify-center gap-10 mb-20">
                    {allPackages.length > 0 ? (
                        allPackages.map(pkg => (
                            <div key={pkg.id} className="bg-[#fafaf9] border-2 border-[#e7e5e4] p-10 rounded-[3rem] flex flex-col justify-between max-w-md w-full shadow-sm hover:border-[#c2410c] hover:-translate-y-2 hover:shadow-2xl hover:shadow-stone-400/20 transition-all duration-400 z-10 md:p-6 md:rounded-[2rem]">
                                <div>
                                    <h2 className="text-2xl font-black mb-6 uppercase text-[#44403c] md:text-xl">{pkg.name}</h2>
                                    
                                    {/* صورة الباقة قابلة للتكبير */}
                                    <div className="rounded-2xl overflow-hidden mb-6 cursor-zoom-in group border border-stone-200" onClick={() => handleImageClick(pkg)}>
                                        <img src={pkg.img} alt={pkg.name} className="h-48 w-full object-cover group-hover:scale-110 transition-transform duration-700 md:h-[250px]" />
                                    </div>
                                    
                                    {/* السعر */}
                                    <div className="mb-6 border-b border-stone-200 pb-6">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-4xl md:text-5xl font-black text-[#c2410c]">{pkg.price}</span>
                                            <span className="text-lg font-bold text-stone-500">ج.م</span>
                                        </div>
                                    </div>

                                    {/* المميزات */}
                                    <ul className="space-y-4 mb-10 text-sm font-bold text-stone-500">
                                        {pkg.features.map((feature, index) => (
                                            <li key={index}><span className="text-[#c2410c] font-black text-[1.1em] ml-2">✓</span> {feature}</li>
                                        ))}
                                    </ul>
                                </div>
                                {/* زر الطلب */}
                                <button onClick={() => handleOrderClick(pkg)} className="w-full py-[1.2rem] bg-[#c2410c] text-white font-black rounded-[1.2rem] text-center inline-flex items-center justify-center border-none uppercase tracking-wide hover:brightness-110 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#c2410c]/20 transition-all duration-300 md:text-[0.6rem] md:p-[0.8rem] cursor-pointer">
                                    اطلب الباقة الآن
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-stone-400 font-bold">لا توجد باقات متاحة حالياً.</p>
                    )}
                </div>
            </section>

            {/* ====== النوافذ المنبثقة (Modals) ====== */}

            {/* 1. نافذة: طلب تسجيل الدخول (للزوار غير المسجلين) */}
            {activeModal === 'guest' && selectedPackage && (
                <div className="fixed inset-0 flex items-center justify-center p-4 bg-stone-100/90 backdrop-blur-[20px] z-[2000]" onClick={closeModal}>
                    <div className="bg-white border border-stone-200 w-full max-w-lg rounded-[3rem] p-10 md:p-14 relative shadow-2xl text-right" onClick={(e) => e.stopPropagation()}>
                        <button onClick={closeModal} className="absolute top-10 left-10 text-stone-400 hover:text-stone-800 transition-all bg-transparent border-none cursor-pointer">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </button>
                        <div className="mb-10">
                            <h2 className="text-2xl md:text-3xl font-black text-[#44403c]">تسجيل الدخول مطلوب</h2>
                            <p className="text-stone-500 mt-4 font-bold">يرجى تسجيل الدخول لإكمال طلبك لـ {selectedPackage.name}.</p>
                        </div>
                        <div className="space-y-6">
                            <Link href="/account" className="w-full py-5 bg-[#c2410c] text-white font-black rounded-2xl flex items-center justify-center hover:bg-orange-800 transition-all shadow-xl shadow-orange-900/20 uppercase no-underline">
                                الذهاب لصفحة تسجيل الدخول
                            </Link>
                            <button onClick={closeModal} className="w-full py-5 border border-stone-200 text-stone-600 font-black rounded-2xl hover:bg-stone-50 transition-all uppercase bg-white cursor-pointer">
                                إغلاق
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. نافذة: نموذج تأكيد الطلب (للمسجلين) */}
            {activeModal === 'order' && selectedPackage && (
                <div className="fixed inset-0 flex items-center justify-center p-4 bg-stone-100/90 backdrop-blur-[20px] z-[2000]" onClick={closeModal}>
                    <div className="bg-white border border-stone-200 w-full max-w-lg rounded-[3rem] p-10 relative text-right shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <button onClick={closeModal} className="absolute top-8 left-8 text-stone-400 hover:text-stone-800 bg-transparent border-none cursor-pointer">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </button>
                        <h2 className="text-2xl font-black text-[#44403c] mb-6 uppercase tracking-tighter">{selectedPackage.name}</h2>
                        <form onSubmit={submitOrder} className="space-y-6">
                            <textarea 
                                name="notes" 
                                placeholder="أخبرنا عن مشروعك..." 
                                rows="5" 
                                required 
                                defaultValue={`أرغب في حجز ${selectedPackage.name} والتي تشمل: ${selectedPackage.details}`}
                                className="w-full bg-stone-50 border border-stone-200 p-6 rounded-2xl text-[#44403c] outline-none focus:border-[#c2410c] text-right font-bold transition-all resize-none"
                            ></textarea>
                            <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-[#c2410c] text-white font-black rounded-2xl hover:bg-orange-800 transition-all shadow-xl shadow-orange-900/20 uppercase border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                                {isSubmitting ? "جاري الإرسال..." : "تأكيد حجز الباقة"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* 3. نافذة: نجاح الطلب */}
            {activeModal === 'success' && selectedPackage && (
                <div className="fixed inset-0 flex items-center justify-center p-4 bg-stone-100/90 backdrop-blur-[20px] z-[2000]" onClick={closeModal}>
                    <div className="bg-white border border-stone-200 w-full max-w-lg rounded-[3rem] p-10 md:p-14 relative shadow-2xl text-right animate-in fade-in zoom-in duration-300" onClick={(e) => e.stopPropagation()}>
                        <button onClick={closeModal} className="absolute top-10 left-10 text-stone-400 hover:text-stone-800 transition-all bg-transparent border-none cursor-pointer">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </button>
                        <div className="mb-10 text-center">
                            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c2410c" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                            </div>
                            <h2 className="text-2xl md:text-4xl font-black text-[#44403c] uppercase tracking-tighter mb-4">تهانينا يا {userName}!</h2>
                            <p className="text-stone-500 font-bold leading-relaxed text-sm md:text-base">لقد تم تسجيل طلبك لـ <b>{selectedPackage.name}</b> بنجاح.</p>
                        </div>
                        <div className="space-y-6">
                            <a href="https://t.me/mohessaaa_bot" target="_blank" rel="noreferrer" className="w-full py-5 bg-[#229ED9] text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-[#1c86ba] transition-all shadow-xl shadow-blue-500/10 uppercase no-underline">
                                تواصل عبر تليجرام
                            </a>
                            <button onClick={closeModal} className="w-full py-5 bg-stone-100 text-stone-600 font-black rounded-2xl hover:bg-stone-200 transition-all uppercase border-none cursor-pointer">
                                إغلاق
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 4. نافذة: تكبير الصورة (Lightbox) */}
            {activeModal === 'image' && selectedPackage && (
                <div className="fixed inset-0 bg-stone-50/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 z-[2500]">
                    <div className="absolute inset-0 cursor-zoom-out" onClick={closeModal}></div>
                    <button onClick={closeModal} className="absolute top-8 right-8 text-stone-800 bg-stone-200 p-3 rounded-full hover:bg-[#c2410c] hover:text-white transition-all z-[2600] border-none cursor-pointer">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                    <img src={selectedPackage.img} alt={selectedPackage.name} className="max-w-full max-h-[80vh] rounded-3xl shadow-2xl relative z-[2550] object-contain border border-stone-200" />
                    <p className="text-stone-800 font-black mt-8 relative z-[2550] bg-white/80 px-8 py-3 rounded-full border border-stone-200 uppercase tracking-widest text-sm shadow-sm">
                        {selectedPackage.name}
                    </p>
                </div>
            )}

        </main>
    );
}