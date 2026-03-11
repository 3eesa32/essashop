import { connectToDatabase } from '@/lib/db';

export default async function AccountDashboard() {
    const db = await connectToDatabase();
    
    // جلب المشاريع والفواتير
    const [projects] = await db.execute("SELECT * FROM projects ORDER BY created_at DESC");
    const [invoices] = await db.execute("SELECT * FROM invoices ORDER BY created_at DESC");

    return (
        <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-16">
            <header className="reveal-up">
                <h1 className="text-4xl font-black text-[#44403c]">لوحة التحكم</h1>
                <p className="text-stone-400 font-bold mt-2">مرحباً بك، تابع حالة مشاريعك وفواتيرك</p>
            </header>

            {/* قسم المشاريع */}
            <div className="space-y-6">
                <h3 className="text-2xl font-black text-[#c2410c]">المشاريع الجارية</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(p => (
                        <div key={p.id} className="apple-card p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <h4 className="font-black text-lg">{p.title}</h4>
                                <span className="bg-orange-50 text-[#c2410c] text-[10px] px-3 py-1 rounded-full font-bold">{p.status}</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-stone-400">
                                    <span>نسبة الإنجاز</span>
                                    <span>{p.progress}%</span>
                                </div>
                                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-[#c2410c] h-full transition-all duration-1000" style={{ width: `${p.progress}%` }}></div>
                                </div>
                            </div>
                            <p className="text-[10px] text-stone-400 font-bold">موعد التسليم المتوقع: {new Date(p.deadline).toLocaleDateString('ar-EG')}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* قسم الفواتير */}
            <div className="space-y-6">
                <h3 className="text-2xl font-black text-[#44403c]">الفواتير والمدفوعات</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="border-b border-stone-200 text-stone-400 text-sm">
                                <th className="py-4 px-2">رقم الفاتورة</th>
                                <th className="py-4 px-2">المشروع</th>
                                <th className="py-4 px-2">المبلغ</th>
                                <th className="py-4 px-2">الحالة</th>
                            </tr>
                        </thead>
                        <tbody className="font-bold text-sm">
                            {invoices.map(inv => (
                                <tr key={inv.id} className="border-b border-stone-100 hover:bg-white transition-colors">
                                    <td className="py-4 px-2">#{inv.id}</td>
                                    <td className="py-4 px-2">{inv.project_name}</td>
                                    <td className="py-4 px-2">{Number(inv.amount)} ج.م</td>
                                    <td className="py-4 px-2 text-green-500">مدفوعة</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}