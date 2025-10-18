import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import type { Provider } from '@supabase/supabase-js'
export const POST: RequestHandler = async ({ url, request, locals: { supabase } }) => {
    const clientData = await request.json()
    const provider = clientData.provider as string
    if (!provider) {
        return json({ message: 'Provider is required', success: false }, { status: 400 })
    }
    const validProviders = ['github', 'azure']
    if (!validProviders.includes(provider)) {
        return json({ message: 'Invalid provider', success: false }, { status: 400 })
    }
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as Provider,
        options: { redirectTo: `${url.origin}/auth/callback`, scopes: 'email' }
    })
    console.log(data, error, `${url.origin}/auth/callback`)
    if (error) {
        return json({ message: error.message, success: false }, { status: 400 })
    } else if (data?.url) {
        return json({ url: data.url, success: true })
    }
    return json({ message: 'Unexpected error', success: false }, { status: 500 })
}
