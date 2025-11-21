<script lang="ts">
	import { goto, afterNavigate } from '$app/navigation';
    import { page } from '$app/state'
    import { onMount } from 'svelte'
	

	function handleClick(event: MouseEvent) {
		const target = event.currentTarget as HTMLButtonElement;
		const href = target.dataset.href;
		if (href) {
			goto(href);
		}
	}
	function newTask(event: MouseEvent) {
		goto('/user/tasks', { state: { new: true } });
	}
	let sidebar: HTMLElement;
	function toggleSidebar() {
		if (sidebar) {
			sessionStorage.setItem('sidebar-collapsed', sidebar.classList.toggle('collapsed') ? 'true' : 'false');
		}
	}
	onMount(() => {
		const collapsed = sessionStorage.getItem('sidebar-collapsed');
		if (collapsed === 'true') {
			if (sidebar) {
				sidebar.classList.add('collapsed');
			}
		}
	});
	afterNavigate(() => {
		if (matchMedia('(max-width: 640px)').matches && sidebar) {
			sidebar.classList.add('collapsed');
		}
		console.log('navigating, collapsing sidebar');
	});
</script>

<div class="sm:hidden fixed inset-0 bg-black/50 z-10 sidebar-cover"></div>

<div class="sidebar" bind:this={sidebar}>
	<button class="sidebar-btn" onclick={newTask} data-active={page.url.pathname === '/user/tasks' && page.state?.new}>
		<i class="fa-solid fa-circle-plus"></i>
		<span>New Task</span>
	</button>
	<hr class="hr text-gray-500/30 colorful:text-white/30" />
	<button class="sidebar-btn" data-href="/user/schedule" onclick={handleClick} data-active={page.url.pathname === '/user/schedule'}>
		<i class="fa-solid fa-calendar"></i>
		<span>Schedule</span>
	</button>
	<button class="sidebar-btn" data-href="/user/tasks" onclick={handleClick} data-active={page.url.pathname === '/user/tasks'}>
		<i class="fa-solid fa-list-check"></i>
		<span>Tasks</span>
	</button>
	<div class="flex-grow"></div>
	<button class="sidebar-btn hover:bg-red-500/10 hover:text-red-700 hover:dark:text-red-400 colorful:hover:bg-red-500/40 colorful:hover:text-white colorful:hover:dark:text-red-200" data-href="/user/logout" onclick={handleClick}>
		<i class="fa-solid fa-left-from-bracket"></i>
		<span>Sign out</span>
	</button>
	<button class="sidebar-btn" onclick={toggleSidebar}>
		<i class="fa-regular fa-sidebar"></i>
		<span>Toggle Sidebar</span>
	</button>
	<button class="sidebar-btn" onclick={handleClick} data-href="/user/settings" data-active={page.url.pathname === '/user/settings'}>
		<i class="fa-solid fa-cog"></i>
		<span>Settings</span>
	</button>
</div>
