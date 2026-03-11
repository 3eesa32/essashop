import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, email, phone, brief, cartIds, total } = body;

        const db = await connectToDatabase();
        
        // 1. إدخال الطلب في جدول orders بحالة 'pending_payment'
        const [result] = await db.execute(
            "INSERT INTO orders (customer_name, customer_email, customer_phone, project_brief, total_amount, status, payment_method) VALUES (?, ?, ?, ?, ?, 'pending_payment', 'visa')",
            [name, email, phone, brief, total]
        );

        const orderId = result.insertId;

        // ملاحظة: هنا سنضع كود Paymob لاحقاً لجلب redirectUrl حقيقي
        // للتجربة الآن، سنفترض النجاح ونوجهه لصفحة النجاح مباشرة
        const testRedirectUrl = `/success?orderId=${orderId}`;

        return NextResponse.json({ success: true, redirectUrl: testRedirectUrl });

    } catch (error) {
        console.error("Checkout API Error:", error);
        return NextResponse.json({ error: "فشل إنشاء الطلب" }, { status: 500 });
    }
}