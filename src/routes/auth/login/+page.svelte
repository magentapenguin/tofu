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
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class="icon icon-7"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path
				d="M96 96L310.6 96L310.6 310.6L96 310.6L96 96zM329.4 96L544 96L544 310.6L329.4 310.6L329.4 96zM96 329.4L310.6 329.4L310.6 544L96 544L96 329.4zM329.4 329.4L544 329.4L544 544L329.4 544L329.4 329.4z"/>
			</svg>
			Login with Microsoft
		</button>
		<button class="btn" type="button" onclick={() => socialLogin('github')}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class="icon icon-7"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path
					d="M237.9 461.4C237.9 463.4 235.6 465 232.7 465C229.4 465.3 227.1 463.7 227.1 461.4C227.1 459.4 229.4 457.8 232.3 457.8C235.3 457.5 237.9 459.1 237.9 461.4zM206.8 456.9C206.1 458.9 208.1 461.2 211.1 461.8C213.7 462.8 216.7 461.8 217.3 459.8C217.9 457.8 216 455.5 213 454.6C210.4 453.9 207.5 454.9 206.8 456.9zM251 455.2C248.1 455.9 246.1 457.8 246.4 460.1C246.7 462.1 249.3 463.4 252.3 462.7C255.2 462 257.2 460.1 256.9 458.1C256.6 456.2 253.9 454.9 251 455.2zM316.8 72C178.1 72 72 177.3 72 316C72 426.9 141.8 521.8 241.5 555.2C254.3 557.5 258.8 549.6 258.8 543.1C258.8 536.9 258.5 502.7 258.5 481.7C258.5 481.7 188.5 496.7 173.8 451.9C173.8 451.9 162.4 422.8 146 415.3C146 415.3 123.1 399.6 147.6 399.9C147.6 399.9 172.5 401.9 186.2 425.7C208.1 464.3 244.8 453.2 259.1 446.6C261.4 430.6 267.9 419.5 275.1 412.9C219.2 406.7 162.8 398.6 162.8 302.4C162.8 274.9 170.4 261.1 186.4 243.5C183.8 237 175.3 210.2 189 175.6C209.9 169.1 258 202.6 258 202.6C278 197 299.5 194.1 320.8 194.1C342.1 194.1 363.6 197 383.6 202.6C383.6 202.6 431.7 169 452.6 175.6C466.3 210.3 457.8 237 455.2 243.5C471.2 261.2 481 275 481 302.4C481 398.9 422.1 406.6 366.2 412.9C375.4 420.8 383.2 435.8 383.2 459.3C383.2 493 382.9 534.7 382.9 542.9C382.9 549.4 387.5 557.3 400.2 555C500.2 521.8 568 426.9 568 316C568 177.3 455.5 72 316.8 72zM169.2 416.9C167.9 417.9 168.2 420.2 169.9 422.1C171.5 423.7 173.8 424.4 175.1 423.1C176.4 422.1 176.1 419.8 174.4 417.9C172.8 416.3 170.5 415.6 169.2 416.9zM158.4 408.8C157.7 410.1 158.7 411.7 160.7 412.7C162.3 413.7 164.3 413.4 165 412C165.7 410.7 164.7 409.1 162.7 408.1C160.7 407.5 159.1 407.8 158.4 408.8zM190.8 444.4C189.2 445.7 189.8 448.7 192.1 450.6C194.4 452.9 197.3 453.2 198.6 451.6C199.9 450.3 199.3 447.3 197.3 445.4C195.1 443.1 192.1 442.8 190.8 444.4zM179.4 429.7C177.8 430.7 177.8 433.3 179.4 435.6C181 437.9 183.7 438.9 185 437.9C186.6 436.6 186.6 434 185 431.7C183.6 429.4 181 428.4 179.4 429.7z"
				/>
			</svg>
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
