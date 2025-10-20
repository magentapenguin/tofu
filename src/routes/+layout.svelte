<script lang="ts">
	import '../app.tailwind.css';
	import { posthog } from 'posthog-js';
	import favicon from '$lib/assets/favicon.svg';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

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
	posthog.init('phc_CbHOw79fze405aeNYJKiCPEb8jLqujU2zKKWWRHdpR9', {
        api_host: 'https://us.i.posthog.com',
        defaults: '2025-05-24',
        person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
    });
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<script src="https://kit.fontawesome.com/2de8bdc654.js" crossorigin="anonymous" data-auto-replace-svg="nest"></script>
</svelte:head>

{@render children?.()}
