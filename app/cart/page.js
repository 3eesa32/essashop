"use client";
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';

function CartContent() {
    const [cart, setCart] = useState([]);
    const [customer, setCustomer] = useState({ name: '', email: '', phone: '', brief: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('micro_ads_cart') || '[]');
        setCart(savedCart);
    }, []);

    const total = cart.reduce((sum, item) => sum + Number(item.price), 0);

    const handleCheckout = async (e) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch('/api/checkout', {
            method: 'POST',
            body: JSON.stringify({ ...customer, cartIds: cart.map(i => i.id), total })
        });

        const data = await res.json();
        if (data.redirectUrl) {
            localStorage.removeItem('micro_ads_cart'); // تنظيف السلة
            window.location.href = data.redirectUrl; // التوجه لـ Paymob أو صفحة النجاح
        } else {
            alert("حدث خطأ: " + data.error);
            setLoading(false);
        }
    };

    if (cart.length === 0) return <div className="pt-40 text-center font-bold">السلة فارغة حالياً.</div>;

    return (
        <section className="pt-32 pb-20 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
                <h2 className="text-3xl font-black text-[#44403c]">سلة المشروعات</h2>
                {cart.map(item => (
                    <div key={item.id} className="apple-card p-6 flex justify-between items-center">
                        <div>
                            <h4 className="font-bold">{item.title}</h4>
                            <p className="text-xs text-stone-400">{item.category}</p>
                        </div>
                        <span className="font-black text-[#c2410c]">{Number(item.price)} ج.م</span>
                    </div>
                ))}
                <div className="pt-6 border-t border-stone-200 flex justify-between items-center font-black text-2xl">
                    <span>الإجمالي:</span>
                    <span className="text-[#c2410c]">{total} ج.م</span>
                </div>
            </div>

            <div className="apple-card p-8 shadow-xl">
                <h3 className="text-xl font-black mb-6">بيانات التعاقد</h3>
                <form onSubmit={handleCheckout} className="space-y-4">
                    <input type="text" placeholder="الاسم الكامل" required className="apple-input" onChange={e => setCustomer({...customer, name: e.target.value})} />
                    <input type="email" placeholder="البريد الإلكتروني" required className="apple-input" onChange={e => setCustomer({...customer, email: e.target.value})} />
                    <input type="tel" placeholder="رقم الهاتف" required className="apple-input" onChange={e => setCustomer({...customer, phone: e.target.value})} />
                    <textarea placeholder="نبذة عن مشروعك..." className="apple-input" rows="4" onChange={e => setCustomer({...customer, brief: e.target.value})}></textarea>
                    <button type="submit" disabled={loading} className="btn-primary w-full bg-[#c2410c]">
                        {loading ? 'جاري تجهيز الطلب...' : 'تأكيد الطلب والدفع'}
                    </button>
                </form>
            </div>
        </section>
    );
}

export default function CartPage() {
    return <Suspense><CartContent /></Suspense>;
}