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
					'error-callback': () => {
						posthog.capture('captcha-failed');
					},
					'expired-callback': () => {
						posthog.capture('captcha-expired');
					},
					callback: (token: string) => {
						posthog.capture('captcha-success');
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
	let social_login_error = $state<string | null>(null);
	async function socialLogin(provider: string) {
		const response = await fetch('/auth/login/social', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ provider })
		});	
		if (response.ok) {
			const data = await response.json();
			window.location.href = data.url;
		} else {
			const errorData = await response.json();
			social_login_error = errorData.message;
		}
	}

</script>

<form
	method="POST"
	class="p-2 border border-gray-300 dark:border-gray-800 rounded grid grid-cols-[auto_1fr] items-center gap-3 h-full"
	use:enhance={handleSubmit}
>
	<label for="email">Email</label>
	<input class="input" autocomplete="email" id="email" name="email" />
	<label for="password">Password</label>
	<input
		class="input"
		autocomplete="current-password"
		id="password"
		name="password"
		type="password"
	/>
	{#if form?.message !== undefined}
		<div class="{form?.success ? 'text-green-500' : 'text-red-600'} col-span-2">
			{form?.message}
		</div>
	{/if}
	<!-- Social login -->
	<div class="col-span-2 justify-self-center gap-x-2 gap-y-0.5 grid grid-cols-2 justify-items-stretch">
		<div class="col-span-2 flex items-center gap-2 after:grow after:hr before:grow before:hr hr-2 w-full">
			Or
		</div>
		<button class="btn" type="button" onclick={() => socialLogin('azure')}>
			<i class="fa-brands fa-microsoft"></i>
			Login with Microsoft
		</button>
		<button class="btn" type="button" onclick={() => socialLogin('github')}>
			<i class="fa-brands fa-github"></i>
			Login with Github
		</button>
		{#if social_login_error}
			<div class="text-red-600 col-span-2">{social_login_error}</div>
		{/if}
	</div>

	<div class="col-span-2" bind:this={hcaptcha_element}>Loading...</div>
	<button class="btn col-span-2" type="submit" disabled={loading}>Login</button>
	<div class="col-span-2">
		Don't have an account? <a class="link" href="/auth/register">Register here</a>.
	</div>
</form>
