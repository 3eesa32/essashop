use client;
import React, { useState, useEffect } from 'react';
import Link from 'nextlink';
import { useSearchParams } from 'nextnavigation';

export default function AccountPage() {
    const searchParams = useSearchParams();
    
     حالات المصادقة (Authentication)
    const [isLoggedIn, setIsLoggedIn] = useState(false);  اجعلها true لتجربة شكل لوحة التحكم
    const [authView, setAuthView] = useState('login');  'login'  'reset'  'new_password'
    
     بيانات العميل الوهمية (للتجربة)
    const [user, setUser] = useState({
        full_name 'محمد عيسى',
        email 'mohamed@example.com',
        phone '01000000000',
        client_folder_link 'httpsdrive.google.com...',
        company_name 'شركة مايكرو أدز',
        city 'القاهرة، مصر',
        business_type 'تقنية وبرمجيات',
        preferred_contact 'whatsapp'
    });

     حالات النوافذ المنبثقة (Modals)
    const [activeModal, setActiveModal] = useState(null);  'project', 'invoice', 'profile', 'chat', null
    const [selectedData, setSelectedData] = useState(null);  لتمرير بيانات المشروع أو الفاتورة للمودال

     محاكاة قواعد البيانات
    const projects = [
        { id '101', title 'هوية بصرية كاملة', status 'in_progress', progress 60, deadline '2026-04-15', client_name 'محمد عيسى', notes 'جاري العمل على الشعار.', brief 'ألوان دافئة، شعار عصري.', project_link '' },
        { id '102', title 'تصميم موقع إلكتروني', status 'pending', progress 0, deadline 'غير محدد', client_name 'محمد عيسى', notes '', brief 'موقع تعريفي للشركة.', project_link '' },
        { id '100', title 'حملة إعلانية', status 'completed', progress 100, deadline '2026-02-01', client_name 'محمد عيسى', notes 'تم التسليم.', brief 'حملة لزيادة المبيعات.', project_link 'httpsexample.comfiles' },
    ];

    const invoices = [
        { id '501', amount '5000', status 'paid', created_at '2026-03-01', project_name 'هوية بصرية كاملة', brief 'ألوان دافئة، شعار عصري', payment_method 'visa' },
        { id '502', amount '1500', status 'unpaid', created_at '2026-03-10', project_name 'استضافة سنوية', brief 'تجديد الاستضافة', payment_method 'bank' },
    ];

    const orders = [
        { id '1001', total_amount '5000', status 'paid', created_at '2026-03-01', services_ordered 'هوية بصرية كاملة', payment_method 'visa' },
    ];

    const messages = [
        { id 1, text 'أهلاً بك! كيف يمكننا مساعدتك اليوم؟', isMe false, time '1000 AM' },
        { id 2, text 'متى سيتم تسليم الشعار المبدئي؟', isMe true, time '1005 AM' },
    ];

     تأثير Scroll Reveal
    useEffect(() = {
        const observer = new IntersectionObserver((entries) = {
            entries.forEach(entry = { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); } });
        }, { threshold 0.1 });
        document.querySelectorAll('.reveal-up').forEach((el) = { observer.observe(el); });
    }, [isLoggedIn, authView]);

     معالجة الدخول (وهمي)
    const handleLogin = (e) = {
        e.preventDefault();
        setIsLoggedIn(true);
    };

    const handleLogout = () = {
        setIsLoggedIn(false);
        setAuthView('login');
    };

     دوال مساعدة للعرض
    const getStatusInfo = (status) = {
        const map = {
            'pending' { text 'في الانتظار', class 'status-pending', icon 'fa-hourglass-start' },
            'in_progress' { text 'قيد التنفيذ', class 'status-processing', icon 'fa-spinner' },
            'review' { text 'مراجعة', class 'status-review', icon 'fa-clock' },
            'completed' { text 'مكتمل', class 'status-completed', icon 'fa-check-circle' },
            'paid' { text 'تم الدفع', class 'status-paid', icon 'fa-check-circle' },
            'unpaid' { text 'بانتظار الدفع', class 'status-unpaid', icon 'fa-clock' }
        };
        return map[status]  map['pending'];
    };

    const getPaymentIcon = (method) = {
        const map = {
            'visa' i className=fa-solid fa-credit-card text-blue-500 ml-1i فيزا  ماستر,
            'vodafone' i className=fa-solid fa-mobile-screen text-red-500 ml-1i محفظة إلكترونية,
            'fawry' i className=fa-solid fa-store text-yellow-500 ml-1i منافذ فوري,
            'bank' i className=fa-solid fa-building-columns text-stone-500 ml-1i تحويل بنكي
        };
        return map[method]  map['bank'];
    };

     === الشاشات (Views) ===

    if (!isLoggedIn) {
        return (
            main className=pt-32 pb-40 px-4 mdpx-6 text-right
                section className=max-w-6xl mx-auto
                    {authView === 'login' && (
                        div className=apple-card p-8 mdp-12 max-w-md mx-auto shadow-xl reveal-up
                            div className=w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6
                                i className=fa-solid fa-user-shield text-2xl text-[#c2410c]i
                            div
                            h2 className=text-3xl font-black text-[#44403c] text-center mb-8 tracking-tighterتسجيل الدخولh2
                            form onSubmit={handleLogin} className=space-y-5
                                input type=email placeholder=البريد الإلكتروني required className=apple-input text-right 
                                input type=password placeholder=كلمة المرور required className=apple-input text-right 
                                button type=submit className=btn-capsule w-full py-4 bg-[#c2410c] text-white shadow-lg text-smدخول المنصةbutton
                                div className=flex justify-between items-center pt-4 px-2
                                    Link href=register className=text-[#c2410c] text-xs font-black hoverunderlineإنشاء حساب جديدLink
                                    button type=button onClick={() = setAuthView('reset')} className=text-stone-400 text-xs font-bold hovertext-[#c2410c] bg-transparent border-none cursor-pointerنسيت كلمة المرور؟button
                                div
                            form
                        div
                    )}

                    {authView === 'reset' && (
                        div className=apple-card p-8 mdp-12 max-w-md mx-auto shadow-xl reveal-up
                            div className=w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6
                                i className=fa-solid fa-envelope-open-text text-xl text-stone-400i
                            div
                            h2 className=text-2xl font-black text-[#44403c] text-center mb-4 tracking-tighterاستعادة الحسابh2
                            p className=text-[10px] text-stone-400 font-bold text-center mb-8أدخل بريدك الإلكتروني وسنرسل لك رابطاً لاستعادة الوصول.p
                            form onSubmit={(e) = { e.preventDefault(); alert('تم إرسال الرابط الوهمي!'); setAuthView('login'); }} className=space-y-5
                                input type=email placeholder=بريدك المسجل required className=apple-input text-right 
                                button type=submit className=btn-capsule w-full py-4 bg-[#44403c] text-white text-smإرسال رابط الاستعادةbutton
                                button type=button onClick={() = setAuthView('login')} className=w-full text-center text-stone-400 text-xs font-bold mt-4 bg-transparent border-none cursor-pointerالعودة لتسجيل الدخولbutton
                            form
                        div
                    )}
                section
            main
        );
    }

    return (
        main className=pt-32 pb-40 px-4 mdpx-6 text-right
            section className=max-w-6xl mx-auto
                
                { الهيدر العلوي والأزرار }
                div className=flex flex-col mdflex-row justify-between items-start mditems-center mb-16 gap-6 reveal-up
                    div
                        h1 className=text-3xl mdtext-5xl font-black text-[#44403c] tracking-tighterأهلاً، span className=text-[#c2410c]{user.full_name}spanh1
                        p className=text-stone-500 mt-3 font-bold text-sm uppercase tracking-widestإليك السجل المالي والتقني لمشاريعك في Micro Ads.p
                    div
                    div className=flex flex-wrap gap-3 w-full mdw-auto
                        {user.client_folder_link && (
                            a href={user.client_folder_link} target=_blank rel=noreferrer className=btn-capsule px-6 py-4 bg-[#0284c7] text-white hoverbg-[#0369a1] text-[11px] no-underline
                                i className=fa-solid fa-folder-openi مجلد العميل
                            a
                        )}
                        button onClick={() = setActiveModal('chat')} className=btn-capsule px-6 py-4 bg-[#c2410c] text-white hoverbg-[#a33509] text-[11px]
                            i className=fa-solid fa-commentsi تواصل مع الدعم
                        button
                        button onClick={() = setActiveModal('profile')} className=btn-capsule px-6 py-4 bg-white border-2 border-[#e7e5e4] text-[#44403c] hoverborder-[#c2410c] hovertext-[#c2410c] text-[11px]
                            i className=fa-solid fa-user-peni إعدادات الشركة
                        button
                        button onClick={handleLogout} className=btn-capsule px-6 py-4 bg-[#fff1f2] border-2 border-[#ffe4e6] text-[#e11d48] hoverbg-[#e11d48] hovertext-white text-[11px]
                            خروج
                        button
                    div
                div

                { قسم المشاريع }
                h3 className=text-2xl font-black text-[#44403c] mb-6 reveal-upi className=fa-solid fa-folder-tree text-[#c2410c] ml-2i مشاريعك الحاليةh3
                div className=grid grid-cols-1 mdgrid-cols-2 lggrid-cols-3 gap-8 mb-16 reveal-up
                    {projects.map(p = {
                        const status = getStatusInfo(p.status);
                        const barColor = p.progress === 100  'bg-green-500'  (p.progress  50  'bg-blue-500'  'bg-orange-500');
                        return (
                            div key={p.id} className=apple-card p-8 flex flex-col justify-between h-full shadow-sm border-t-4 border-t-[#c2410c]
                                div
                                    div className=flex justify-between items-start mb-4
                                        span className={`status-badge ${status.class}`}{status.text}span
                                        span className=text-stone-400 text-[10px] font-boldتسليم {p.deadline}span
                                    div
                                    h3 className=text-lg font-black text-[#44403c] mb-6 tracking-tighter{p.title}h3
                                    
                                    div className=mb-4
                                        div className=flex justify-between items-center mb-1
                                            span className=text-[10px] font-black text-stone-500 uppercaseنسبة الإنجازspan
                                            span className=text-xs font-black text-[#c2410c]{p.progress}%span
                                        div
                                        div className=w-full bg-stone-100 rounded-full h-2
                                            div className={`${barColor} h-2 rounded-full transition-all duration-1000`} style={{ width `${p.progress}%` }}div
                                        div
                                    div
                                    
                                    button onClick={() = { setSelectedData(p); setActiveModal('project'); }} className=btn-capsule w-full py-3 bg-[#fdfbf7] border border-stone-200 text-[11px] font-black text-[#44403c] mt-4 hoverbg-stone-100 transition-colors
                                        i className=fa-solid fa-eye text-[#c2410c] mr-1i عرض التفاصيل
                                    button
                                div
                            div
                        );
                    })}
                div

                { قسم الفواتير }
                h3 className=text-2xl font-black text-[#44403c] mb-6 reveal-up border-t border-stone-200 pt-16i className=fa-solid fa-file-invoice-dollar text-[#c2410c] ml-2i الفواتير الماليةh3
                div className=grid grid-cols-1 mdgrid-cols-2 lggrid-cols-3 gap-8 mb-16 reveal-up
                    {invoices.map(inv = {
                        const status = getStatusInfo(inv.status);
                        return (
                            div key={inv.id} className=apple-card p-6 flex flex-col justify-between shadow-sm
                                div className=flex items-center justify-between mb-5
                                    div className=flex items-center gap-4
                                        div className=w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center text-xl border border-stone-100
                                            i className={`fa-solid ${status.icon} ${inv.status === 'paid'  'text-green-500'  'text-red-500'}`}i
                                        div
                                        div
                                            h4 className=font-black text-[#44403c] text-lg{inv.amount} ج.مh4
                                            p className=text-[10px] font-bold text-stone-400#{inv.id} • {inv.created_at}p
                                        div
                                    div
                                    span className={`status-badge ${status.class}`}{status.text}span
                                div
                                button onClick={() = { setSelectedData(inv); setActiveModal('invoice'); }} className=btn-capsule w-full py-3 bg-[#fdfbf7] border border-stone-200 text-[11px] font-black text-[#44403c] hoverbg-stone-100 transition-colors
                                    i className=fa-solid fa-file-invoice mr-1 text-[#c2410c]i عرض الفاتورة
                                button
                            div
                        );
                    })}
                div

                { المودالات (النوافذ المنبثقة) }
                { 1. مودال تفاصيل المشروع }
                {activeModal === 'project' && selectedData && (
                    div className=fixed inset-0 flex items-center justify-center p-4 bg-stone-90060 backdrop-blur-sm z-[3000] onClick={() = setActiveModal(null)}
                        div className=apple-card w-full max-w-lg p-0 overflow-hidden shadow-2xl relative max-h-[95vh] overflow-y-auto custom-scrollbar bg-white onClick={(e) = e.stopPropagation()}
                            button onClick={() = setActiveModal(null)} className=absolute top-4 left-4 w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center text-stone-600 hovertext-red-500 z-10 transition-colors border-none cursor-pointeri className=fa-solid fa-xmarkibutton
                            div className=bg-stone-50 p-6 text-center border-b border-stone-200
                                div className=w-16 h-16 bg-white border border-stone-200 rounded-full flex items-center justify-center mx-auto mb-3 shadow-smi className=fa-solid fa-bars-progress text-3xl text-[#c2410c]idiv
                                h3 className=font-black text-xl text-[#44403c]تفاصيل المشروع span className=text-[#c2410c]#{selectedData.id}spanh3
                                span className={`mt-2 inline-block status-badge ${getStatusInfo(selectedData.status).class}`}{getStatusInfo(selectedData.status).text}span
                            div
                            div className=p-6 space-y-4 text-sm font-bold text-[#44403c] bg-white text-right
                                div className=border-b border-stone-100 pb-4
                                    span className=text-[10px] text-stone-400 block uppercase mb-1اسم المشروعspan
                                    span className=text-sm text-[#c2410c] font-black{selectedData.title}span
                                div
                                div className=border-b border-stone-100 pb-4
                                    span className=text-[10px] text-blue-500 block uppercase mb-2 font-blacki className=fa-solid fa-clipboard-listi متطلباتك (البريف الأصلي)span
                                    div className=p-4 bg-blue-5050 border border-blue-100 rounded-xl text-xs leading-relaxed max-h-40 overflow-y-auto custom-scrollbar whitespace-pre-line{selectedData.brief  'لا يوجد بريف'}div
                                div
                                {selectedData.project_link && (
                                    div className=border-b border-stone-100 pb-4 text-center mt-2
                                        a href={selectedData.project_link} target=_blank rel=noreferrer className=inline-block px-6 py-3 bg-[#0284c7] text-white rounded-full text-xs font-bold hoverbg-[#0369a1] transition-colors no-underline
                                            i className=fa-solid fa-cloud-arrow-down ml-1i اضغط هنا لعرض الملفات
                                        a
                                    div
                                )}
                            div
                        div
                    div
                )}

                { 2. مودال الدردشة }
                {activeModal === 'chat' && (
                    div className=fixed inset-0 flex items-center justify-center p-4 bg-stone-90040 backdrop-blur-md z-[3000] onClick={() = setActiveModal(null)}
                        div className=apple-card w-full max-w-lg bg-white shadow-2xl overflow-hidden flex flex-col h-[80vh] mdh-[600px] onClick={(e) = e.stopPropagation()}
                            div className=p-5 border-b border-stone-200 bg-[#fdfbf7] flex justify-between items-center z-10
                                h3 className=font-black text-[#44403c]i className=fa-solid fa-headset text-[#c2410c] ml-2i مركز دعم Micro Adsh3
                                button onClick={() = setActiveModal(null)} className=text-stone-400 hovertext-red-500 border-none bg-transparent cursor-pointeri className=fa-solid fa-xmark text-xlibutton
                            div
                            div className=flex-1 overflow-y-auto p-6 flex flex-col bg-stone-5050 custom-scrollbar
                                {messages.map(msg = (
                                    div key={msg.id} className=flex flex-col w-full
                                        div className={`chat-bubble ${msg.isMe  'chat-me'  'chat-admin'}`}
                                            {msg.text}
                                            span className={`block mt-1 text-[9px] opacity-70 font-bold ${msg.isMe  'text-orange-100'  'text-stone-400'}`}{msg.time}span
                                        div
                                    div
                                ))}
                            div
                            div className=p-4 bg-white border-t border-stone-200
                                form onSubmit={(e) = e.preventDefault()} className=flex gap-3
                                    input type=text placeholder=اكتب رسالتك للإدارة... className=flex-1 bg-stone-100 border-none rounded-2xl px-5 font-bold text-sm outline-none focusring-2 focusring-[#c2410c]20 transition-all text-right 
                                    button type=submit className=w-12 h-12 bg-[#c2410c] text-white rounded-2xl flex items-center justify-center hoverbg-[#a33509] transition-all shadow-md activescale-95 flex-shrink-0 border-none cursor-pointer
                                        i className=fa-solid fa-paper-planei
                                    button
                                form
                            div
                        div
                    div
                )}

                { 3. مودال الإعدادات }
                {activeModal === 'profile' && (
                     div className=fixed inset-0 flex items-start mditems-center justify-center p-4 pt-24 mdpt-4 bg-stone-90060 backdrop-blur-sm z-[3000] overflow-y-auto custom-scrollbar onClick={() = setActiveModal(null)}
                        div className=apple-card w-full max-w-3xl my-8 shadow-2xl overflow-hidden bg-white onClick={(e) = e.stopPropagation()}
                            div className=bg-[#c2410c] p-6 flex justify-between items-center text-white
                                h2 className=text-xl font-black tracking-tighteri className=fa-solid fa-building mr-2i ملف الشركة والبياناتh2
                                button onClick={() = setActiveModal(null)} className=hovertext-orange-200 transition-colors border-none bg-transparent cursor-pointeri className=fa-solid fa-xmark text-2xlibutton
                            div
                            form onSubmit={(e) = { e.preventDefault(); alert('تم الحفظ بنجاح'); setActiveModal(null); }} className=p-6 mdp-8 text-right
                                div className=grid grid-cols-1 mdgrid-cols-2 gap-6 mb-8
                                    div className=space-y-2
                                        label className=text-[10px] font-black text-stone-400 uppercaseالاسم بالكاملlabel
                                        input type=text defaultValue={user.full_name} className=apple-input text-right 
                                    div
                                    div className=space-y-2
                                        label className=text-[10px] font-black text-stone-400 uppercaseاسم الشركةlabel
                                        input type=text defaultValue={user.company_name} className=apple-input text-right 
                                    div
                                    div className=space-y-2
                                        label className=text-[10px] font-black text-stone-400 uppercaseالمدينة  الدولةlabel
                                        input type=text defaultValue={user.city} className=apple-input text-right 
                                    div
                                div
                                div className=flex gap-4
                                    button type=submit className=btn-capsule flex-1 py-4 bg-[#c2410c] text-white hoverbg-[#a33509] shadow-lg text-smحفظ التعديلاتbutton
                                div
                            form
                        div
                     div
                )}

            section
        main
    );
}