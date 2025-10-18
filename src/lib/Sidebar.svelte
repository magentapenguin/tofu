<script lang="ts">
	import { goto, pushState } from '$app/navigation';

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
</script>

<div class="sidebar">
	<button class="sidebar-btn" onclick={newTask}>
		<i class="fa-solid fa-circle-plus"></i>
		New Task
	</button>
	<hr class="hr border-gray-500/30" />
	<button class="sidebar-btn" data-href="/user/schedule" onclick={handleClick}>
		<i class="fa-solid fa-calendar"></i>
		Schedule
	</button>
	<button class="sidebar-btn" data-href="/user/tasks" onclick={handleClick}>
		<i class="fa-solid fa-list-check"></i>
		Tasks
	</button>
	<div class="flex-grow"></div>
	<button class="sidebar-btn hover:bg-red-500/10 hover:text-red-700 hover:dark:text-red-400" data-href="/user/logout" onclick={handleClick}>
		<i class="fa-solid fa-left-from-bracket"></i>
		Sign out
	</button>
</div>
