<script lang="ts">
	import { goto, pushState } from '$app/navigation';
    import { page } from '$app/state'

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
	function toggleSidebar() {
		const sidebar = document.querySelector('.sidebar');
		if (sidebar) {
			sidebar.classList.toggle('collapsed');
		}
	}
	function onResize() {
		const sidebar = document.querySelector('.sidebar');
		if (window.innerWidth < 4*16) {
			sidebar?.classList.add('collapsed');
		} else {
			sidebar?.classList.remove('collapsed');
		}
	}
</script>

<svelte:window onresize={onResize}></svelte:window>

<div class="sidebar">
	<button class="sidebar-btn" onclick={newTask} data-active={page.url.pathname === '/user/tasks' && page.state?.new}>
		<i class="fa-solid fa-circle-plus"></i>
		<span>New Task</span>
	</button>
	<hr class="hr border-gray-500/30" />
	<button class="sidebar-btn" data-href="/user/schedule" onclick={handleClick} data-active={page.url.pathname === '/user/schedule'}>
		<i class="fa-solid fa-calendar"></i>
		<span>Schedule</span>
	</button>
	<button class="sidebar-btn" data-href="/user/tasks" onclick={handleClick} data-active={page.url.pathname === '/user/tasks'}>
		<i class="fa-solid fa-list-check"></i>
		<span>Tasks</span>
	</button>
	<div class="flex-grow"></div>
	<button class="sidebar-btn hover:bg-red-500/10 hover:text-red-700 hover:dark:text-red-400" data-href="/user/logout" onclick={handleClick}>
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
