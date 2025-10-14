<script lang="ts">
	import Dialog from '$lib/Dialog.svelte';
	import Task from '$lib/Task.svelte';
	import { page } from '$app/state';
	import { pushState } from '$app/navigation';
</script>

{#if page.state.new}
	<div>Creating new task...</div>
	<Dialog open={true} onClose={() => pushState('',{new:false})} title="New Task">
		<div>test</div>
	</Dialog>
{/if}
<Task id="1" title="Test Task" onChange={(completed) => console.log('Task completed:', completed)} />
<Task id="2" title="Another Task" syncing={true} />