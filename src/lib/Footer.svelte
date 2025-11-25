<script lang="ts">
    import { version } from "$app/environment"
    import { onMount } from "svelte"

    let { compact = false, wide = false }: { compact?: boolean, wide?: boolean } = $props()

    function getCurrentThemeName() {
        if (typeof localStorage === 'undefined') {
            return 'Auto'
        }
        const storedTheme = localStorage.getItem('theme')
        if (storedTheme === 'light') {
            return 'Light'
        } else if (storedTheme === 'dark') {
            return 'Dark'
        } else {
            return 'Auto'
        }
    }
    function toggleTheme() {
        const currentTheme = getCurrentThemeName()
        let newTheme: string
        if (currentTheme === 'Light') {
            newTheme = 'Dark'
        } else if (currentTheme === 'Dark') {
            newTheme = 'Auto'
        } else {
            newTheme = 'Light'
        }

        if (newTheme === 'Light') {
            localStorage.setItem('theme', 'light')
        } else if (newTheme === 'Dark') {
            localStorage.setItem('theme', 'dark')
        } else {
            localStorage.removeItem('theme')
        }
        document.documentElement.classList.toggle(
            "dark",
            localStorage.theme === "dark" ||
                (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches),
        );
    }
    let currentThemeName = $state(getCurrentThemeName());
    onMount(() => {
        window.addEventListener('storage', (event) => {
            if (event.key === 'theme') {
                currentThemeName = getCurrentThemeName();
            }
        });
    })
    
</script>
<footer class="{compact ? '' : 'p-4'} text-sm text-secondary {wide ? 'w-full flex justify-evenly col-span-full' : ''}">
    {#if version.includes("dev")}
        <span>dev</span>
    {:else}
        <a href="https://github.com/magentapenguin/tofu/commit/{version}" class="link-secondary">{version.substring(0, 7)}</a>
    {/if}
      
    <button
        class="link-secondary"
        type="button"
        onclick={() => {
            toggleTheme()
            currentThemeName = getCurrentThemeName()
        }}
    >{currentThemeName}</button>
</footer>