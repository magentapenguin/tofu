import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public';
export const GET: RequestHandler = async () => {
    // Ping the Supabase REST endpoint to check if the service is up
    const response = await fetch(`${PUBLIC_SUPABASE_URL}/rest/v1/tasks`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            apikey: PUBLIC_SUPABASE_PUBLISHABLE_KEY
        }
    });

    if (response.ok) {
        // check if the response is [] (empty array because RLS is enabled)
        const data = await response.json();
        if (Array.isArray(data) && data.length === 0) {
            return json({ status: 'ok', message: 'Supabase service is up' });
        } else {
            throw error(503, 'RLS might be broken!');
        }
    } else {
        throw error(503, 'Supabase service is down');
    }
};