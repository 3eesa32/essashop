import { connectToDatabase } from '@/lib/db';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';

export default async function ServiceDetails({ params }) {
    const { id } = params;
    const db = await connectToDatabase();
    const [rows] = await db.execute("SELECT * FROM services WHERE id = ?", [id]);
    
    if (rows.length === 0) notFound();
    const service = rows[0];

    return (
        <section className="pt-40 pb-20 px-6 max-w-4xl mx-auto">
            <div className="apple-card p-8 md:p-16 space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -z-10"></div>
                
                <div className="space-y-4">
                    <span className="text-[#c2410c] font-black text-sm uppercase">{service.category}</span>
                    <h1 className="text-4xl md:text-5xl font-black text-[#44403c] tracking-tighter">{service.title}</h1>
                </div>

                <div className="grid md:grid-cols-2 gap-10 py-10 border-y border-stone-100">
                    <div>
                        <h4 className="font-black text-stone-400 text-xs uppercase mb-2">القيمة الاستثمارية</h4>
                        <p className="text-3xl font-black text-[#c2410c]">{Number(service.price)} ج.م</p>
                    </div>
                    <div>
                        <h4 className="font-black text-stone-400 text-xs uppercase mb-2">الصناعة المستهدفة</h4>
                        <p className="text-xl font-bold text-[#44403c]">{service.industry}</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-black text-[#44403c]">عن الخدمة</h3>
                    <p className="text-stone-500 leading-relaxed font-bold">
                        هذه الخدمة مصممة خصيصاً لتلبية احتياجاتك في {service.title}. نحن نضمن تنفيذ العمل بأعلى معايير الجودة العالمية مع الالتزام بالهوية البصرية لمشروعك.
                    </p>
                </div>

                <div className="pt-10">
                    {/* زر الإضافة للسلة (سيكون Client Component) */}
                    <AddToCartButton service={service} />
                </div>
            </div>
        </section>
    );
}