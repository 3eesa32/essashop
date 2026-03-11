import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { processCoreOrder } from '@/lib/helpers';

export async function POST(request) {
    try {
        const data = await request.json();

        if (data.type && data.type === 'TRANSACTION') {
            const obj = data.obj;
            const merchantOrderId = obj.order.merchant_order_id;
            const orderIdParts = merchantOrderId.split('_');
            const realOrderId = parseInt(orderIdParts[0], 10);
            
            const isSuccess = obj.success;
            const sourceType = obj.source_data?.sub_type || 'Visa';

            if (isSuccess) {
                // الدفع ناجح -> أرسل للمحرك المركزي
                await processCoreOrder(realOrderId, 'paid', sourceType);
            } else {
                // فشل الدفع -> تحديث الحالة في قاعدة البيانات
                const db = await connectToDatabase();
                await db.execute(
                    "UPDATE orders SET status = 'failed' WHERE id = ? AND status != 'paid'",
                    [realOrderId]
                );
            }
        }

        // إرجاع استجابة 200 لـ Paymob لإنهاء الاتصال بنجاح
        return new NextResponse("OK", { status: 200 });

    } catch (error) {
        console.error("Webhook Error:", error);
        // نرد بـ 200 حتى لو حدث خطأ داخلي لكي لا تعيد Paymob إرسال الريكويست مراراً وتكراراً
        return new NextResponse("Internal Error Logged", { status: 200 });
    }
}