import * as Sentry from '@sentry/sveltekit'
import { createServerClient } from '@supabase/ssr'
import { type Handle, redirect } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_POSTHOG_KEY } from '$env/static/public'
import { PostHog } from 'posthog-node';

const posthog_client = new PostHog(PUBLIC_POSTHOG_KEY)

const supabase: Handle = async ({ event, resolve }) => {
    /**
     * Creates a Supabase client specific to this server request.
     *
     * The Supabase client gets the Auth token from the request cookies.
     */
    event.locals.supabase = createServerClient(
        PUBLIC_SUPABASE_URL,
        PUBLIC_SUPABASE_PUBLISHABLE_KEY,
        {
            cookies: {
                getAll: () => event.cookies.getAll(),
                /**
                 * SvelteKit's cookies API requires `path` to be explicitly set in
                 * the cookie options. Setting `path` to `/` replicates previous/
                 * standard behavior.
                 */
                setAll: (cookiesToSet) => {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        event.cookies.set(name, value, { ...options, path: '/' })
                    })
                }
            }
        }
    )

    /**
     * Unlike `supabase.auth.getSession()`, which returns the session _without_
     * validating the JWT, this function also calls `getUser()` to validate the
     * JWT before returning the session.
     */
    event.locals.safeGetSession = async () => {
        const {
            data: { session }
        } = await event.locals.supabase.auth.getSession()
        if (!session) {
            return { session: null, user: null }
        }

        const {
            data: { user },
            error
        } = await event.locals.supabase.auth.getUser()
        if (error) {
            // JWT validation has failed
            return { session: null, user: null }
        }

        return { session, user }
    }

    return resolve(event, {
        filterSerializedResponseHeaders(name) {
            /**
             * Supabase libraries use the `content-range` and `x-supabase-api-version`
             * headers, so we need to tell SvelteKit to pass it through.
             */
            return name === 'content-range' || name === 'x-supabase-api-version'
        }
    })
}

const authGuard: Handle = async ({ event, resolve }) => {
    const { session, user } = await event.locals.safeGetSession()
    event.locals.session = session
    event.locals.user = user

    if (!event.locals.session && event.url.pathname.startsWith('/user')) {
        redirect(303, '/auth')
    }

    if (event.locals.session && event.url.pathname === '/auth') {
        redirect(303, '/user')
    }

    return resolve(event)
}

const posthog_url = '/relay-7f73'

const posthog: Handle = async ({ event, resolve }) => {
    const { pathname } = event.url

    if (pathname.startsWith(posthog_url)) {
        // Determine target hostname based on static or dynamic ingestion
        const hostname = pathname.startsWith(posthog_url+'/static/')
            ? 'us-assets.i.posthog.com' // change us to eu for EU Cloud
            : 'us.i.posthog.com' // change us to eu for EU Cloud

        // Build external URL
        const url = new URL(event.request.url)
        url.protocol = 'https:'
        url.hostname = hostname
        url.port = '443'
        url.pathname = pathname.replace(posthog_url, '')

        // Clone and adjust headers
        const headers = new Headers(event.request.headers)
        headers.set('Accept-Encoding', '')
        headers.set('host', hostname)

        // Proxy the request to the external host
        const response = await fetch(url.toString(), {
            method: event.request.method,
            headers,
            body: event.request.body,
            duplex: 'half' // Enable streaming
        } as RequestInit)

        return response
    }

    const response = await resolve(event)
    return response
}

export const handle: Handle = sequence(Sentry.sentryHandle(), sequence(supabase, authGuard, posthog))
//@ts-expect-error
export const handleError = Sentry.handleErrorWithSentry(async ({ error, status }) => {
  if (status !== 404) {
        console.error('error:', error);
      posthog_client.captureException(error);
      await posthog_client.shutdown();
  }
});
