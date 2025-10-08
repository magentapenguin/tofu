<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import posthog from 'posthog-js';
	import { browser } from '$app/environment';
	import { PUBLIC_POSTHOG_KEY } from '$env/static/public';

	let { data, children } = $props();
	let { session, supabase } = $derived(data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});

	onMount(() => {
		if (browser) {
			posthog.init(PUBLIC_POSTHOG_KEY, {
				api_host: 'https://us.i.posthog.com',
				defaults: '2025-05-24',
				person_profiles: 'always' // or 'always' to create profiles for anonymous users as well
			});
			console.log('PostHog initialized');
		}
		return;
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
