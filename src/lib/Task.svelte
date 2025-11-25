<script lang="ts">
    import { offset, flip, shift, autoUpdate, computePosition } from '@floating-ui/dom'
    import { scale } from 'svelte/transition'
    import { cubicOut } from 'svelte/easing'
    import { humanizeTimestamp } from '$lib'
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
            title?: string
            description?: string
            due?: string
            id: string
        }) => void
    }
    let {
        id,
        title: initialTitle,
        description: initialDescription,
        completed: done,
        due: initialDue,
        syncing = false,
        onDelete,
        onChange,
        onModify
    }: Props = $props()
    let completed = $state(done ?? false)
    let title = $state(initialTitle)
    let description = $state(initialDescription)
    let due = $state(initialDue)
    let editing = $state(false)
    let showMenu = $state(false)
    let menu: HTMLDivElement | undefined = $state()
    let menuAnchor: Element
    
    // Sync local state with prop changes
    $effect(() => {
        completed = done ?? false
    })
    
    $effect(() => {
        title = initialTitle
    })
    
    $effect(() => {
        description = initialDescription
    })
    
    $effect(() => {
        due = initialDue
    })
    
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
        showMenu = false
    }
    function stopEditing() {
        editing = false
        showMenu = false
        onModify?.({ title, description, due, id })
    }
    
    function handleDelete() {
        showMenu = false
        onDelete?.({ id })
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
    function handleClickOutside(event: MouseEvent) {
        if (
            showMenu &&
            menu &&
            !menu.contains(event.target as Node) &&
            !menuAnchor.parentNode?.contains(event.target as Node)
        ) {
            showMenu = false
        }
    }
</script>

<svelte:window onclick={handleClickOutside} />
<div
    class="p-4 border border-gray-200 dark:border-gray-800 rounded-lg mb-4 bg-white dark:bg-gray-900 shadow-sm grid gap-1 gap-x-3"
    style="grid-template-columns: auto 1fr auto; grid-template-rows: auto auto; grid-template-areas: 'checkbox title actions' 'description description actions';">
    <button
        class="{!completed
            ? 'border-2 border-gray-400 dark:border-gray-600'
            : 'bg-emerald-500 shadow-emerald-400 [box-shadow:0_1px_1px_0_inset_var(--tw-shadow-color)]'} size-8 rounded-md not-disabled:cursor-pointer self-center [grid-area:checkbox] text-white"
        disabled={syncing}
        aria-busy={syncing}
        aria-checked={completed}
        role="checkbox"
        onclick={toggleCompleted}>
        {#if syncing}
            <span class="sr-only">Syncing...</span>
            <i class="fa-solid fa-rotate fa-spin {!completed ? "text-gray-400 dark:text-gray-600" : "text-white"}"></i>
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
    <div class="text-gray-500 dark:text-gray-400 [grid-area:description]">
        {#if editing}
            <textarea
                bind:value={description}
                class="w-full border p-1 rounded border-gray-300 dark:border-gray-700"></textarea>
            <div class="mt-2">
                <label for="due-{id}" class="mr-2 font-semibold">Due Date:</label>
                <input
                    type="datetime-local"
                    id="due-{id}"
                    value={new Date(due ?? '').toISOString().substring(0, 16)}
                    oninput={(e) => {
                        const value = (e.target as HTMLInputElement).value
                        due = value ? new Date(value).toISOString() : undefined
                    }}
                    class="border-b border-gray-300 dark:border-gray-700 bg-transparent focus:outline-none" />
            </div>
        {:else}
            <p class="text-wrap max-w-full">{description}</p>
            {#if due}
                <div class="mt-1 text-sm text-gray-400 dark:text-gray-500">
                    Due {humanizeTimestamp(due, true)}
                </div>
            {/if}
        {/if}
    </div>
    <button
        class="btn-transparent self-stretch justify-self-end [grid-area:actions] text-lg"
        onclick={showActions}
        aria-haspopup="true"
        aria-expanded={showMenu}>
        <i class="fa-solid fa-ellipsis-vertical *:w-auto! text-xl" bind:this={menuAnchor}></i>
        <span class="sr-only">Task actions</span>
    </button>
    {#if showMenu}
        <div
            bind:this={menu}
            class="dropdown-menu"
            role="menu"
            transition:scale={{ duration: 100, easing: cubicOut }}>
            {#if editing}
                <button class="dropdown-item" onclick={stopEditing}>
                    <i class="fa-solid fa-pen-slash"></i>
                    Stop Editing
                </button>
            {:else}
                <button class="dropdown-item" onclick={startEditing} disabled={syncing}>
                    <i class="fa-solid fa-pen"></i>
                    Edit
                </button>
            {/if}
            {#if onDelete}
                <button class="dropdown-item text-red-600 dark:text-red-400" onclick={handleDelete} disabled={syncing}>
                    <i class="fa-solid fa-trash"></i>
                    Delete
                </button>
            {/if}
        </div>
    {/if}
</div>
