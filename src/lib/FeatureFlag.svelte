<script lang="ts">
    import posthog from "posthog-js";
    import type { Snippet } from "svelte";

    const props = $props();
    const { flag, ...cases } = props;
    const snippets = cases as Record<string, Snippet<[any]>>;
</script>

{#each Object.entries(snippets) as [value, snippet]}
    {#if posthog.getFeatureFlag(flag) === value}
        {@render snippet(posthog.getFeatureFlagPayload(flag)) }
    {/if}
{/each}