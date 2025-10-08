<script lang="ts">
	import { enhance } from '$app/forms'
	import { PUBLIC_HCAPTCHA_SITEKEY } from '$env/static/public';
	import type { ActionData, SubmitFunction } from './$types';
	import { hCaptchaLoader } from '@hcaptcha/loader';


	let promise = hCaptchaLoader({ sentry: false });
	let hcaptcha_element: HTMLDivElement;
	promise.then(() => {
		hcaptcha_element.innerHTML=''; // Clear "Loading..." text
		hcaptcha.render(hcaptcha_element, {
			sitekey: PUBLIC_HCAPTCHA_SITEKEY,
			theme: 'dark',
		});
	}).catch((e) => {
		hcaptcha_element.innerHTML = 'Error loading hCaptcha';
		console.error(e);
	});

	interface Props {
		form: ActionData
	}
	let { form }: Props = $props()
	let loading = $state(false)
	const handleSubmit: SubmitFunction = () => {
		loading = true
		return async ({ update }) => {
			update()
			loading = false
		}
	}
</script>

<svelte:head>
	<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"></script>
</svelte:head>
<form method="POST" class="p-2 border border-gray-300 dark:border-gray-800 rounded grid grid-cols-[auto_1fr] items-center gap-3 h-full" use:enhance={handleSubmit}>
	<label for="email">Email</label>
	<input class="input" autocomplete="email" id="email" name="email" />
    <label for="password">Password</label>
	<input class="input" autocomplete="current-password" id="password" name="password" type="password" />
    {#if form?.message !== undefined}
		<div class="{form?.success ? 'text-green-500' : 'text-red-600'} col-span-2">
			{form?.message}
		</div>
	{/if}
	<div class="col-span-2" bind:this={hcaptcha_element}>
		Loading...
	</div>
	<button class="btn col-span-2" type="submit" disabled={loading}>Login</button>
    <div class="col-span-2">
        Don't have an account? <a class="link" href="/auth/register">Register here</a>.
    </div>
</form>
