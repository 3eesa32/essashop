import { connectToDatabase } from '@/lib/db';

export default async function AdminDashboard() {
    const db = await connectToDatabase();
    
    const [orders] = await db.execute("SELECT * FROM orders ORDER BY created_at DESC LIMIT 10");
    const [logs] = await db.execute("SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 5");

    return (
        <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-12">
            <h1 className="text-4xl font-black bg-[#44403c] text-white p-6 rounded-[2rem] inline-block">Micro Ads Control Room</h1>

            <div className="grid md:grid-cols-2 gap-12">
                {/* آخر الطلبات */}
                <div className="apple-card p-8 shadow-sm">
                    <h3 className="text-xl font-black mb-6 border-b pb-4">آخر 10 طلبات</h3>
                    <div className="space-y-4">
                        {orders.map(o => (
                            <div key={o.id} className="flex justify-between items-center text-sm border-b border-stone-50 pb-2">
                                <div>
                                    <p className="font-black">{o.customer_name}</p>
                                    <p className="text-[10px] text-stone-400">{o.customer_email}</p>
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-[#c2410c]">{Number(o.total_amount)} ج.م</p>
                                    <p className={`text-[9px] font-black ${o.status === 'paid' ? 'text-green-500' : 'text-orange-400'}`}>{o.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* سجل النشاطات */}
                <div className="apple-card p-8 shadow-sm bg-stone-900 text-stone-400">
                    <h3 className="text-xl font-black mb-6 border-b border-stone-700 pb-4 text-white">سجل الرادار (System Logs)</h3>
                    <div className="space-y-4 font-mono text-[11px]">
                        {logs.map(log => (
                            <div key={log.id} className="border-b border-stone-800 pb-2">
                                <span className="text-orange-500">[{log.action_type}]</span> {log.description}
                                <p className="text-[9px] opacity-50">{new Date(log.created_at).toLocaleString()}</p>
                            </div>
                        ))}
                        {logs.length === 0 && <p>لا توجد نشاطات مسجلة.</p>}
                    </div>
                </div>
            </div>
        </section>
    );
}