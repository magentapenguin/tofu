<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		open?: boolean;
		onClose?: (reason: string) => void;
		children: Snippet;
		title: string | Snippet;
	}
	let { open = $bindable(false), children, onClose, title }: Props = $props();
	function _close(reason: string) {
		open = false;
		onClose?.(reason);
	}
	
</script>
<div class="fixed -translate-1/2 top-1/2 left-1/2 min-h-60 min-w-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-2 m-5 z-50 rounded-lg" hidden={!open} role="dialog" aria-modal="true">
	<div class="text-2xl -m-2 mb-1 p-2 bg-gray-200 dark:bg-gray-800 font-semibold rounded-t-lg">
		{#if typeof title === 'string'}
			{title}
		{:else}
			{@render title()}
		{/if}
		<button class="float-right cursor-pointer" onclick={() => _close('button')} aria-label="Close dialog"><i class="fa-solid fa-xmark"></i></button>
	</div>
    <div>
        {@render children()}
    </div>
</div>
{#if open}
	<div class="fixed inset-0 bg-black/40 z-40" onclick={() => _close('backdrop')} aria-hidden="true"></div>
{/if}