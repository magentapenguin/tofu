<script lang="ts">
    import Dialog from "$lib/Dialog.svelte"
    let open = $state(false)
</script>
<a href="/auth/register" class="link">Register</a>
or <a href="/auth/login" class="link">Login</a>
<button class="text-white/40 text-sm cursor-text select-text" onclick={() => open = true}>(how did you get here?)</button>
<Dialog title="How did you get here?" bind:open={open}>
    <p>This is a dialog</p>
</Dialog>