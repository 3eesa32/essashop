import { createPool } from '@vercel/postgres';

let pool;

export async function connectToDatabase() {
    if (!pool) {
        pool = createPool({
            connectionString: process.env.POSTGRES_URL
        });
    }

    // خدعة برمجية (Wrapper) عشان الموقع يفضل شغال بأكواد MySQL القديمة بدون أي تعديل
    return {
        execute: async (query, values) => {
            let pgQuery = query;
            
            // 1. تحويل علامات ? إلى $1, $2 الخاصة بـ Postgres
            if (values && values.length > 0) {
                let i = 1;
                while (pgQuery.includes('?')) {
                    pgQuery = pgQuery.replace('?', `$${i}`);
                    i++;
                }
            }

            // 2. تظبيط أوامر الإدخال عشان ترجع رقم الطلب (insertId) زي ما كود الدفع بتاعك متوقع
            const isInsert = pgQuery.trim().toUpperCase().startsWith('INSERT');
            if (isInsert && !pgQuery.toUpperCase().includes('RETURNING')) {
                pgQuery += ' RETURNING id';
            }

            // 3. تنفيذ الأمر
            const result = await pool.query(pgQuery, values);

            // 4. إرجاع النتيجة بنفس شكل MySQL بالضبط
            if (isInsert) {
                return [{ insertId: result.rows[0]?.id }];
            }
            return [result.rows];
        }
    };
}
