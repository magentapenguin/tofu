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
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirm-password') as string
        const hcaptchaToken = formData.get('h-captcha-response') as string
        // check if passwords match
        if (password !== confirmPassword) {
            return fail(400, { message: 'Passwords do not match', success: false })
        }
        // simple validation
        if (!email || !password) {
            return fail(400, { message: 'Email and password are required', success: false })
        }
        const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        if (!validEmail) {
            return fail(400, { message: 'Invalid email address', success: false })
        }
        const requestOrigin = url.origin
        const { data, error } = await supabase.auth.signUp({ email, password, options: { captchaToken: hcaptchaToken, emailRedirectTo: `${requestOrigin}/auth/confirm` } })
        if (error || !data.user) {
            return fail(400, { message: error?.message ?? 'Registration failed', success: false })
        }
        return { message: 'Registration successful! Please check your email to confirm your account.', success: true }
	}
}