<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="container p-4 absolute inset-0 flex flex-col justify-center items-center">
    <h1 class="text-6xl font-bold text-center">{page.status}</h1>
    <p class="mb-2 text-center text-xl">{page.error?.message ?? 'An unexpected error occurred.'}</p>
    <a href="/" class="link">Go back to home</a>
</div>