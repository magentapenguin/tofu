<script lang="ts">
	import { enhance } from '$app/forms'
	import { PUBLIC_TURNSTILE_SITEKEY } from '$env/static/public';
	import type { ActionData, SubmitFunction } from './$types'
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
	// @ts-ignore
	if (typeof window !== 'undefined' && window.turnstile !== undefined) {
		// @ts-ignore
		window.turnstile.ready(() => {
		// @ts-ignore
			window.turnstile.render('#turnstile', {
				sitekey: PUBLIC_TURNSTILE_SITEKEY,
				callback: (token: string) => {
					
				}
			})
		})
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
	<label for="confirm-password">Confirm Password</label>
	<input class="input" autocomplete="current-password" id="confirm-password" name="confirm-password" type="password" />
    {#if form?.message !== undefined}
		<div class="{form?.success ? 'text-green-500' : 'text-red-600'} col-span-2">
			{form?.message}
		</div>
	{/if}
	<div class="col-span-2" id="turnstile"></div>
	<button class="btn col-span-2" type="submit">Register</button>
    <div class="col-span-2">
        Already have an account? <a class="link" href="/auth/login">Login here</a>.
    </div>
</form>
