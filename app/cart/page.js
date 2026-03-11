"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CartPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    // حالات الصفحة
    const [cart, setCart] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // محاكاة قاعدة البيانات (يجب أن تتطابق مع الأرقام التجريبية في صفحة التفاصيل)
    const dummyDatabase = {
        '1': { id: 1, cat: 'branding', name: 'هوية مطعم برجريتو', price: '5000', img: 'brand_identity.webp' },
        '2': { id: 2, cat: 'packaging', name: 'تغليف منتجات ألبان', price: '3500', img: 'packaging_sleeve.webp' },
        '3': { id: 3, cat: 'digital', name: 'حملة تسويق عيادة', price: '4000', img: 'instagram_posts.webp' },
        '4': { id: 4, cat: 'branding', name: 'شعار شركة عقارات', price: '2500', img: 'logo_design.webp' },
        '5': { id: 5, cat: 'digital', name: 'منيو إلكتروني ذكي', price: '1500', img: 'digital_menu.webp' },
        '6': { id: 6, cat: 'packaging', name: 'علب مستحضرات تجميل', price: '4500', img: 'product_box.webp' },
        '7': { id: 7, cat: 'branding', name: 'هوية مركز تدريب', price: '3000', img: 'business_cards.webp' }
    };

    // 1. تحميل السلة من التخزين المحلي (localStorage) عند فتح الصفحة
    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('micro_ads_cart')) || [];
        setCart(savedCart);
        setIsLoaded(true);
    }, []);

    // 2. معالجة الإضافة للسلة عبر الرابط (URL Params)
    useEffect(() => {
        if (!isLoaded) return; // ننتظر حتى يتم تحميل السلة القديمة أولاً

        const action = searchParams.get('action');
        const id = searchParams.get('id');
        const brief = searchParams.get('brief') || '';

        if (action === 'add' && id) {
            const existingItemIndex = cart.findIndex(item => item.id === id);
            let newCart = [...cart];
            
            if (existingItemIndex > -1) {
                // إذا كانت الخدمة موجودة، نحدث الملاحظات فقط
                newCart[existingItemIndex].brief = brief;
            } else {
                // إضافة خدمة جديدة
                newCart.push({ id, brief });
            }
            
            setCart(newCart);
            localStorage.setItem('micro_ads_cart', JSON.stringify(newCart));
            
            // تنظيف الرابط لمنع الإضافة المتكررة عند عمل Refresh
            router.replace('/cart');
        }
    }, [searchParams, isLoaded, router, cart]);

    // وظيفة حذف خدمة واحدة
    const handleRemove = (idToRemove) => {
        const newCart = cart.filter(item => item.id !== idToRemove);
        setCart(newCart);
        localStorage.setItem('micro_ads_cart', JSON.stringify(newCart));
    };

    // وظيفة تفريغ السلة بالكامل
    const handleClearCart = () => {
        setCart([]);
        localStorage.removeItem('micro_ads_cart');
    };

    // تجميع بيانات الخدمات للعرض بربط (السلة) بـ (قاعدة البيانات الوهمية)
    const cartItemsDisplay = cart.map(cartItem => {
        const dbItem = dummyDatabase[cartItem.id];
        if (!dbItem) return null;
        return { ...dbItem, user_brief: cartItem.brief };
    }).filter(Boolean);

    const totalPrice = cartItemsDisplay.reduce((sum, item) => sum + parseInt(item.price), 0);

    const getCatName = (cat) => {
        const catNames = { 'branding': 'هوية بصرية', 'packaging': 'تغليف منتجات', 'digital': 'دعاية رقمية' };
        return catNames[cat] || cat;
    };

    // شاشة تحميل سريعة لمنع الوميض
    if (!isLoaded) return <div className="min-h-screen flex items-center justify-center font-bold text-stone-400">جاري تجهيز السلة...</div>;

    return (
        <main className="py-24 md:py-32 px-4">
            <div className="max-w-5xl mx-auto">
                
                <div className="flex items-center justify-between mb-10 mt-8 md:mt-0">
                    <h1 className="text-3xl font-black text-[#44403c]">سلة المشروعات</h1>
                    {cartItemsDisplay.length > 0 && (
                        <button onClick={handleClearCart} className="text-sm font-bold text-red-500 hover:underline bg-transparent border-none cursor-pointer">
                            تفريغ السلة
                        </button>
                    )}
                </div>

                {cartItemsDisplay.length === 0 ? (
                    // حالة السلة الفارغة
                    <div className="bg-white rounded-[3rem] p-10 md:p-20 text-center border border-dashed border-stone-300">
                        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#a8a29e" strokeWidth="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                        </div>
                        <h2 className="text-xl font-black text-stone-400 mb-6">سلتك خالية حالياً.. ابدأ بإضافة خدمات لمشروعك</h2>
                        <Link href="/services" className="inline-block py-4 px-10 bg-[#c2410c] text-white font-black rounded-2xl shadow-lg hover:brightness-110 transition-all">
                            تصفح الخدمات
                        </Link>
                    </div>
                ) : (
                    // حالة السلة ممتلئة
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* قائمة الخدمات */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItemsDisplay.map(item => (
                                <div key={item.id} className="cart-card p-4 md:p-6 rounded-[2rem] flex items-start gap-4 md:gap-6 shadow-sm">
                                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-stone-100">
                                        <img src={`/products/${item.img}`} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-[10px] font-black text-[#c2410c] uppercase tracking-tighter">
                                            {getCatName(item.cat)}
                                        </span>
                                        <h3 className="font-black text-sm md:text-lg text-[#44403c]">{item.name}</h3>
                                        <span className="text-xs font-bold text-stone-400">سعر الخدمة: {item.price} ج.م</span>
                                        
                                        {item.user_brief && (
                                            <div className="brief-preview">
                                                <span className="block font-black text-[9px] text-stone-400 uppercase mb-1">ملاحظاتك للمشروع:</span>
                                                <span className="whitespace-pre-line">{item.user_brief}</span>
                                            </div>
                                        )}
                                    </div>
                                    <button onClick={() => handleRemove(item.id.toString())} className="p-2 text-stone-300 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* ملخص الطلب */}
                        <div className="lg:col-span-1">
                            <div className="bg-[#44403c] rounded-[2.5rem] p-8 text-white sticky top-24">
                                <h3 className="text-xl font-black mb-8 border-b border-stone-600 pb-4">ملخص الطلب</h3>
                                
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between font-bold text-stone-400">
                                        <span>عدد الخدمات:</span>
                                        <span>{cartItemsDisplay.length}</span>
                                    </div>
                                    <div className="flex justify-between text-2xl font-black pt-4 border-t border-stone-600">
                                        <span>الإجمالي:</span>
                                        <span>{totalPrice} ج.م</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Link href="/checkout" className="block w-full py-5 bg-[#c2410c] text-white text-center font-black rounded-2xl shadow-xl hover:brightness-110 transition-all text-lg">
                                        إتمام التعاقد والدفع
                                    </Link>
                                    <Link href="/services" className="block w-full py-4 bg-stone-700/50 text-white text-center font-bold rounded-2xl hover:bg-stone-700 transition-all text-sm">
                                        إضافة خدمات أخرى
                                    </Link>
                                </div>
                                
                                <p className="mt-6 text-[10px] text-stone-500 text-center leading-relaxed">
                                    بضغطك على إتمام التعاقد، أنت توافق على بنود العقد الرقمي المرفقة في تفاصيل كل خدمة.
                                </p>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </main>
    );
}