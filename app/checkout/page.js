"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const router = useRouter();
    
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    // محاكاة لبيانات المستخدم المسجل (سيتم استبدالها لاحقاً ببيانات من الـ API)
    // لتجربة صفحة تسجيل الدخول، يمكنك تغيير isLoggedIn إلى false
    const [user, setUser] = useState({
        isLoggedIn: true, 
        full_name: 'محمد عيسى',
        email: 'mohamed@example.com',
        phone: '01000000000'
    });

    // محاكاة قاعدة البيانات لجلب أسعار الخدمات بناءً على الـ ID الموجود في السلة
    const dummyDatabase = {
        '1': { price: 5000 }, '2': { price: 3500 }, '3': { price: 4000 },
        '4': { price: 2500 }, '5': { price: 1500 }, '6': { price: 4500 }, '7': { price: 3000 }
    };

    useEffect(() => {
        // 1. التحقق من تسجيل الدخول
        if (!user.isLoggedIn) {
            router.push('/account');
            return;
        }

        // 2. التحقق من السلة
        const savedCart = JSON.parse(localStorage.getItem('micro_ads_cart')) || [];
        if (savedCart.length === 0) {
            router.push('/services');
            return;
        }

        // 3. حساب الإجمالي
        let total = 0;
        savedCart.forEach(item => {
            const dbItem = dummyDatabase[item.id];
            if (dbItem) {
                total += dbItem.price;
            }
        });

        setCart(savedCart);
        setTotalPrice(total);
        setIsLoaded(true);
    }, [user.isLoggedIn, router]);

    const handleSubmitOrder = (e) => {
        e.preventDefault();
        // هنا سيتم إرسال البيانات إلى الـ API الخاص بك لمعالجة الدفع عبر Paymob لاحقاً
        alert(`جاري توجيهك لبوابة الدفع الإلكتروني لدفع مبلغ ${totalPrice} ج.م...`);
        // router.push('/api/process_final_order');
    };

    if (!isLoaded) return <div className="min-h-screen flex items-center justify-center font-bold text-stone-400">جاري تأمين صفحة الدفع...</div>;

    return (
        <main className="pt-[110px] pb-10 md:pt-20 md:pb-20 px-4">
            <div className="max-w-6xl mx-auto mt-8 md:mt-0">
                <h1 className="text-3xl md:text-4xl font-black text-[#44403c] mb-10 text-center uppercase tracking-tighter">إتمام التعاقد والدفع</h1>

                <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* بيانات مخفية لإرسالها مع الفورم (إذا احتجت لاستخدامها لاحقاً في Next.js Forms) */}
                    <input type="hidden" name="customer_name" value={user.full_name} />
                    <input type="hidden" name="customer_email" value={user.email} />
                    <input type="hidden" name="customer_phone" value={user.phone} />

                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white p-8 rounded-[2rem] border border-stone-200 shadow-sm">
                            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center text-sm">1</span>
                                وسيلة الدفع المتاحة
                            </h3>
                            
                            <div className="grid grid-cols-1 gap-4">
                                <label className="relative">
                                    <input type="radio" name="payment_method" value="visa" className="hidden peer" defaultChecked />
                                    <div className="payment-option p-6 rounded-2xl text-center">
                                        <div className="text-3xl mb-2">💳</div>
                                        <span className="font-black text-base block">الدفع بالبطاقة البنكية (Visa / Mastercard)</span>
                                        <p className="text-[10px] text-stone-500 mt-2 font-bold">دفع آمن ومشفّر 100% عبر بوابة Paymob</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4">
                        <div className="bg-stone-800 p-8 rounded-[2.5rem] text-white sticky top-24 shadow-xl">
                            <h3 className="text-xl font-black mb-6 border-b border-stone-700 pb-4">ملخص الفاتورة</h3>
                            
                            <div className="border-t border-stone-700 pt-6 mb-8 flex justify-between items-center">
                                <span className="font-bold text-stone-400 text-sm">الإجمالي النهائي:</span>
                                <span className="text-3xl font-black text-orange-500">{totalPrice.toLocaleString()} ج.م</span>
                            </div>

                            <button type="submit" className="w-full py-5 bg-[#c2410c] text-white font-black rounded-2xl hover:brightness-110 transition-all text-lg shadow-lg cursor-pointer border-none">
                                تأكيد الطلب والدفع
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        </main>
    );
}