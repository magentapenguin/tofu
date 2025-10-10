<script lang="ts">
    import { page } from "$app/state";
</script>

<div class="flex">
    <main class="container mx-auto p-4 flex-grow">
        <h1 class="text-2xl font-bold mb-4">Welcome to Tofu!</h1>
        <p class="mb-4">It's a free and open-source todo list app</p>
        {#if page.data.session?.user}
            <div class="flex gap-2">
                <a href="/user" class="btn">Dashboard</a>
            </div>
        {:else}
            <div class="flex gap-2">
                <a href="/auth/login" class="btn">Login</a>
                <a href="/auth/register" class="btn">Register</a>
            </div>
        {/if}
    </main>
</div>