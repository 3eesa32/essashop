"use client";
import React from 'react';

export default function AddToCartButton({ service }) {
    const handleAdd = () => {
        const cart = JSON.parse(localStorage.getItem('micro_ads_cart') || '[]');
        
        // منع تكرار الخدمة في السلة
        if (cart.find(item => item.id === service.id)) {
            alert('الخدمة موجودة بالفعل في السلة');
            return;
        }

        cart.push({
            id: service.id,
            title: service.title,
            price: service.price,
            category: service.category
        });

        localStorage.setItem('micro_ads_cart', JSON.stringify(cart));
        alert('تمت إضافة الخدمة للسلة بنجاح!');
        window.location.href = '/cart';
    };

    return (
        <button 
            onClick={handleAdd}
            className="w-full bg-[#c2410c] text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:bg-[#a33509] transition-all"
        >
            إضافة إلى سلة المشروعات
        </button>
    );
}