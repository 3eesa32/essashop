import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';

export async function POST(req) {
    try {
        const body = await req.json();
        const { full_name, email, phone, company_name, city, business_type, preferred_contact } = body;

        const db = await connectToDatabase();

        // التأكد من أن البريد الإلكتروني غير مسجل مسبقاً
        const [existing] = await db.execute("SELECT id FROM users WHERE email = ?", [email]);
        if (existing.length > 0) {
            return NextResponse.json({ error: "هذا البريد الإلكتروني مسجل بالفعل" }, { status: 400 });
        }

        // إدخال البيانات في جدول users
        const [result] = await db.execute(
            "INSERT INTO users (full_name, email, phone, company_name, city, business_type, preferred_contact) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [full_name, email, phone, company_name, city, business_type, preferred_contact]
        );

        // هنا ممكن نستخدم Cookies أو Session لحفظ حالة تسجيل الدخول (اختياري للتجربة)
        
        return NextResponse.json({ success: true, userId: result.insertId });

    } catch (error) {
        console.error("Registration Error:", error);
        return NextResponse.json({ error: "فشل إنشاء الحساب" }, { status: 500 });
    }
}