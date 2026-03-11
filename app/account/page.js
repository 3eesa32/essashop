"use client";
import React, { useState, useEffect, Suspense } from 'react'; // تأكد من وجود Suspense هنا
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// الخطوة 1: حولنا اسم الدالة الأساسية لـ AccountContent
function AccountContent() {
    const searchParams = useSearchParams();
    
    // حالات المصادقة (Authentication)
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authView, setAuthView] = useState('login');
    
    // بيانات العميل
    const [user, setUser] = useState({
        full_name: 'محمد عيسى',
        email: 'mohamed@example.com',
        phone: '01000000000',
        client_folder_link: 'https://drive.google.com...',
        company_name: 'شركة مايكرو أدز',
        city: 'القاهرة، مصر',
        business_type: 'تقنية وبرمجيات',
        preferred_contact: 'whatsapp'
    });

    const [activeModal, setActiveModal] = useState(null);
    const [selectedData, setSelectedData] = useState(null);

    const projects = [
        { id: '101', title: 'هوية بصرية كاملة', status: 'in_progress', progress: 60, deadline: '2026-04-15', client_name: 'محمد عيسى', notes: 'جاري العمل على الشعار.', brief: 'ألوان دافئة، شعار عصري.', project_link: '' },
        { id: '102', title: 'تصميم موقع إلكتروني', status: 'pending', progress: 0, deadline: 'غير محدد', client_name: 'محمد عيسى', notes: '', brief: 'موقع تعريفي للشركة.', project_link: '' },
        { id: '100', title: 'حملة إعلانية', status: 'completed', progress: 100, deadline: '2026-02-01', client_name: 'محمد عيسى', notes: 'تم التسليم.', brief: 'حملة لزيادة المبيعات.', project_link: 'https://example.com/files' },
    ];

    const invoices = [
        { id: '501', amount: '5000', status: 'paid', created_at: '2026-03-01', project_name: 'هوية بصرية كاملة', brief: 'ألوان دافئة، شعار عصري', payment_method: 'visa' },
        { id: '502', amount: '1500', status: 'unpaid', created_at: '2026-03-10', project_name: 'استضافة سنوية', brief: 'تجديد الاستضافة', payment_method: 'bank' },
    ];

    const messages = [
        { id: 1, text: 'أهلاً بك! كيف يمكننا مساعدتك اليوم؟', isMe: false, time: '10:00 AM' },
        { id: 2, text: 'متى سيتم تسليم الشعار المبدئي؟', isMe: true, time: '10:05 AM' },
    ];

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal-up').forEach((el) => { observer.observe(el); });
    }, [isLoggedIn, authView]);

    const handleLogin = (e) => { e.preventDefault(); setIsLoggedIn(true); };
    const handleLogout = () => { setIsLoggedIn(false); setAuthView('login'); };

    const getStatusInfo = (status) => {
        const map = {
            'pending': { text: 'في الانتظار', class: 'status-pending', icon: 'fa-hourglass-start' },
            'in_progress': { text: 'قيد التنفيذ', class: 'status-processing', icon: 'fa-spinner' },
            'review': { text: 'مراجعة', class: 'status-review', icon: 'fa-clock' },
            'completed': { text: 'مكتمل', class: 'status-completed', icon: 'fa-check-circle' },
            'paid': { text: 'تم الدفع', class: 'status-paid', icon: 'fa-check-circle' },
            'unpaid': { text: 'بانتظار الدفع', class: 'status-unpaid', icon: 'fa-clock' }
        };
        return map[status] || map['pending'];
    };

    if (!isLoggedIn) {
        return (
            <main className="pt-32 pb-40 px-4 md:px-6 text-right">
                <section className="max-w-6xl mx-auto">
                    {authView === 'login' && (
                        <div className="apple-card p-8 md:p-12 max-w-md mx-auto shadow-xl reveal-up">
                            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <i className="fa-solid fa-user-shield text-2xl text-[#c2410c]"></i>
                            </div>
                            <h2 className="text-3xl font-black text-[#44403c] text-center mb-8 tracking-tighter">تسجيل الدخول</h2>
                            <form onSubmit={handleLogin} className="space-y-5">
                                <input type="email" placeholder="البريد الإلكتروني" required className="apple-input text-right" />
                                <input type="password" placeholder="كلمة المرور" required className="apple-input text-right" />
                                <button type="submit" className="btn-capsule w-full py-4 bg-[#c2410c] text-white shadow-lg text-sm">دخول المنصة</button>
                                <div className="flex justify-between items-center pt-4 px-2">
                                    <Link href="/register" className="text-[#c2410c] text-xs font-black hover:underline">إنشاء حساب جديد</Link>
                                    <button type="button" onClick={() => setAuthView('reset')} className="text-stone-400 text-xs font-bold hover:text-[#c2410c] bg-transparent border-none cursor-pointer">نسيت كلمة المرور؟</button>
                                </div>
                            </form>
                        </div>
                    )}
                </section>
            </main>
        );
    }

    return (
        <main className="pt-32 pb-40 px-4 md:px-6 text-right">
            <section className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6 reveal-up">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-[#44403c] tracking-tighter">أهلاً، <span className="text-[#c2410c]">{user.full_name}</span></h1>
                        <p className="text-stone-500 mt-3 font-bold text-sm uppercase tracking-widest">إليك السجل المالي والتقني لمشاريعك.</p>
                    </div>
                    <div className="flex flex-wrap gap-3 w-full md:w-auto">
                        <button onClick={handleLogout} className="btn-capsule px-6 py-4 bg-[#fff1f2] border-2 border-[#ffe4e6] text-[#e11d48] hover:bg-[#e11d48] hover:text-white text-[11px]">خروج</button>
                    </div>
                </div>
            </section>
        </main>
    );
}

// الخطوة 2: تغليف الصفحة بالكامل بالـ Suspense
export default function AccountPage() {
    return (
        <Suspense fallback={<div className="pt-40 text-center font-bold">جاري تحميل لوحة التحكم...</div>}>
            <AccountContent />
        </Suspense>
    );
}
