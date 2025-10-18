import { redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
    const code = url.searchParams.get('code') as string;
    const next = url.searchParams.get('next') ?? '/user'
    /**
     * Clean up the redirect URL by deleting the Auth flow parameters.
     *
     * `next` is preserved for now, because it's needed in the error case.
     */
    const redirectTo = new URL(url)
    redirectTo.pathname = next
    redirectTo.searchParams.delete('code')
    if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            redirectTo.searchParams.delete('next')
            redirect(303, redirectTo)
        }
    }
    redirectTo.pathname = '/auth/error'
    redirect(303, redirectTo)
}
