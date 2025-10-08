<script lang="ts">
	import Sidebar from '$lib/Sidebar.svelte';
    let { children } = $props()
</script>
<div class="flex">
	<Sidebar />
	<main class="container mx-auto p-4 flex-grow">
		{@render children()}
	</main>
</div>
