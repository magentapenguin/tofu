import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';


const supabase = 
export const GET: RequestHandler = async () => {
    try {
        const { data, error: dbError } = await supabase.from('health_check').select('*').limit(1).single();
        if (dbError) {
            console.error('Database error:', dbError);
            error(500, 'Database connection error');
        }
        return json({ status: 'ok', data });
    } catch (err) {
        console.error('Health check failed:', err);
        error(500, 'Health check failed');
    }
    return json({ status: 'ok' });
};