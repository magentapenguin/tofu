<script lang="ts">
    import { browser } from '$app/environment'
    import { page } from '$app/state'
    import Footer from '$lib/Footer.svelte'
    import Sidebar from '$lib/Sidebar.svelte'
    let { children } = $props()
    import posthog from 'posthog-js'
    if (browser && page.data?.session?.user) {
        posthog.identify(
            page.data.session.user.id,
            {
                email: page.data.session.user.email,
                last_login: page.data.session.user.last_sign_in_at
            },
            { created: page.data.session.user.created_at }
        )
    }
</script>

<div class="flex">
    <Sidebar />
    <div class="flex-grow flex flex-col">
        <main class="container mx-auto p-4 flex-grow">
            {@render children()}
        </main>
        <Footer />
    </div>
</div>
