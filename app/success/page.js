"use client";
import React, { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    useEffect(() => {
        // هنا يمكننا إرسال طلب لـ API آخر لتحديث حالة المشروع (اختياري)
        console.log("Order Processed:", orderId);
    }, [orderId]);

    return (
        <section className="pt-40 pb-20 text-center px-6">
            <div className="max-w-xl mx-auto apple-card p-12">
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                    <i className="fa-solid fa-check"></i>
                </div>
                <h1 className="text-3xl font-black text-[#44403c] mb-4">تم استلام طلبك بنجاح!</h1>
                <p className="text-stone-400 font-bold mb-8">رقم الطلب الخاص بك هو #{orderId}. فريقنا سيبدأ العمل فوراً وسنرسل لك التفاصيل عبر الإيميل.</p>
                <div className="flex gap-4 justify-center">
                    <a href="/account" className="btn-primary bg-[#c2410c]">لوحة التحكم</a>
                    <a href="/" className="btn-primary">الرئيسية</a>
                </div>
            </div>
        </section>
    );
}

export default function SuccessPage() {
    return <Suspense><SuccessContent /></Suspense>;
}