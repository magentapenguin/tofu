<script lang="ts">
	import { enhance } from '$app/forms';
	import { PUBLIC_HCAPTCHA_SITEKEY } from '$env/static/public';
	import { onMount } from 'svelte';
	import posthog from 'posthog-js';
	import type { ActionData, SubmitFunction } from './$types';
	import { hCaptchaLoader } from '@hcaptcha/loader';

	let promise = hCaptchaLoader({ sentry: false });
	let hcaptcha_element: HTMLElement | undefined = $state();
	onMount(() => {
		if (hcaptcha_element === undefined) return console.error('hcaptcha_element is undefined');
		promise
			.then(() => {
				hcaptcha_element!.innerHTML = ''; // Clear "Loading..." text
				hcaptcha.render(hcaptcha_element!, {
					sitekey: PUBLIC_HCAPTCHA_SITEKEY,
					theme: 'dark',
					"error-callback": () => {
						posthog.capture('captcha-failed')
					},
					"expired-callback": () => {
						posthog.capture('captcha-expired')
					},
					callback: (token: string) => {
						posthog.capture('captcha-success')
					}
				});
			})
			.catch((e) => {
				console.error(e);
				hcaptcha_element!.innerHTML = 'Error loading hCaptcha';
			});
	});

	interface Props {
		form: ActionData;
	}
	let { form }: Props = $props();
	let loading = $state(false);
	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async ({ update }) => {
			update();
			// reset hCaptcha
			if (hcaptcha_element !== undefined && typeof hcaptcha !== 'undefined') {
				hcaptcha.reset();
			}
			loading = false;
		};
	};
</script>

<form
	method="POST"
	class="p-2 border border-gray-300 dark:border-gray-800 rounded grid grid-cols-[auto_1fr] items-center gap-3 h-full"
	use:enhance={handleSubmit}
>
	<label for="email">Email</label>
	<input class="input" autocomplete="email" id="email" name="email" />
	{#if form?.message !== undefined}
		<div class="{form?.success ? 'text-green-500' : 'text-red-600'} col-span-2">
			{form?.message}
		</div>
	{/if}
	<div class="col-span-2" bind:this={hcaptcha_element}>Loading hCaptcha...</div>
	<button class="btn col-span-2" type="submit" disabled={loading}>Reset Password</button>
</form>
