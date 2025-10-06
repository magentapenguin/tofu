import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
export const GET: RequestHandler = async () => {
    // Expecting 401 Unauthorized if Supabase is up
    try {
        const res = await fetch(`${PUBLIC_SUPABASE_URL}`);
        if (res.status !== 401) {
            throw error(500, 'Supabase is down');
        }
    } catch (e) {
        throw error(500, 'Supabase is down');
    }
    return json({ status: 'ok' });
};