<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, SubmitFunction } from './$types';

	interface Props {
		form: ActionData;
	}
	let { form }: Props = $props();
	let loading = $state(false);
	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async ({ update }) => {
			update();
			loading = false;
		};
	};
</script>

<form
	method="POST"
	class="p-2 border border-gray-300 dark:border-gray-800 rounded grid grid-cols-[auto_1fr] items-center gap-3 h-full"
	use:enhance={handleSubmit}
>
	<label for="password">New Password</label>
	<input
		class="input"
		autocomplete="current-password"
		id="password"
		name="password"
		type="password"
	/>
	<label for="confirm-password">Confirm Password</label>
	<input
		class="input"
		autocomplete="current-password"
		id="confirm-password"
		name="confirm-password"
		type="password"
	/>
	{#if form?.message !== undefined}
		<div class="{form?.success ? 'text-green-500' : 'text-red-600'} col-span-2">
			{form?.message}
		</div>
	{/if}
	<button class="btn col-span-2" type="submit" disabled={loading}>Change Password</button>
</form>
