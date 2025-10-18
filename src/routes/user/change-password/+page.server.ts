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
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirm-password') as string
        const hcaptchaToken = formData.get('h-captcha-response') as string
        // check if passwords match
        if (password !== confirmPassword) {
            return fail(400, { message: 'Passwords do not match', success: false })
        }
        // simple validation
        if (!password) {
            return fail(400, { message: 'Password is required', success: false })
        }
        const requestOrigin = url.origin
        const { data, error } = await supabase.auth.updateUser({ password })
        if (error || !data.user) {
            return fail(400, { message: error?.message ?? 'Update failed', success: false })
        }
        return { message: 'Password updated successfully!', success: true }
    }
}