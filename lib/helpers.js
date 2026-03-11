import { connectToDatabase } from './db.js';

export async function processCoreOrder(orderId) {
    const db = await connectToDatabase();
    
    // 1. جلب بيانات الطلب
    const [orders] = await db.execute("SELECT * FROM orders WHERE id = ?", [orderId]);
    if (orders.length === 0) return;
    const order = orders[0];

    // 2. تحديث حالة الطلب لـ "مدفوع"
    await db.execute("UPDATE orders SET status = 'paid' WHERE id = ?", [orderId]);

    // 3. إنشاء فاتورة في جدول invoices
    await db.execute(
        "INSERT INTO invoices (id, user_id, client_name, project_name, amount, status) VALUES (?, ?, ?, ?, ?, 'paid')",
        [order.id, order.user_id, order.customer_name, order.services_ordered, order.total_amount]
    );

    // 4. فتح مشروع جديد في جدول projects (تسليم بعد 7 أيام)
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 7);
    const formattedDeadline = deadline.toISOString().split('T')[0];

    await db.execute(
        "INSERT INTO projects (id, user_id, invoice_id, title, client_name, deadline, status, progress) VALUES (?, ?, ?, ?, ?, ?, 'pending', 0)",
        [order.id, order.user_id, order.id, order.services_ordered, order.customer_name, formattedDeadline]
    );
}