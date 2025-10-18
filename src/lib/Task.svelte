<script lang="ts">
    import { offset, flip, shift, autoUpdate, computePosition } from '@floating-ui/dom'
    import { scale } from 'svelte/transition'
    import { cubicOut } from 'svelte/easing'
    interface Props {
        id: string
        title: string
        description: string
        due?: string
        completed?: boolean
        syncing?: boolean
        onDelete?: ({ id }: { id: string }) => void
        onChange?: ({ completed, id }: { completed: boolean; id: string }) => void
        onModify?: ({
            title,
            description,
            due,
            id
        }: {
            title: string
            description?: string
            due?: string
            id: string
        }) => void
    }
    let {
        id,
        title,
        description,
        completed: done,
        due,
        syncing = false,
        onDelete,
        onChange,
        onModify
    }: Props = $props()
    let completed = $state(done ?? false)
    let editing = $state(false)
    let showMenu = $state(false)
    let menu: HTMLDivElement | undefined = $state()
    let menuAnchor: Element
    function toggleCompleted() {
        completed = !completed
        onChange?.({ completed, id })
    }
    function showActions() {
        showMenu = !showMenu
        console.log(menu, showMenu)
    }
    function startEditing() {
        editing = true
    }
    function stopEditing() {
        editing = false
        onModify?.({ title, description, due, id })
    }

    $effect(() => {
        if (showMenu && menu && menuAnchor) {
            const cleanup = autoUpdate(menuAnchor, menu, () => {
                if (!menu || !menuAnchor) return
                computePosition(menuAnchor, menu, {
                    middleware: [offset(1), flip(), shift({ padding: 4 })]
                }).then(({ x, y }) => {
                    if (!menu) return
                    Object.assign(menu.style, {
                        left: `${x}px`,
                        top: `${y}px`
                    })
                })
            })
            return () => cleanup()
        }
    })
</script>

<div
    class="p-4 border border-gray-200 dark:border-gray-800 rounded-lg mb-4 bg-white dark:bg-gray-900 shadow-sm grid gap-1 gap-x-3"
    style="grid-template-columns: auto 1fr auto; grid-template-rows: auto auto; grid-template-areas: 'checkbox title actions' 'description description actions';">
    <button
        class="{!completed
            ? 'border-2 border-gray-400 dark:border-gray-600'
            : 'bg-emerald-500 shadow-emerald-400 [box-shadow:0_1px_1px_0_inset_var(--tw-shadow-color)]'} size-8 rounded-md not-disabled:cursor-pointer self-center [grid-area:checkbox]"
        disabled={syncing}
        aria-busy={syncing}
        aria-checked={completed}
        role="checkbox"
        onclick={toggleCompleted}>
        {#if syncing}
            <span class="sr-only">Syncing...</span>
            <i class="fa-solid fa-rotate fa-spin text-gray-400 dark:text-gray-600"></i>
        {:else if completed}
            <span class="sr-only">Completed</span>
            <i class="fa-solid fa-check"></i>
        {:else}
            <span class="sr-only">Not completed</span>
            <div class="select-none" aria-hidden="true">&nbsp;</div>
        {/if}
    </button>
    <h3 class="text-lg font-medium [grid-area:title] border-b border-gray-200 dark:border-gray-800">
        {#if editing}
            <input
                type="text"
                bind:value={title}
                class="border-b border-gray-300 dark:border-gray-700 bg-transparent focus:outline-none w-full" />
        {:else}
            {title}
        {/if}
    </h3>
    <p class="text-gray-500 dark:text-gray-400 [grid-area:description]">{description}</p>
    <button
        class="sidebar-btn self-stretch justify-self-end [grid-area:actions] text-lg"
        onclick={showActions}
        aria-haspopup="true"
        aria-expanded={showMenu}>
        <i class="fa-solid fa-ellipsis-vertical *:w-auto! text-xl" bind:this={menuAnchor}></i>
        <span class="sr-only">Task actions</span>
    </button>
    {#if showMenu}
        <div bind:this={menu} class="dropdown-menu" role="menu" transition:scale={{ duration: 100, easing: cubicOut }}>
            {#if editing}
                <button class="dropdown-item" onclick={stopEditing}>
                    <i class="fa-solid fa-pen-slash"></i>
                    Stop Editing
                </button>
            {:else}
                <button class="dropdown-item" onclick={startEditing}>
                    <i class="fa-solid fa-pen"></i>
                    Edit
                </button>
            {/if}
            {#if onDelete}
                <button class="dropdown-item text-red-600" onclick={() => onDelete?.({ id })}
                    >Delete</button>
            {/if}
        </div>
    {/if}
</div>
