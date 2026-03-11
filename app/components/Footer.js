"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';

export default function Footer() {
    const isAdmin = false; // متغير مؤقت
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        // جميع دوال الجافاسكريبت الخاصة بك تم وضعها هنا لتعمل بعد تحميل الصفحة
        window.openQuoteModal = function(serviceName, description = "") {
            const modal = document.getElementById('service-modal');
            const titleField = document.getElementById('modal-service-title');
            const briefField = document.getElementById('cust-brief');
            
            if (!modal) return;
            
            if(titleField) titleField.innerText = serviceName;
            if(briefField && description) briefField.value = "بخصوص: " + description;
            
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            document.body.style.overflow = 'hidden';
        };

        window.closeModal = function() {
            const modal = document.getElementById('service-modal');
            if (modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
                document.body.style.overflow = 'auto';
            }
        };

        window.handleUniversalSubmit = async function(event) {
            event.preventDefault();
            const form = event.target;
            const btn = form.querySelector('button[type="submit"]');
            
            if (!btn) return;

            const originalText = btn.innerText;
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> جاري الإرسال...';
            btn.disabled = true;
            btn.classList.add('opacity-75', 'cursor-not-allowed');

            try {
                const formData = new FormData(form);
                const serviceTitle = document.getElementById('modal-service-title');
                
                if (serviceTitle && (form.id === 'service-form' || form.id === 'reorderForm')) {
                    formData.append('service_name', serviceTitle.innerText);
                    formData.append('action', 'submit_order');
                }

                // ملاحظة: مسار الـ API سيتغير لاحقاً في النظام الجديد
                const response = await fetch('/process_order.php', { method: 'POST', body: formData });
                const result = await response.json();

                if (result.status === 'success') {
                    btn.innerHTML = 'تم الإرسال بنجاح! <i class="fa-solid fa-check"></i>';
                    btn.style.backgroundColor = "#16a34a";
                    btn.style.borderColor = "#16a34a";

                    setTimeout(() => {
                        if(form.id === 'service-form' || form.id === 'reorderForm') window.closeModal();
                        form.reset();
                        btn.innerHTML = originalText;
                        btn.disabled = false;
                        btn.classList.remove('opacity-75', 'cursor-not-allowed');
                        btn.style.backgroundColor = "";
                        btn.style.borderColor = "";
                    }, 2500);
                    
                } else { 
                    throw new Error(result.message); 
                }
            } catch (err) {
                btn.innerHTML = 'حدث خطأ، حاول مجدداً <i class="fa-solid fa-triangle-exclamation"></i>';
                btn.style.backgroundColor = "#dc2626";
                btn.style.borderColor = "#dc2626";

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    btn.classList.remove('opacity-75', 'cursor-not-allowed');
                    btn.style.backgroundColor = "";
                    btn.style.borderColor = "";
                }, 3000);
            }
        };

        const allForms = ['contact-form', 'service-form', 'tg-form', 'reorderForm'];
        allForms.forEach(id => {
            const f = document.getElementById(id);
            if(f) {
                // منع تكرار إضافة الحدث
                f.removeEventListener('submit', window.handleUniversalSubmit);
                f.addEventListener('submit', window.handleUniversalSubmit);
            }
        });

        const modal = document.getElementById('service-modal');
        if (modal) {
            const handleModalClick = (e) => { 
                if (e.target === modal) window.closeModal(); 
            };
            modal.removeEventListener('click', handleModalClick);
            modal.addEventListener('click', handleModalClick);
        }
    }, []);

    return (
        <footer className="bg-[#1c1917] text-stone-400 pt-16 pb-8 border-t-4 border-[#c2410c] mt-auto relative z-[50]">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-stone-800 pb-12 mb-8">
                    
                    <div className="space-y-6">
                        <div className="flex items-center">
                            <img src="/logo.png" alt="محمد عيسى" style={{ width: '51px', height: '40px' }} className="object-contain" />
                        </div>
                        <p className="text-sm text-stone-400 leading-relaxed font-bold">
                            نصنع هويات بصرية استثنائية وتجارب مستخدم تترك أثراً. ندمج الفن مع التكنولوجيا الرقمية لضمان نمو أعمالك وتميزك في السوق.
                        </p>
                        <div className="flex items-center gap-3">
                            <Link href="#" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:bg-[#c2410c] hover:text-white transition-all" title="WhatsApp">
                                <i className="fa-brands fa-whatsapp text-lg"></i>
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:bg-[#c2410c] hover:text-white transition-all" title="Behance">
                                <i className="fa-brands fa-behance text-lg"></i>
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:bg-[#c2410c] hover:text-white transition-all" title="LinkedIn">
                                <i className="fa-brands fa-linkedin-in text-lg"></i>
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white font-black text-lg mb-6 tracking-tighter">روابط سريعة</h3>
                        <ul className="space-y-4 font-bold text-sm">
                            <li><Link href="/" className="hover:text-[#c2410c] transition-colors flex items-center gap-2"><i className="fa-solid fa-angle-left text-xs"></i> الرئيسية</Link></li>
                            <li><Link href="/services" className="hover:text-[#c2410c] transition-colors flex items-center gap-2"><i className="fa-solid fa-angle-left text-xs"></i> خدماتي</Link></li>
                            <li><Link href="/portfolio" className="hover:text-[#c2410c] transition-colors flex items-center gap-2"><i className="fa-solid fa-angle-left text-xs"></i> معرض الأعمال</Link></li>
                            <li><Link href="/packages" className="hover:text-[#c2410c] transition-colors flex items-center gap-2"><i className="fa-solid fa-angle-left text-xs"></i> الباقات والأسعار</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-black text-lg mb-6 tracking-tighter">منطقة العملاء</h3>
                        <ul className="space-y-4 font-bold text-sm">
                            <li><Link href={isAdmin ? '/dashboard' : '/account'} className="hover:text-[#c2410c] transition-colors flex items-center gap-2"><i className="fa-solid fa-user text-xs"></i> {isAdmin ? 'لوحة الإدارة' : 'حسابي'}</Link></li>
                            <li><Link href="/messages" className="hover:text-[#c2410c] transition-colors flex items-center gap-2"><i className="fa-solid fa-comments text-xs"></i> مركز المراسلة</Link></li>
                            <li><Link href="/cart" className="hover:text-[#c2410c] transition-colors flex items-center gap-2"><i className="fa-solid fa-cart-shopping text-xs"></i> سلة المشتريات</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-black text-lg mb-6 tracking-tighter">تواصل معنا</h3>
                        <ul className="space-y-4 font-bold text-sm">
                            <li className="flex items-start gap-3">
                                <i className="fa-solid fa-envelope mt-1 text-[#c2410c]"></i>
                                <div>
                                    <span className="block text-white mb-1">البريد الإلكتروني</span>
                                    <a href="mailto:hello@mo-essa.work" className="hover:text-[#c2410c] transition-colors" dir="ltr">hello@mo-essa.work</a>
                                </div>
                            </li>
                            <li className="flex items-start gap-3 mt-4">
                                <i className="fa-solid fa-clock mt-1 text-[#c2410c]"></i>
                                <div>
                                    <span className="block text-white mb-1">مواعيد العمل</span>
                                    <span>الأحد - الخميس (9ص - 5م)</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="text-center flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="font-bold text-xs md:text-sm tracking-widest">
                        © {currentYear} <span className="text-white">محمد عيسى</span>. جميع الحقوق محفوظة لـ Micro Ads.
                    </p>
                    <p className="text-xs font-bold bg-stone-800 px-3 py-1.5 rounded-full">
                        صُنع بشغف 
                    </p>
                </div>

            </div>
        </footer>
    );
}