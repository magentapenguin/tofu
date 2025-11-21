<script lang="ts">
    import { version } from "$app/environment"
import { page } from "$app/state";
</script>

<div class="flex flex-col min-h-screen">
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
    <footer class="p-4 text-sm text-gray-500">
        {#if version.includes("dev")}
            <span>dev</span>
        {:else}
            <a href="https://github.com/magentapenguin/tofu/commit/{version}" class="link text-gray-500">{version.substring(0, 7)}</a>
        {/if}
        
    </footer>
</div>