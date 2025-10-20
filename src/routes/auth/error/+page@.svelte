<script lang="ts">
    import { page } from "$app/state";
    let query = page.url.searchParams;
</script>
<div class="absolute top-1/2 left-1/2 -translate-1/2 flex flex-col gap-1">
    <h1 class="text-2xl font-bold">Authentication Error</h1>
    <h2 class="text-lg">{query.get("error")}</h2>
    <div class="input">
        {query.get("error_description")}
    </div>
    <a href="/auth/login" class="btn">Go to Login</a>
    <a href="/auth/register" class="btn">Go to Register</a>
    <a href="/" class="btn">Go to Home</a>
</div>