"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function HomePage() {
    // هذه المتغيرات (حالة الصفحة) للتحكم في النص المتغير والصندوق
    const [changingText, setChangingText] = useState("هويات بصرية");
    const [isTextVisible, setIsTextVisible] = useState(true);
    const boxRef = useRef(null);
    const viewportRef = useRef(null);

    // 1. وظيفة تغيير النصوص المستمر
    useEffect(() => {
        const words = ["هويات بصرية", "تصميمات تغليف", "واجهات رقمية", "حملات تسويق"];
        let wordIndex = 0;
        
        const interval = setInterval(() => {
            setIsTextVisible(false); // إخفاء النص
            
            setTimeout(() => {
                wordIndex = (wordIndex + 1) % words.length;
                setChangingText(words[wordIndex]); // تغيير الكلمة
                setIsTextVisible(true); // إظهار النص من جديد
            }, 500); // سرعة الاختفاء
            
        }, 3500); // وقت بقاء الكلمة

        return () => clearInterval(interval);
    }, []);

    // 2. وظيفة ظهور العناصر عند التمرير والعدادات الرقمية
    useEffect(() => {
        // مراقب ظهور العناصر
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

        document.querySelectorAll('.reveal-up').forEach((el) => revealObserver.observe(el));

        // مراقب العدادات الرقمية
        const counterObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    const target = entry.target;
                    const endVal = parseInt(target.getAttribute('data-target'));
                    let startVal = 0;
                    const duration = 2000;
                    const increment = endVal / (duration / 16);
                    
                    const updateCounter = () => {
                        startVal += increment;
                        if(startVal < endVal) {
                            target.innerText = Math.ceil(startVal);
                            requestAnimationFrame(updateCounter);
                        } else {
                            target.innerText = endVal;
                        }
                    };
                    updateCounter();
                    obs.unobserve(target);
                }
            });
        }, { threshold: 0.5 });
        
        document.querySelectorAll('.num-counter').forEach(c => counterObserver.observe(c));

        return () => {
            revealObserver.disconnect();
            counterObserver.disconnect();
        };
    }, []);

    // 3. وظيفة تحريك الصندوق ثلاثي الأبعاد
    useEffect(() => {
        let isHover = false;
        let rX = -20, rY = 20, spin = 0;
        const viewport = viewportRef.current;
        const box = boxRef.current;

        const handleMouseMove = (e) => {
            isHover = true;
            const b = viewport.getBoundingClientRect();
            rY = (((e.clientX - b.left) / b.width) - 0.5) * 120;
            rX = (((e.clientY - b.top) / b.height) - 0.5) * -120;
        };

        const handleMouseLeave = () => {
            isHover = false;
            rX = -20; rY = 20;
        };

        if (viewport && box) {
            viewport.addEventListener('mousemove', handleMouseMove);
            viewport.addEventListener('mouseleave', handleMouseLeave);
        }

        const animateBox = () => {
            if (box) {
                if (!isHover) spin += 0.5;
                const finalY = rY + (isHover ? 0 : spin);
                const scaleFactor = window.innerWidth < 768 ? 0.7 : 1.1; 
                box.style.transform = `translate3d(-50%, -50%, 0) rotateX(${rX}deg) rotateY(${finalY}deg) scale(${scaleFactor})`;
                requestAnimationFrame(animateBox);
            }
        };
        animateBox();

        return () => {
            if (viewport) {
                viewport.removeEventListener('mousemove', handleMouseMove);
                viewport.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, []);

    // تجهيز مصفوفات الصور لمعرض الأعمال المتحرك
    const marqueeImgs = ['brand_identity.webp', 'packaging_sleeve.webp', 'logo_design.webp', 'business_cards.webp', 'instagram_posts.webp', 'product_box.webp', 'yum_menu.webp'];
    const portfolioImgs = ['olios_branding.webp', 'bread_packages.webp', 'ncc_holding_app.webp', 'frozen_vegetables.webp', 'taashera_digital_design.webp'];

    return (
        <main>
            {/* القسم الأول: الواجهة الرئيسية والصندوق */}
            <section className="min-h-[90vh] flex items-center pt-32 pb-16 lg:pt-40 relative z-10 overflow-hidden">
                <div className="hero-pattern"></div>
                <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-20">
                    
                    <div className="lg:col-span-7 space-y-6 reveal-up is-visible text-center lg:text-right">
                        <span className="inline-block text-[#c2410c] font-black text-xs md:text-sm uppercase tracking-widest bg-white/80 backdrop-blur-md px-6 py-2.5 rounded-full border border-stone-200 shadow-sm">
                            Micro Ads Agency 2026
                        </span>
                        
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-none tracking-tight text-[#1d1d1f]">
                            <span className="block">نبتكر</span>
                            <span className="block mt-[20px]">
                                <span 
                                    className="text-[#c2410c] inline-block transition-all duration-500 min-w-[150px]"
                                    style={{ 
                                        opacity: isTextVisible ? 1 : 0, 
                                        transform: isTextVisible ? 'translateY(0)' : 'translateY(10px)' 
                                    }}
                                >
                                    {changingText}
                                </span>
                            </span>
                            <span className="block mt-[20px]">تصنع الفارق.</span>
                        </h1>
                        
                        <p className="text-base md:text-lg text-[#86868b] font-bold leading-relaxed max-w-md mx-auto lg:mx-0 mt-[20px]">
                            نحن لا نصمم مجرد أشكال، بل نبني علامات تجارية، وتغليف منتجات، وحلولاً رقمية تمنح مشروعك الحضور الاستثنائي الذي يستحقه.
                        </p>
                        
                        <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link href="/services" className="btn-apple btn-primary w-full sm:w-auto">
                                اكتشف خدماتنا
                            </Link>
                            <Link href="/portfolio" className="btn-apple bg-white border border-stone-200 text-[#1d1d1f] hover:border-[#c2410c] hover:text-[#c2410c] w-full sm:w-auto">
                                معرض الأعمال
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mobile-icon-hide mr-2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-5 relative h-[350px] lg:h-[550px] reveal-up is-visible w-full mt-10 lg:mt-0" style={{ transitionDelay: '0.2s' }}>
                        <div className="stage" ref={viewportRef}>
                            <div className="box-container" ref={boxRef}>
                                <div className="wf-face box-size face-front"></div>
                                <div className="wf-face box-size face-back"></div>
                                <div className="wf-face box-size face-right"></div>
                                <div className="wf-face box-size face-left"></div>
                                <div className="wf-face box-size face-bottom"></div>
                                <div className="flap flap-front"></div>
                                <div className="flap flap-back"></div>
                                <div className="flap flap-left"></div>
                                <div className="flap flap-right"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* شريط الصور المتحرك الأول */}
            <section className="unified-marquee bg-white border-y border-stone-100 relative z-10 mb-16">
                <div className="marquee-content-wrapper">
                    {/* تكرار الحلقة لضمان الحركة المستمرة */}
                    {[...Array(4)].map((_, i) => (
                        <React.Fragment key={i}>
                            {marqueeImgs.map((img, index) => (
                                <div key={index} className="marquee-item-card">
                                    <img src={`/products/${img}`} alt="صور الخدمات" loading="lazy" />
                                </div>
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            </section>

            {/* قسم الخدمات (كروت العرض) */}
            <section className="py-12 px-4 md:px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 reveal-up">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1d1d1f] tracking-tighter">
                            <span className="block">حلول متكاملة</span>
                            <span className="block mt-[10px] md:mt-[20px]">ومبتكرة.</span>
                        </h2>
                        <p className="text-[#86868b] font-bold text-sm md:text-xl mt-[15px] md:mt-[20px]">نجمع بين الفن والتكنولوجيا لنمو وتوسع علامتك التجارية.</p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                        
                        <Link href="/services" className="service-card apple-transition reveal-up">
                            <div className="service-img-wrapper">
                                <img src="/products/brand_identity.webp" alt="الهويات البصرية" className="service-img" loading="lazy" />
                            </div>
                            <div className="p-8 mobile-p-override flex-grow flex flex-col justify-between">
                                <div>
                                    <h3 className="text-2xl mobile-title-override font-black text-[#1d1d1f] mb-3">الهويات البصرية</h3>
                                    <p className="text-[#86868b] font-bold text-sm line-clamp-2-mobile md:line-clamp-none leading-relaxed mb-4 md:mb-6">نبني شخصية بصرية متكاملة تعكس قيم مشروعك وترسخ في أذهان عملائك بقوة.</p>
                                </div>
                                <span className="text-[#c2410c] font-black text-[10px] md:text-sm flex items-center gap-1 md:gap-2 mt-auto">التفاصيل <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="mobile-icon-hide"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
                            </div>
                        </Link>

                        <Link href="/services" className="service-card apple-transition reveal-up" style={{ transitionDelay: '0.1s' }}>
                            <div className="service-img-wrapper">
                                <img src="/products/packaging_sleeve.webp" alt="تصميم التغليف" className="service-img" loading="lazy" />
                            </div>
                            <div className="p-8 mobile-p-override flex-grow flex flex-col justify-between">
                                <div>
                                    <h3 className="text-2xl mobile-title-override font-black text-[#1d1d1f] mb-3">تصميم التغليف</h3>
                                    <p className="text-[#86868b] font-bold text-sm line-clamp-2-mobile md:line-clamp-none leading-relaxed mb-4 md:mb-6">نبتكر عبوات وتغليف للمنتجات تبرز قيمتها على الأرفف وتزيد من معدلات المبيعات.</p>
                                </div>
                                <span className="text-[#c2410c] font-black text-[10px] md:text-sm flex items-center gap-1 md:gap-2 mt-auto">التفاصيل <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="mobile-icon-hide"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
                            </div>
                        </Link>

                        <Link href="/services" className="service-card apple-transition reveal-up" style={{ transitionDelay: '0.2s' }}>
                            <div className="service-img-wrapper">
                                <img src="/products/instagram_posts.webp" alt="الدعاية الرقمية" className="service-img" loading="lazy" />
                            </div>
                            <div className="p-8 mobile-p-override flex-grow flex flex-col justify-between">
                                <div>
                                    <h3 className="text-2xl mobile-title-override font-black text-[#1d1d1f] mb-3">الدعاية الرقمية</h3>
                                    <p className="text-[#86868b] font-bold text-sm line-clamp-2-mobile md:line-clamp-none leading-relaxed mb-4 md:mb-6">تصاميم السوشيال ميديا والحملات الإعلانية التي تضمن تفاعل جمهورك وزيادة انتشارك.</p>
                                </div>
                                <span className="text-[#c2410c] font-black text-[10px] md:text-sm flex items-center gap-1 md:gap-2 mt-auto">التفاصيل <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="mobile-icon-hide"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
                            </div>
                        </Link>

                        <Link href="/services" className="service-card apple-transition reveal-up" style={{ transitionDelay: '0.3s' }}>
                            <div className="service-img-wrapper">
                                <img src="/products/logo_design.webp" alt="تصميم الشعارات" className="service-img" loading="lazy" />
                            </div>
                            <div className="p-8 mobile-p-override flex-grow flex flex-col justify-between">
                                <div>
                                    <h3 className="text-2xl mobile-title-override font-black text-[#1d1d1f] mb-3">تصميم الشعارات</h3>
                                    <p className="text-[#86868b] font-bold text-sm line-clamp-2-mobile md:line-clamp-none leading-relaxed mb-4 md:mb-6">نبتكر شعارات ذكية وبسيطة تعبر عن جوهر مشروعك وتترك انطباعاً لا ينسى.</p>
                                </div>
                                <span className="text-[#c2410c] font-black text-[10px] md:text-sm flex items-center gap-1 md:gap-2 mt-auto">التفاصيل <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="mobile-icon-hide"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
                            </div>
                        </Link>

                    </div>
                    
                    <div className="text-center mt-12 reveal-up">
                        <Link href="/services" className="btn-apple bg-[#e3e3e8] text-[#1d1d1f] hover:bg-[#d1d1d6] w-full sm:w-auto">عرض كافة الخدمات</Link>
                    </div>
                </div>
            </section>

            {/* قسم الإحصائيات (العدادات الرقمية) */}
            <section className="py-20 px-6 bg-white border-y border-stone-200 relative z-10">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
                    <div className="reveal-up">
                        <div className="text-5xl md:text-7xl font-black text-[#1d1d1f] mb-2">+<span className="num-counter" data-target="150">0</span></div>
                        <div className="text-[#86868b] font-black text-[10px] md:text-sm uppercase tracking-widest mt-2 md:mt-3">مشروع ناجح</div>
                    </div>
                    <div className="reveal-up" style={{ transitionDelay: '0.1s' }}>
                        <div className="text-5xl md:text-7xl font-black text-[#1d1d1f] mb-2">+<span className="num-counter" data-target="50">0</span></div>
                        <div className="text-[#86868b] font-black text-[10px] md:text-sm uppercase tracking-widest mt-2 md:mt-3">عميل سعيد</div>
                    </div>
                    <div className="reveal-up" style={{ transitionDelay: '0.2s' }}>
                        <div className="text-5xl md:text-7xl font-black text-[#1d1d1f] mb-2">+<span className="num-counter" data-target="5">0</span></div>
                        <div className="text-[#86868b] font-black text-[10px] md:text-sm uppercase tracking-widest mt-2 md:mt-3">سنوات خبرة</div>
                    </div>
                    <div className="reveal-up flex flex-col justify-center items-center" style={{ transitionDelay: '0.3s' }}>
                         <h3 className="text-lg md:text-2xl font-black text-[#1d1d1f] mb-1 md:mb-2 block">من الفكرة للتنفيذ</h3>
                         <p className="text-[#86868b] font-bold text-[10px] md:text-xs mt-[10px] md:mt-[20px]">نعمل بخطوات واضحة لضمان الجودة.</p>
                    </div>
                </div>
            </section>

            {/* قسم من نحن المٌصغر */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div className="reveal-up text-center md:text-right order-2 md:order-1">
                        <span className="inline-block text-[#c2410c] font-black text-xs md:text-sm uppercase tracking-widest bg-orange-50 px-4 py-1.5 rounded-full mb-4">عن وكالتنا</span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1d1d1f] mb-6 leading-tight tracking-tighter">شريكك الموثوق<br />في رحلة النجاح.</h2>
                        <p className="text-[#86868b] text-base md:text-lg font-bold leading-relaxed mb-8 max-w-lg mx-auto md:mx-0">
                            في مايكرو آدز، نحن نؤمن بأن كل علامة تجارية لها قصة فريدة تستحق أن تُروى بأفضل صورة. نحن فريق من المبدعين الشغوفين بالتصميم والتسويق الرقمي، نسعى دائماً لتحويل أفكارك إلى واقع ملموس يحقق أهدافك ويصنع الفارق في سوقك المستهدف.
                        </p>
                        <Link href="/about" className="btn-apple bg-[#1d1d1f] text-white hover:bg-[#333336] w-full sm:w-auto">اكتشف قصتنا</Link>
                    </div>
                    <div className="reveal-up order-1 md:order-2">
                        <div className="rounded-[2.5rem] overflow-hidden shadow-2xl h-[300px] md:h-[500px] border border-stone-100 relative">
                            <img src="/media/taashera_digital_design.webp" alt="عن مايكرو آدز" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* قسم الرؤية والمهمة */}
            <section className="py-20 px-6 bg-[#fdfdfd] border-y border-stone-200 relative z-10">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 md:gap-10">
                    <div className="bg-white p-10 md:p-14 rounded-[2.5rem] shadow-sm border border-stone-100 text-center reveal-up hover:shadow-xl transition-shadow duration-500">
                        <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-[#c2410c]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </div>
                        <h3 className="text-3xl font-black text-[#1d1d1f] mb-4">مهمتنا</h3>
                        <p className="text-[#86868b] font-bold leading-relaxed text-sm md:text-base">
                            تقديم حلول تسويقية وتصميمية مبتكرة تعزز من قيمة العلامات التجارية وتساعدها على النمو والتفوق في أسواقها التنافسية بأعلى معايير الجودة.
                        </p>
                    </div>
                    
                    <div className="bg-white p-10 md:p-14 rounded-[2.5rem] shadow-sm border border-stone-100 text-center reveal-up hover:shadow-xl transition-shadow duration-500" style={{ transitionDelay: '0.1s' }}>
                        <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-[#c2410c]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                        </div>
                        <h3 className="text-3xl font-black text-[#1d1d1f] mb-4">رؤيتنا</h3>
                        <p className="text-[#86868b] font-bold leading-relaxed text-sm md:text-base">
                            أن نكون الوكالة الإبداعية الرائدة في الشرق الأوسط، والخيار الأول للشركات الطموحة التي تبحث عن الإبداع، التميز الرقمي، والحلول المستدامة.
                        </p>
                    </div>
                </div>
            </section>

            {/* شريط الصور المتحرك لمعرض الأعمال */}
            <section className="py-24 relative z-10 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col items-center text-center reveal-up">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-[#1d1d1f]">معرض الإبداع.</h2>
                    <p className="text-[#86868b] font-bold text-lg md:text-xl mt-[20px] mb-[30px] max-w-xl">نظرة سريعة على أحدث مشاريعنا التي صممناها بشغف ونفخر بمشاركتها معكم.</p>
                    <Link href="/portfolio" className="btn-apple btn-primary w-full sm:w-auto">
                        استكشف البورتفوليو
                    </Link>
                </div>
                
                <div className="unified-marquee">
                    <div className="marquee-content-wrapper" style={{ animationDuration: '60s' }}>
                        {[...Array(3)].map((_, i) => (
                            <React.Fragment key={i}>
                                {portfolioImgs.map((pimg, index) => (
                                    <div key={index} className="marquee-item-card portfolio-item-card">
                                        <img src={`/media/${pimg}`} alt="أعمالنا" loading="lazy" />
                                    </div>
                                ))}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}