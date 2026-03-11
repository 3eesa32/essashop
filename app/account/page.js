"use client";
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function AccountContent() {
    const searchParams = useSearchParams();
    
    // حالات المصادقة (Authentication)
    const [isLoggedIn, setIsLoggedIn] = useState(false); // اجعلها true لتجربة شكل لوحة التحكم
    const [authView, setAuthView] = useState('login'); // 'login' | 'reset' | 'new_password'
    
    // بيانات العميل الوهمية (للتجربة)
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

    // حالات النوافذ المنبثقة (Modals)
    const [activeModal, setActiveModal] = useState(null); // 'project', 'invoice', 'profile', 'chat', null
    const [selectedData, setSelectedData] = useState(null); // لتمرير بيانات المشروع أو الفاتورة للمودال

    // محاكاة قواعد البيانات
    const projects = [
        { id: '101', title: 'هوية بصرية كاملة', status: 'in_progress', progress: 60, deadline: '2026-04-15', client_name: 'محمد عيسى', notes: 'جاري العمل على الشعار.', brief: 'ألوان دافئة، شعار عصري.', project_link: '' },
        { id: '102', title: 'تصميم موقع إلكتروني', status: 'pending', progress: 0, deadline: 'غير محدد', client_name: 'محمد عيسى', notes: '', brief: 'موقع تعريفي للشركة.', project_link: '' },
        { id: '100', title: 'حملة إعلانية', status: 'completed', progress: 100, deadline: '2026-02-01', client_name: 'محمد عيسى', notes: 'تم التسليم.', brief: 'حملة لزيادة المبيعات.', project_link: 'https://example.com/files' },
    ];

    const invoices = [
        { id: '501', amount: '5000', status: 'paid', created_at: '2026-03-01', project_name: 'هوية بصرية كاملة', brief: 'ألوان دافئة، شعار عصري', payment_method: 'visa' },
        { id: '502', amount: '1500', status: 'unpaid', created_at: '2026-03-10', project_name: 'استضافة سنوية', brief: 'تجديد الاستضافة', payment_method: 'bank' },
    ];

    const orders = [
        { id: '1001', total_amount: '5000', status: 'paid', created_at: '2026-03-01', services_ordered: 'هوية بصرية كاملة', payment_method: 'visa' },
    ];

    const messages = [
        { id: 1, text: 'أهلاً بك! كيف يمكننا مساعدتك اليوم؟', isMe: false, time: '10:00 AM' },
        { id: 2, text: 'متى سيتم تسليم الشعار المبدئي؟', isMe: true, time: '10:05 AM' },
    ];

    // تأثير Scroll Reveal
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => { 
                if (entry.isIntersecting) { 
                    entry.target.classList.add('is-visible'); 
                } 
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.reveal-up').forEach((el) => { observer.observe(el); });
    }, [isLoggedIn, authView]);

    // معالجة الدخول (وهمي)
    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setAuthView('login');
    };

    // دوال مساعدة للعرض
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

    const getPaymentIcon = (method) => {
        const map = {
            'visa': <><i className="fa-solid fa-credit-card text-blue-500 ml-1"></i> فيزا / ماستر</>,
            'vodafone': <><i className="fa-solid fa-mobile-screen text-red-500 ml-1"></i> محفظة إلكترونية</>,
            'fawry': <><i className="fa-solid fa-store text-yellow-500 ml-1"></i> منافذ فوري</>,
            'bank': <><i className="fa-solid fa-building-columns text-stone-500 ml-1"></i> تحويل بنكي</>
        };
        return map[method] || map['bank'];
    };

    // === الشاشات (Views) ===

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

                    {authView === 'reset' && (
                        <div className="apple-card p-8 md:p-12 max-w-md mx-auto shadow-xl reveal-up">
                            <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <i className="fa-solid fa-envelope-open-text text-xl text-stone-400"></i>
                            </div>
                            <h2 className="text-2xl font-black text-[#44403c] text-center mb-4 tracking-tighter">استعادة الحساب</h2>
                            <p className="text-[10px] text-stone-400 font-bold text-center mb-8">أدخل بريدك الإلكتروني وسنرسل لك رابطاً لاستعادة الوصول.</p>
                            <form onSubmit={(e) => { e.preventDefault(); alert('تم إرسال الرابط الوهمي!'); setAuthView('login'); }} className="space-y-5">
                                <input type="email" placeholder="بريدك المسجل" required className="apple-input text-right" />
                                <button type="submit" className="btn-capsule w-full py-4 bg-[#44403c] text-white text-sm">إرسال رابط الاستعادة</button>
                                <button type="button" onClick={() => setAuthView('login')} className="w-full text-center text-stone-400 text-xs font-bold mt-4 bg-transparent border-none cursor-pointer">العودة لتسجيل الدخول</button>
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
                
                {/* الهيدر العلوي والأزرار */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6 reveal-up">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-[#44403c] tracking-tighter">أهلاً، <span className="text-[#c2410c]">{user.full_name}</span></h1>
                        <p className="text-stone-500 mt-3 font-bold text-sm uppercase tracking-widest">إليك السجل المالي والتقني لمشاريعك في Micro Ads.</p>
                    </div>
                    <div className="flex flex-wrap gap-3 w-full md:w-auto">
                        {user.client_folder_link && (
                            <a href={user.client_folder_link} target="_blank" rel="noreferrer" className="btn-capsule px-6 py-4 bg-[#0284c7] text-white hover:bg-[#0369a1] text-[11px] no-underline">
                                <i className="fa-solid fa-folder-open ml-1"></i> مجلد العميل
                            </a>
                        )}
                        <button onClick={() => setActiveModal('chat')} className="btn-capsule px-6 py-4 bg-[#c2410c] text-white hover:bg-[#a33509] text-[11px]">
                            <i className="fa-solid fa-comments ml-1"></i> تواصل مع الدعم
                        </button>
                        <button onClick={() => setActiveModal('profile')} className="btn-capsule px-6 py-4 bg-white border-2 border-[#e7e5e4] text-[#44403c] hover:border-[#c2410c] hover:text-[#c2410c] text-[11px]">
                            <i className="fa-solid fa-user-pen ml-1"></i> إعدادات الشركة
                        </button>
                        <button onClick={handleLogout} className="btn-capsule px-6 py-4 bg-[#fff1f2] border-2 border-[#ffe4e6] text-[#e11d48] hover:bg-[#e11d48] hover:text-white text-[11px]">
                            خروج
                        </button>
                    </div>
                </div>

                {/* قسم المشاريع */}
                <h3 className="text-2xl font-black text-[#44403c] mb-6 reveal-up"><i className="fa-solid fa-folder-tree text-[#c2410c] ml-2"></i> مشاريعك الحالية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 reveal-up">
                    {projects.map(p => {
                        const status = getStatusInfo(p.status);
                        const barColor = p.progress === 100 ? 'bg-green-500' : (p.progress > 50 ? 'bg-blue-500' : 'bg-orange-500');
                        return (
                            <div key={p.id} className="apple-card p-8 flex flex-col justify-between h-full shadow-sm border-t-4 border-t-[#c2410c]">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`status-badge ${status.class}`}>{status.text}</span>
                                        <span className="text-stone-400 text-[10px] font-bold">تسليم {p.deadline}</span>
                                    </div>
                                    <h3 className="text-lg font-black text-[#44403c] mb-6 tracking-tighter">{p.title}</h3>
                                    
                                    <div className="mb-4">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[10px] font-black text-stone-500 uppercase">نسبة الإنجاز</span>
                                            <span className="text-xs font-black text-[#c2410c]">{p.progress}%</span>
                                        </div>
                                        <div className="w-full bg-stone-100 rounded-full h-2">
                                            <div className={`${barColor} h-2 rounded-full transition-all duration-1000`} style={{ width: `${p.progress}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                                
                                <button onClick={() => { setSelectedData(p); setActiveModal('project'); }} className="btn-capsule w-full py-3 bg-[#fdfbf7] border border-stone-200 text-[11px] font-black text-[#44403c] mt-4 hover:bg-stone-100 transition-colors">
                                    <i className="fa-solid fa-eye text-[#c2410c] ml-1"></i> عرض التفاصيل
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* قسم الفواتير */}
                <h3 className="text-2xl font-black text-[#44403c] mb-6 reveal-up border-t border-stone-200 pt-16"><i className="fa-solid fa-file-invoice-dollar text-[#c2410c] ml-2"></i> الفواتير المالية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 reveal-up">
                    {invoices.map(inv => {
                        const status = getStatusInfo(inv.status);
                        return (
                            <div key={inv.id} className="apple-card p-6 flex flex-col justify-between shadow-sm">
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center text-xl border border-stone-100">
                                            <i className={`fa-solid ${status.icon} ${inv.status === 'paid' ? 'text-green-500' : 'text-red-500'}`}></i>
                                        </div>
                                        <div>
                                            <h4 className="font-black text-[#44403c] text-lg">{inv.amount} ج.م</h4>
                                            <p className="text-[10px] font-bold text-stone-400">#{inv.id} • {inv.created_at}</p>
                                        </div>
                                    </div>
                                    <span className={`status-badge ${status.class}`}>{status.text}</span>
                                </div>
                                <button onClick={() => { setSelectedData(inv); setActiveModal('invoice'); }} className="btn-capsule w-full py-3 bg-[#fdfbf7] border border-stone-200 text-[11px] font-black text-[#44403c] hover:bg-stone-100 transition-colors">
                                    <i className="fa-solid fa-file-invoice ml-1 text-[#c2410c]"></i> عرض الفاتورة
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* المودالات (النوافذ المنبثقة) */}
                {/* 1. مودال تفاصيل المشروع */}
                {activeModal === 'project' && selectedData && (
                    <div className="fixed inset-0 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm z-[3000]" onClick={() => setActiveModal(null)}>
                        <div className="apple-card w-full max-w-lg p-0 overflow-hidden shadow-2xl relative max-h-[95vh] overflow-y-auto custom-scrollbar bg-white" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => setActiveModal(null)} className="absolute top-4 left-4 w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center text-stone-600 hover:text-red-500 z-10 transition-colors border-none cursor-pointer"><i className="fa-solid fa-xmark"></i></button>
                            <div className="bg-stone-50 p-6 text-center border-b border-stone-200">
                                <div className="w-16 h-16 bg-white border border-stone-200 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm"><i className="fa-solid fa-bars-progress text-3xl text-[#c2410c]"></i></div>
                                <h3 className="font-black text-xl text-[#44403c]">تفاصيل المشروع <span className="text-[#c2410c]">#{selectedData.id}</span></h3>
                                <span className={`mt-2 inline-block status-badge ${getStatusInfo(selectedData.status).class}`}>{getStatusInfo(selectedData.status).text}</span>
                            </div>
                            <div className="p-6 space-y-4 text-sm font-bold text-[#44403c] bg-white text-right">
                                <div className="border-b border-stone-100 pb-4">
                                    <span className="text-[10px] text-stone-400 block uppercase mb-1">اسم المشروع</span>
                                    <span className="text-sm text-[#c2410c] font-black">{selectedData.title}</span>
                                </div>
                                <div className="border-b border-stone-100 pb-4">
                                    <span className="text-[10px] text-blue-500 block uppercase mb-2 font-black"><i className="fa-solid fa-clipboard-list"></i> متطلباتك (البريف الأصلي)</span>
                                    <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl text-xs leading-relaxed max-h-40 overflow-y-auto custom-scrollbar whitespace-pre-line">{selectedData.brief || 'لا يوجد بريف'}</div>
                                </div>
                                {selectedData.project_link && (
                                    <div className="border-b border-stone-100 pb-4 text-center mt-2">
                                        <a href={selectedData.project_link} target="_blank" rel="noreferrer" className="inline-block px-6 py-3 bg-[#0284c7] text-white rounded-full text-xs font-bold hover:bg-[#0369a1] transition-colors no-underline">
                                            <i className="fa-solid fa-cloud-arrow-down ml-1"></i> اضغط هنا لعرض الملفات
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. مودال الدردشة */}
                {activeModal === 'chat' && (
                    <div className="fixed inset-0 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-md z-[3000]" onClick={() => setActiveModal(null)}>
                        <div className="apple-card w-full max-w-lg bg-white shadow-2xl overflow-hidden flex flex-col h-[80vh] md:h-[600px]" onClick={(e) => e.stopPropagation()}>
                            <div className="p-5 border-b border-stone-200 bg-[#fdfbf7] flex justify-between items-center z-10">
                                <h3 className="font-black text-[#44403c]"><i className="fa-solid fa-headset text-[#c2410c] ml-2"></i> مركز دعم Micro Ads</h3>
                                <button onClick={() => setActiveModal(null)} className="text-stone-400 hover:text-red-500 border-none bg-transparent cursor-pointer"><i className="fa-solid fa-xmark text-xl"></i></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 flex flex-col bg-stone-50/50 custom-scrollbar">
                                {messages.map(msg => (
                                    <div key={msg.id} className="flex flex-col w-full">
                                        <div className={`chat-bubble ${msg.isMe ? 'chat-me' : 'chat-admin'}`}>
                                            {msg.text}
                                            <span className={`block mt-1 text-[9px] opacity-70 font-bold ${msg.isMe ? 'text-orange-100' : 'text-stone-400'}`}>{msg.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 bg-white border-t border-stone-200">
                                <form onSubmit={(e) => e.preventDefault()} className="flex gap-3">
                                    <input type="text" placeholder="اكتب رسالتك للإدارة..." className="flex-1 bg-stone-100 border-none rounded-2xl px-5 font-bold text-sm outline-none focus:ring-2 focus:ring-[#c2410c]/20 transition-all text-right" />
                                    <button type="submit" className="w-12 h-12 bg-[#c2410c] text-white rounded-2xl flex items-center justify-center hover:bg-[#a33509] transition-all shadow-md active:scale-95 flex-shrink-0 border-none cursor-pointer">
                                        <i className="fa-solid fa-paper-plane"></i>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. مودال الإعدادات */}
                {activeModal === 'profile' && (
                     <div className="fixed inset-0 flex items-start md:items-center justify-center p-4 pt-24 md:pt-4 bg-stone-900/60 backdrop-blur-sm z-[3000] overflow-y-auto custom-scrollbar" onClick={() => setActiveModal(null)}>
                        <div className="apple-card w-full max-w-3xl my-8 shadow-2xl overflow-hidden bg-white" onClick={(e) => e.stopPropagation()}>
                            <div className="bg-[#c2410c] p-6 flex justify-between items-center text-white">
                                <h2 className="text-xl font-black tracking-tighter"><i className="fa-solid fa-building ml-2"></i> ملف الشركة والبيانات</h2>
                                <button onClick={() => setActiveModal(null)} className="hover:text-orange-200 transition-colors border-none bg-transparent cursor-pointer"><i className="fa-solid fa-xmark text-2xl"></i></button>
                            </div>
                            <form onSubmit={(e) => { e.preventDefault(); alert('تم الحفظ بنجاح'); setActiveModal(null); }} className="p-6 md:p-8 text-right">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-stone-400 uppercase">الاسم بالكامل</label>
                                        <input type="text" defaultValue={user.full_name} className="apple-input text-right" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-stone-400 uppercase">اسم الشركة</label>
                                        <input type="text" defaultValue={user.company_name} className="apple-input text-right" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-stone-400 uppercase">المدينة / الدولة</label>
                                        <input type="text" defaultValue={user.city} className="apple-input text-right" />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button type="submit" className="btn-capsule flex-1 py-4 bg-[#c2410c] text-white hover:bg-[#a33509] shadow-lg text-sm">حفظ التعديلات</button>
                                </div>
                            </form>
                        </div>
                     </div>
                )}

            </section>
        </main>
    );
}

// دالة التغليف النهائية المطلوبة لـ Next.js
export default function AccountPage() {
    return (
        <Suspense fallback={<div className="pt-32 pb-40 text-center font-bold text-[#c2410c]">جاري تحميل البيانات...</div>}>
            <AccountContent />
        </Suspense>
    );
}
