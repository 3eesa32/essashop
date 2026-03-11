"use client";
import React, { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    // كود بسيط لتفعيل أنيميشن الظهور
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    });
    document.querySelectorAll('.reveal-up').forEach((el) => observer.observe(el));
  }, []);

  return (
    <section className="pt-40 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <span className="reveal-up inline-block bg-orange-100 text-[#c2410c] px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
          مستقبل علامتك التجارية يبدأ هنا
        </span>
        <h1 className="reveal-up text-5xl md:text-7xl font-black text-[#44403c] leading-tight tracking-tighter">
          نبتكر هويات <br /> <span className="text-[#c2410c]">تصنع الفارق.</span>
        </h1>
        <p className="reveal-up text-stone-500 font-bold text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          نحن لا نصمم مجرد صور، نحن نبني إستراتيجيات بصرية متكاملة تمنح مشروعك الحضور الاستثنائي الذي يستحقه.
        </p>
        <div className="reveal-up pt-10">
          <a href="/services" className="btn-primary">
            استكشف خدماتنا
          </a>
        </div>
      </div>
    </section>
  );
}