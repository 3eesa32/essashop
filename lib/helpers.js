// التأكد من استدعاء db.js من نفس المجلد
import { connectToDatabase } from './db.js';

// 1. إرسال بريد عبر Zoho ZeptoMail
export async function sendZeptoMail(toEmail, toName, subject, htmlBody) {
    const postFields = {
        from: { address: process.env.ZEPTO_FROM_EMAIL, name: process.env.ZEPTO_FROM_NAME },
        to: [{ email_address: { address: toEmail, name: toName } }],
        subject: subject,
        htmlbody: htmlBody
    };

    try {
        const response = await fetch('https://api.zeptomail.com/v1.1/email', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': process.env.ZEPTO_AUTH_TOKEN
            },
            body: JSON.stringify(postFields)
        });
        return response.ok;
    } catch (error) {
        console.error('ZeptoMail Error:', error);
        return false;
    }
}

// 2. إرسال تنبيهات تليجرام
export async function sendToTelegram(message) {
    const baseUrl = process.env.TG_PROXY_URL || "https://api.telegram.org";
    const url = `${baseUrl}/bot${process.env.TG_TOKEN}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: process.env.TG_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });
        return response.ok;
    } catch (error) {
        console.error('Telegram Error:', error);
        return false;
    }
}

// 3. رادار النشاطات (Log User Activity)
export async function logUserActivity(userId, actionType, description) {
    try {
        const db = await connectToDatabase();
        const uId = userId ? userId : null;
        await db.execute(
            "INSERT INTO activity_logs (user_id, action_type, description) VALUES (?, ?, ?)",
            [uId, actionType, description]
        );
    } catch (error) {
        console.error('Log Error:', error);
    }
}

// 4. المحرك المركزي لمعالجة الطلب بعد الدفع الناجح
export async function processCoreOrder(orderId, paymentStatus, paymentMethodName = 'فيزا') {
    const db = await connectToDatabase();
    
    // جلب بيانات الطلب
    const [rows] = await db.execute("SELECT * FROM orders WHERE id = ?", [orderId]);
    if (rows.length === 0) return false;

    const orderData = rows[0];
    const userId = orderData.user_id;
    const cName = orderData.customer_name;
    const cEmail = orderData.customer_email;
    const amount = orderData.total_amount;
    const services = orderData.services_ordered;
    const brief = orderData.project_brief;
    const currentStatus = orderData.status;

    // منع التكرار
    if (currentStatus === 'paid' && paymentStatus === 'paid') return true;

    // تحديث حالة الطلب
    await db.execute("UPDATE orders SET status = 'paid' WHERE id = ?", [orderId]);

    // إدخال الفاتورة
    await db.execute(
        "INSERT INTO invoices (id, user_id, client_name, project_name, amount, status, created_at) VALUES (?, ?, ?, ?, ?, 'paid', NOW())",
        [orderId, userId, cName, services, amount]
    );

    // إدخال المشروع (تسليم بعد 7 أيام)
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 7);
    
    // التعديل هنا: تنسيق التاريخ ليقبله MySQL بدون مشاكل
    const formattedDeadline = deadline.toISOString().split('T')[0]; 

    await db.execute(
        "INSERT INTO projects (id, user_id, invoice_id, title, client_name, deadline, status, progress, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, 'pending', 0, ?, NOW())",
        [orderId, userId, orderId, services, cName, formattedDeadline, brief]
    );

    // إرسال تليجرام
    const telegramMsg = `🚨 <b>تم دفع طلب جديد بنجاح!</b>\n---------------------------\n🔖 <b>رقم الطلب:</b> #${orderId}\n👤 <b>العميل:</b> ${cName}\n📦 <b>الخدمات:</b> ${services}\n💰 <b>المبلغ:</b> ${amount} ج.م\n💳 <b>طريقة الدفع:</b> ${paymentMethodName}\n📝 <b>التفاصيل:</b>\n${brief}\n`;
    await sendToTelegram(telegramMsg);

    // إرسال الإيميل للعميل
    const emailSubject = "تم تأكيد دفع طلبك - Micro Ads";
    const emailBody = `
        <div style='direction: rtl; font-family: Tahoma, sans-serif; text-align: right; padding: 25px; border: 1px solid #e7e5e4; border-radius: 20px; max-width: 600px; margin: 0 auto;'>
            <div style='text-align: center; margin-bottom: 20px;'><h2 style='color: #28a745; margin: 0;'>تم تأكيد الدفع بنجاح ✅</h2></div>
            <p style='color: #44403c; font-size: 14px;'>مرحباً <b>${cName}</b>،</p>
            <p style='color: #44403c; font-size: 14px;'>لقد استلمنا مدفوعاتك بنجاح. إليك تفاصيل طلبك:</p>
            <div style='background: #fdfbf7; padding: 20px; border-radius: 15px; margin: 25px 0; border: 1px dashed #28a745;'>
                <p style='margin: 0 0 10px 0; color: #44403c;'><b>رقم الطلب:</b> #${orderId}</p>
                <p style='margin: 0 0 10px 0; color: #44403c; line-height: 1.6;'><b>الخدمات:</b><br> ${services}</p>
                <p style='margin: 0 0 10px 0; color: #44403c;'><b>المبلغ المدفوع:</b> <span style='color: #28a745; font-weight: bold;'>${amount} ج.م</span></p>
            </div>
            <p style='color: #44403c; font-size: 14px;'>فريقنا سيبدأ العمل على مشروعك فوراً.</p>
        </div>
    `;
    await sendZeptoMail(cEmail, cName, emailSubject, emailBody);

    return true;
}