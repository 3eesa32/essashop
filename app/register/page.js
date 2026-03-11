"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();

    // حالات الصفحة
    const [step, setStep] = useState('form'); // 'form' | 'otp'
    const [formData, setFormData] = useState({ full_name: '', email: '', phone: '', password: '' });
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // تحديث البيانات عند الكتابة في الحقول
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 1. معالجة إرسال فورم التسجيل
    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        setError('');
        
        // محاكاة الاتصال بالخادم والتحقق (استبدل هذا بطلب الـ API لاحقاً)
        if (formData.email === 'test@test.com') {
            setError('هذا البريد الإلكتروني مسجل لدينا بالفعل، جرب تسجيل الدخول.');
            return;
        }

        // إذا نجحنا وتم إرسال الإيميل، نعرض نافذة الـ OTP
        setStep('otp');
    };

    // 2. معالجة التحقق من الـ OTP
    const handleOtpSubmit = (e) => {
        e.preventDefault();
        setError('');
        
        // محاكاة التحقق من الكود (الكود الوهمي هنا هو 123456)
        if (otp === '123456') {
            setSuccess('تم إنشاء حسابك وتفعيله بنجاح. جاري توجيهك...');
            setTimeout(() => {
                router.push('/account');
            }, 2000);
        } else {
            setError('كود التحقق غير صحيح، يرجى مراجعة بريدك الإلكتروني.');
        }
    };

    // 3. التراجع وتصحيح البيانات
    const handleCancelOtp = () => {
        setStep('form');
        setOtp('');
        setError('');
    };

    return (
        <main className="pt-32 pb-20 px-6 relative min-h-screen">
            <section className="max-w-6xl mx-auto text-right">
                
                {/* فورم التسجيل الأساسي */}
                <div className="custom-card p-8 md:p-12 rounded-[2.5rem] max-w-md mx-auto shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-200">
                             <i className="fa-solid fa-user-plus text-2xl text-[#c2410c]"></i>
                        </div>
                        <h2 className="text-3xl font-black text-[#44403c]">حساب جديد</h2>
                        <p className="text-stone-400 text-[10px] mt-2 font-black uppercase tracking-widest text-center">Join Micro Ads Elite</p>
                    </div>

                    {/* رسائل الخطأ والنجاح العامة للفورم */}
                    {error && step === 'form' && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-6 text-center text-xs font-bold">{error}</div>}
                    
                    <form onSubmit={handleRegisterSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-stone-400 mr-2 uppercase tracking-widest block">الاسم الكامل</label>
                            <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="اكتب اسمك هنا" required 
                                   className="w-full bg-stone-50 border border-stone-200 p-5 rounded-2xl text-[#44403c] outline-none focus:border-[#c2410c] text-right transition-all font-bold text-sm" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-stone-400 mr-2 uppercase tracking-widest block">البريد الإلكتروني</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@mail.com" required dir="ltr"
                                   className="w-full bg-stone-50 border border-stone-200 p-5 rounded-2xl text-[#44403c] outline-none focus:border-[#c2410c] text-left transition-all font-bold text-sm" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-stone-400 mr-2 uppercase tracking-widest block">رقم الهاتف</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+20 1X XXXX XXXX" required dir="ltr"
                                   className="w-full bg-stone-50 border border-stone-200 p-5 rounded-2xl text-[#44403c] outline-none focus:border-[#c2410c] text-left transition-all font-bold text-sm" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-stone-400 mr-2 uppercase tracking-widest block">كلمة المرور</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required dir="ltr"
                                   className="w-full bg-stone-50 border border-stone-200 p-5 rounded-2xl text-[#44403c] outline-none focus:border-[#c2410c] text-left transition-all font-bold text-sm" />
                        </div>
                        
                        <button type="submit" className="w-full py-5 bg-[#c2410c] rounded-2xl font-black text-white hover:brightness-110 transition-all shadow-xl shadow-orange-900/10 uppercase active:scale-95 border-none cursor-pointer">
                            إنشاء الحساب الآن
                        </button>
                    </form>
                    
                    <div className="pt-6 text-center border-t border-stone-100 mt-6">
                        <p className="text-stone-400 text-[10px] font-black uppercase mb-3">لديك حساب بالفعل؟</p>
                        <Link href="/account" className="text-[#c2410c] font-black hover:underline text-xs uppercase tracking-widest">
                            تسجيل الدخول
                        </Link>
                    </div>
                </div>

            </section>

            {/* نافذة التحقق من البريد (OTP Modal) */}
            {step === 'otp' && (
                <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 glass-blur">
                    <div className="bg-white border border-stone-200 w-full max-w-lg rounded-[3rem] p-10 md:p-14 relative shadow-2xl text-right">
                        <div className="text-center mb-10">
                            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-orange-200">
                                 <i className="fa-solid fa-envelope-circle-check text-2xl text-[#c2410c]"></i>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black text-[#44403c] uppercase tracking-tighter mb-4">تحقق من بريدك الإلكتروني</h2>
                            <p className="text-stone-500 font-bold leading-relaxed text-sm">
                                لقد أرسلنا كود التحقق (OTP) إلى بريدك الإلكتروني: <b className="text-stone-800">{formData.email}</b>. يرجى إدخال الكود لإتمام التسجيل.
                                <br/><span className="text-[10px] text-[#c2410c]"> (للتجربة، الكود الوهمي هو: 123456) </span>
                            </p>
                        </div>
                        
                        {/* رسائل الخطأ والنجاح الخاصة بالـ OTP */}
                        {error && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-6 text-center text-xs font-bold">{error}</div>}
                        {success && <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-xl mb-6 text-center text-xs font-bold">{success}</div>}

                        <form onSubmit={handleOtpSubmit} className="space-y-6">
                            <input type="text" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="000000" required dir="ltr"
                                   className="w-full bg-stone-50 border border-stone-200 p-6 rounded-2xl text-[#44403c] outline-none focus:border-[#c2410c] text-center font-black text-2xl tracking-[1rem] otp-input-field" />
                            
                            <button type="submit" className="w-full py-5 bg-[#c2410c] text-white font-black rounded-2xl hover:brightness-110 transition-all shadow-xl shadow-orange-900/10 uppercase active:scale-95 border-none cursor-pointer">
                                تفعيل الحساب والدخول
                            </button>

                            <div className="pt-4 text-center">
                                <p className="text-[10px] font-black text-stone-400 uppercase">لم يصلك الكود؟</p>
                                <button type="button" onClick={handleCancelOtp} className="text-[#c2410c] font-black text-xs hover:underline uppercase bg-transparent border-none cursor-pointer">
                                    إعادة المحاولة أو تصحيح البريد
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}