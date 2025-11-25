import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import type { Provider } from '@supabase/supabase-js'
import { correctOrigin } from '$lib'
export const POST: RequestHandler = async ({ url, request, locals: { supabase } }) => {
    const clientData = await request.json()
    const provider = clientData.provider as string
    if (!provider) {
        return json({ message: 'Provider is required', name: 'missing_provider', success: false }, { status: 400 })
    }
    const validProviders = ['github', 'azure']
    if (!validProviders.includes(provider)) {
        return json({ message: 'Invalid provider', name: 'invalid_provider', success: false }, { status: 400 })
    }
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as Provider,
        options: { redirectTo: `${correctOrigin(url)}/auth/callback`, scopes: 'email profile' }
    })
    console.log(data, error, `${correctOrigin(url)}/auth/callback`)
    if (error) {
        return json({ message: error.message, name: error.name, success: false }, { status: 400 })
    } else if (data?.url) {
        return json({ url: data.url, success: true })
    }
    return json({ message: 'Unexpected error', name: 'unexpected_error', success: false }, { status: 500 })
}
