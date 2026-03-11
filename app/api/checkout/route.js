import { connectToDatabase } from '@/app/lib/db';
import { processCoreOrder } from '@/app/lib/helpers';

export async function POST(request) {
    try {
        const body = await request.json();
        const { userId, customerName, customerPhone, customerEmail, projectBrief, cartIds } = body;

        if (!cartIds || cartIds.length === 0) {
            return NextResponse.json({ error: "السلة فارغة" }, { status: 400 });
        }

        const db = await connectToDatabase();
        
        // حساب الإجمالي وجلب أسماء الخدمات من قاعدة البيانات بناءً على الـ IDs
        const placeholders = cartIds.map(() => '?').join(',');
        const [servicesRows] = await db.execute(`SELECT * FROM services WHERE id IN (${placeholders})`, cartIds);
        
        let totalPrice = 0;
        let servicesArray = [];

        const catNamesAr = { 'branding': 'هوية بصرية', 'packaging': 'تغليف منتجات', 'digital': 'دعاية رقمية' };
        const indNamesAr = { 'restaurants': 'مطاعم وكافيهات', 'realestate': 'عقارات', 'medical': 'طبي', 'education': 'تعليم' }; // اختصرتها للتبسيط

        servicesRows.forEach(service => {
            totalPrice += Number(service.price);
            const serviceName = service.title || service.name || 'خدمة تصميم';
            const catAr = catNamesAr[service.category] || service.category;
            const indAr = indNamesAr[service.industry] || service.industry;
            
            let extraDetails = [];
            if (catAr) extraDetails.push(catAr);
            if (indAr) extraDetails.push(indAr);

            const detailedName = extraDetails.length > 0 ? `${serviceName} (${extraDetails.join(' - ')})` : serviceName;
            servicesArray.push(detailedName);
        });

        const servicesOrdered = servicesArray.join(' + ');

        // إدخال الطلب مبدئياً
        const [orderResult] = await db.execute(
            "INSERT INTO orders (user_id, customer_name, customer_phone, customer_email, payment_method, total_amount, services_ordered, project_brief, status, created_at) VALUES (?, ?, ?, ?, 'visa', ?, ?, ?, 'pending_payment', NOW())",
            [userId || null, customerName, customerPhone, customerEmail, totalPrice, servicesOrdered, projectBrief || 'لا توجد تفاصيل إضافية']
        );
        const orderId = orderResult.insertId;

        // إعدادات Paymob
        const paymobApiKey = process.env.PAYMOB_API_KEY;
        const integrationId = process.env.PAYMOB_CARD_ID;
        const iframeId = process.env.PAYMOB_CARD_IFRAME_ID;

        const nameParts = customerName.split(' ');
        const firstName = nameParts[0] || 'Customer';
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Name';

        // 1. Authentication
        const authRes = await fetch('https://accept.paymob.com/api/auth/tokens', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ api_key: paymobApiKey })
        }).then(res => res.json());
        
        if (!authRes.token) throw new Error('Paymob Auth Failed');

        // 2. Order Registration
        const merchantOrderId = `${orderId}_${Date.now()}`;
        const orderRegRes = await fetch('https://accept.paymob.com/api/ecommerce/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                auth_token: authRes.token,
                delivery_needed: 'false',
                amount_cents: Math.round(totalPrice * 100),
                currency: 'EGP',
                merchant_order_id: merchantOrderId
            })
        }).then(res => res.json());

        if (!orderRegRes.id) throw new Error('Paymob Order Registration Failed');

        // 3. Payment Key
        const paymentKeyRes = await fetch('https://accept.paymob.com/api/acceptance/payment_keys', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                auth_token: authRes.token,
                amount_cents: Math.round(totalPrice * 100),
                expiration: 3600,
                order_id: orderRegRes.id,
                billing_data: {
                    first_name: firstName, last_name: lastName, email: customerEmail, phone_number: customerPhone,
                    apartment: "NA", floor: "NA", street: "NA", building: "NA", shipping_method: "NA",
                    postal_code: "NA", city: "Cairo", country: "EG", state: "NA"
                },
                currency: 'EGP',
                integration_id: integrationId
            })
        }).then(res => res.json());

        if (!paymentKeyRes.token) throw new Error('Paymob Payment Key Failed');

        // إرجاع رابط الـ Iframe للفرونت إند ليقوم بتوجيه المستخدم
        const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentKeyRes.token}`;
        
        return NextResponse.json({ success: true, redirectUrl: iframeUrl });

    } catch (error) {
        console.error("Checkout API Error:", error);
        return NextResponse.json({ error: "حدث خطأ أثناء إعداد عملية الدفع" }, { status: 500 });
    }
}