// src/routes/+page.server.ts
import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url, locals: { safeGetSession } }) => {
  const { session } = await safeGetSession()

  // if the user is already logged in return them to the account page
  if (session) {
    redirect(303, '/user')
  }

  return { url: url.origin }
}

export const actions: Actions = {
    default: async (event) => {
        const {
            url,
            request,
            locals: { supabase }
        } = event
        const formData = await request.formData()
        const email = formData.get('email') as string
        const hcaptchaToken = formData.get('h-captcha-response') as string
        // simple validation
        if (!email) {
            return fail(400, { message: 'Email is required', success: false })
        }
        const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        if (!validEmail) {
            return fail(400, { message: 'Invalid email address', success: false })
        }
        const requestOrigin = url.origin
        const { error } = await supabase.auth.resetPasswordForEmail(email, { captchaToken: hcaptchaToken, redirectTo: `${requestOrigin}/user/change-password` })
        if (error) {
            return fail(400, { message: error?.message ?? 'Reset password failed', success: false })
        }
        return { message: 'Reset password successful! Please check your email to confirm your new password.', success: true }
    }
}