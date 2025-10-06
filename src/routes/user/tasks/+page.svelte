<script lang="ts">
	import Sidebar from '$lib/Sidebar.svelte';
	import Dialog from '$lib/Dialog.svelte';
	import { page } from '$app/state';
	import { pushState, replaceState } from '$app/navigation';
</script>
<div class="flex">
	<Sidebar />
	<main class="container mx-auto p-4 flex-grow">
		{#if page.state.new}
			<div>Creating new task...</div>
			<Dialog open={true} onClose={() => pushState('',{new:false})} title="New Task">
				<div>test</div>
			</Dialog>
		{/if}
	</main>
</div>
