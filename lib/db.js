import { createPool } from '@vercel/postgres';

let pool;

export async function connectToDatabase() {
    if (!pool) {
        pool = createPool({
            connectionString: process.env.POSTGRES_URL
        });
    }

    return {
        // Wrapper لتبسيط التعامل مع Postgres كأنها MySQL
        execute: async (query, values) => {
            let pgQuery = query;
            if (values && values.length > 0) {
                let i = 1;
                while (pgQuery.includes('?')) {
                    pgQuery = pgQuery.replace('?', `$${i}`);
                    i++;
                }
            }

            // إضافة Returning ID في حال كانت العملية إدخال (INSERT)
            const isInsert = pgQuery.trim().toUpperCase().startsWith('INSERT');
            if (isInsert && !pgQuery.toUpperCase().includes('RETURNING')) {
                pgQuery += ' RETURNING id';
            }

            const result = await pool.query(pgQuery, values);
            
            if (isInsert) {
                return [{ insertId: result.rows[0]?.id }];
            }
            return [result.rows];
        }
    };
}