<script lang="ts">
	import Dialog from '$lib/Dialog.svelte';
	import { page } from '$app/state';
	import { pushState } from '$app/navigation';
</script>

{#if page.state.new}
	<div>Creating new task...</div>
	<Dialog open={true} onClose={() => pushState('',{new:false})} title="New Task">
		<div>test</div>
	</Dialog>
{/if}