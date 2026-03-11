import { connectToDatabase } from '@/lib/db';
import Link from 'next/link';

export default async function ServicesPage() {
    const db = await connectToDatabase();
    // جلب الخدمات من جدول services اللي أنشأناه
    const [services] = await db.execute("SELECT * FROM services ORDER BY id DESC");

    return (
        <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
                <h1 className="text-4xl md:text-6xl font-black text-[#44403c] tracking-tighter">خدماتنا الإبداعية</h1>
                <p className="text-stone-400 font-bold">اختر المسار الذي ينقل مشروعك للمستوى التالي</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service) => (
                    <div key={service.id} className="apple-card p-8 flex flex-col justify-between h-full">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#c2410c] bg-orange-50 px-3 py-1 rounded-full">
                                {service.category}
                            </span>
                            <h3 className="text-2xl font-black text-[#44403c] mt-4 mb-2">{service.title}</h3>
                            <p className="text-stone-500 text-sm font-bold leading-relaxed">
                                حلول احترافية مخصصة لمجال {service.industry} تضمن لك التميز.
                            </p>
                        </div>
                        <div className="mt-8 flex items-center justify-between border-t border-stone-100 pt-6">
                            <span className="text-xl font-black text-[#44403c]">{Number(service.price)} ج.م</span>
                            <Link href={`/services/${service.id}`} className="text-[#c2410c] font-black text-sm hover:underline">
                                التفاصيل <i className="fa-solid fa-arrow-left mr-1"></i>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
            
            {services.length === 0 && (
                <div className="text-center py-20 text-stone-400 font-bold">
                    لا توجد خدمات مضافة حالياً في قاعدة البيانات.
                </div>
            )}
        </section>
    );
}