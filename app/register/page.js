"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        full_name: '', email: '', phone: '', 
        company_name: '', city: '', business_type: '', 
        preferred_contact: 'whatsapp'
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (data.success) {
                alert('تم إنشاء حسابك بنجاح!');
                window.location.href = '/account'; // توجيه للوحة التحكم
            } else {
                alert(data.error || 'حدث خطأ أثناء التسجيل');
            }
        } catch (err) {
            alert('فشل الاتصال بالسيرفر');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="pt-32 pb-20 px-6 min-h-screen bg-[#f5f5f4] text-right">
            <div className="max-w-2xl mx-auto apple-card p-8 md:p-12 shadow-xl bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -z-0"></div>
                
                <header className="relative z-10 mb-10">
                    <h1 className="text-3xl font-black text-[#44403c] tracking-tighter">انضم لعملاء Micro Ads</h1>
                    <p className="text-stone-400 font-bold mt-2">ابدأ رحلتك الإبداعية معنا اليوم</p>
                </header>

                <form onSubmit={handleSubmit} className="relative z-10 grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-stone-400 uppercase">الاسم بالكامل</label>
                        <input type="text" required className="apple-input" placeholder="محمد عيسى" 
                        onChange={e => setFormData({...formData, full_name: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-stone-400 uppercase">البريد الإلكتروني</label>
                        <input type="email" required className="apple-input" placeholder="mo@example.com"
                        onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-stone-400 uppercase">رقم الموبايل</label>
                        <input type="tel" required className="apple-input" placeholder="010..."
                        onChange={e => setFormData({...formData, phone: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-stone-400 uppercase">اسم الشركة / المشروع</label>
                        <input type="text" className="apple-input" placeholder="Micro Ads"
                        onChange={e => setFormData({...formData, company_name: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-stone-400 uppercase">المدينة / الدولة</label>
                        <input type="text" className="apple-input" placeholder="القاهرة، مصر"
                        onChange={e => setFormData({...formData, city: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-stone-400 uppercase">مجال العمل</label>
                        <input type="text" className="apple-input" placeholder="مطاعم / تقنية / تجارة"
                        onChange={e => setFormData({...formData, business_type: e.target.value})} />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-black text-stone-400 uppercase">وسيلة التواصل المفضلة</label>
                        <select className="apple-input" onChange={e => setFormData({...formData, preferred_contact: e.target.value})}>
                            <option value="whatsapp">واتساب</option>
                            <option value="email">البريد الإلكتروني</option>
                            <option value="phone">اتصال هاتفي</option>
                        </select>
                    </div>

                    <div className="md:col-span-2 pt-6">
                        <button type="submit" disabled={loading} className="btn-primary w-full bg-[#c2410c] text-lg py-5">
                            {loading ? 'جاري إنشاء حسابك...' : 'إنشاء الحساب والبدء'}
                        </button>
                        <p className="text-center text-xs font-bold text-stone-400 mt-6">
                            لديك حساب بالفعل؟ <Link href="/account" className="text-[#c2410c] hover:underline">سجل دخول من هنا</Link>
                        </p>
                    </div>
                </form>
            </div>
        </main>
    );
}