"use client";
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

// 1. المكون الداخلي اللي فيه كل الشغل
function CartContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    // حالة السلة والبيانات
    const [cart, setCart] = useState([]);
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        email: '',
        phone: '',
        brief: ''
    });
    const [loading, setLoading] = useState(false);

    // جلب البيانات من LocalStorage عند تحميل الصفحة
    useEffect(() => {
        const savedCart = localStorage.getItem('micro_ads_cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // حساب الإجمالي
    const total = cart.reduce((acc, item) => acc + Number(item.price), 0);

    // حذف عنصر من السلة
    const removeItem = (id) => {
        const updatedCart = cart.filter(item => item.id !== id);
        setCart(updatedCart);
        localStorage.setItem('micro_ads_cart', JSON.stringify(updatedCart));
    };

    // إرسال الطلب وبدء الدفع
    const handleCheckout = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName: customerInfo.name,
                    customerEmail: customerInfo.email,
                    customerPhone: customerInfo.phone,
                    projectBrief: customerInfo.brief,
                    cartIds: cart.map(item => item.id)
                })
            });

            const data = await response.json();
            if (data.redirectUrl) {
                // مسح السلة بعد نجاح التوجيه للدفع
                localStorage.removeItem('micro_ads_cart');
                window.location.href = data.redirectUrl;
            } else {
                alert(data.error || "حدث خطأ أثناء إعداد الطلب");
            }
        } catch (error) {
            console.error("Checkout Error:", error);
            alert("فشل الاتصال بالسيرفر");
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <main className="pt-40 pb-40 px-6 text-center">
                <div className="max-w-md mx-auto apple-card p-12 shadow-sm">
                    <i className="fa-solid fa-cart-shopping text-5xl text-stone-200 mb-6 block"></i>
                    <h2 className="text-2xl font-black text-[#44403c] mb-4">سلة المشروعات فارغة</h2>
                    <p className="text-stone-400 mb-8 font-bold">ابدأ باختيار الخدمات التي تناسب طموحات مشروعك.</p>
                    <Link href="/services" className="btn-apple btn-primary w-full">تصفح الخدمات</Link>
                </div>
            </main>
        );
    }

    return (
        <main className="pt-32 pb-40 px-4 md:px-6 text-right bg-[#f5f5f4] min-h-screen">
            <section className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8">
                
                {/* قائمة المشتريات */}
                <div className="lg:col-span-7 space-y-4">
                    <h1 className="text-3xl font-black text-[#44403c] mb-8">سلة المشروعات <span className="text-[#c2410c]">({cart.length})</span></h1>
                    {cart.map((item) => (
                        <div key={item.id} className="apple-card p-6 flex justify-between items-center shadow-sm hover:border-[#c2410c] transition-all bg-white">
                            <div className="flex gap-4 items-center">
                                <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center text-[#c2410c] font-black">
                                    <i className="fa-solid fa-briefcase"></i>
                                </div>
                                <div>
                                    <h3 className="font-black text-[#44403c]">{item.title}</h3>
                                    <p className="text-xs text-stone-400 font-bold">{item.category}</p>
                                </div>
                            </div>
                            <div className="text-left">
                                <p className="font-black text-[#c2410c] mb-2">{item.price} ج.م</p>
                                <button onClick={() => removeItem(item.id)} className="text-red-400 text-xs hover:text-red-600 transition-colors bg-transparent border-none cursor-pointer">
                                    <i className="fa-solid fa-trash-can"></i> حذف
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* تفاصيل التعاقد والدفع */}
                <div className="lg:col-span-5">
                    <div className="apple-card p-8 shadow-xl sticky top-32 bg-white">
                        <h3 className="text-xl font-black text-[#44403c] mb-6 border-b border-stone-100 pb-4">بيانات التعاقد</h3>
                        <form onSubmit={handleCheckout} className="space-y-4">
                            <input 
                                type="text" placeholder="الاسم الكامل للعميل" required 
                                className="apple-input" value={customerInfo.name}
                                onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                            />
                            <input 
                                type="email" placeholder="البريد الإلكتروني" required 
                                className="apple-input" value={customerInfo.email}
                                onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                            />
                            <input 
                                type="tel" placeholder="رقم الموبايل (واتساب)" required 
                                className="apple-input" value={customerInfo.phone}
                                onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                            />
                            <textarea 
                                placeholder="ملاحظات إضافية عن المشروع..." rows="3"
                                className="apple-input" value={customerInfo.brief}
                                onChange={(e) => setCustomerInfo({...customerInfo, brief: e.target.value})}
                            ></textarea>

                            <div className="pt-6 border-t border-stone-100 mt-6">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="font-bold text-stone-500">إجمالي قيمة الاستثمار</span>
                                    <span className="text-2xl font-black text-[#c2410c]">{total} ج.م</span>
                                </div>
                                <button 
                                    type="submit" disabled={loading}
                                    className={`btn-capsule w-full py-4 bg-[#c2410c] text-white shadow-lg text-sm ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#a33509]'}`}
                                >
                                    {loading ? 'جاري تجهيز الفاتورة...' : 'إتمام الدفع والتعاقد'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
}

// 2. المكون الأساسي المغلف بالـ Suspense (عشان الـ Build ينجح)
export default function CartPage() {
    return (
        <Suspense fallback={
            <div className="pt-40 pb-40 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c2410c] mb-4"></div>
                <p className="font-bold text-stone-500">جاري تحميل السلة...</p>
            </div>
        }>
            <CartContent />
        </Suspense>
    );
}
