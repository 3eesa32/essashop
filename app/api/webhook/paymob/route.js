import { NextResponse } from 'next/server';
// استيراد الدوال باستخدام المسار المباشر والامتداد .js لضمان نجاح الـ Build
import { connectToDatabase } from '../../../../lib/db.js';
import { processCoreOrder } from '../../../../lib/helpers.js';

export async function POST(request) {
    try {
        // استقبال البيانات القادمة من Paymob
        const data = await request.json();

        // التأكد أن الإشعار خاص بعملية تحويل (Transaction)
        if (data.type && data.type === 'TRANSACTION') {
            const obj = data.obj;
            
            // استخراج رقم الطلب الأصلي من merchant_order_id
            // ملاحظة: Paymob يرسل الرقم بصيغة orderId_timestamp
            const merchantOrderId = obj.order.merchant_order_id;
            const orderIdParts = merchantOrderId.split('_');
            const realOrderId = parseInt(orderIdParts[0], 10);
            
            // تحديد حالة العملية (نجاح أم فشل)
            const isSuccess = obj.success;
            // تحديد نوع البطاقة أو المحفظة المستخدمة
            const sourceType = obj.source_data?.sub_type || 'Visa';

            if (isSuccess) {
                // حالة الدفع ناجح:
                // استدعاء المحرك المركزي في helpers.js لتحديث الطلب، إنشاء الفاتورة،
                // إنشاء المشروع، وإرسال تنبيهات تليجرام وإيميلات للعميل.
                await processCoreOrder(realOrderId, 'paid', sourceType);
            } else {
                // حالة فشل الدفع:
                // تحديث حالة الطلب في قاعدة البيانات إلى 'failed' بشرط ألا يكون قد تم دفعه مسبقاً
                const db = await connectToDatabase();
                await db.execute(
                    "UPDATE orders SET status = 'failed' WHERE id = ? AND status != 'paid'",
                    [realOrderId]
                );
            }
        }

        // إرجاع استجابة 200 لـ Paymob لإخبارهم باستلام البيانات بنجاح
        // هذا يمنع Paymob من إعادة إرسال نفس الطلب مرة أخرى
        return new NextResponse("OK", { status: 200 });

    } catch (error) {
        // في حالة حدوث أي خطأ برمجي، نقوم بتسجيله في الـ Logs
        console.error("Webhook Error:", error);
        
        // نرد بـ 200 حتى في حالة الخطأ لكي لا تقوم Paymob بمحاولة الإرسال المتكرر
        // التي قد تسبب ضغطاً على السيرفر، ونكتفي بتسجيل الخطأ عندنا للمراجعة.
        return new NextResponse("Internal Error Logged", { status: 200 });
    }
}
