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
		pushState('/tasks', { new: true });
	}
</script>
<div class="sidebar">
	<button class="sidebar-btn" onclick={newTask}>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class="icon icon-6"
			><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path
				d="M320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM296 408L296 344L232 344C218.7 344 208 333.3 208 320C208 306.7 218.7 296 232 296L296 296L296 232C296 218.7 306.7 208 320 208C333.3 208 344 218.7 344 232L344 296L408 296C421.3 296 432 306.7 432 320C432 333.3 421.3 344 408 344L344 344L344 408C344 421.3 333.3 432 320 432C306.7 432 296 421.3 296 408z"
			/></svg
		>
		New Task
	</button>
	<button class="sidebar-btn" data-href="/schedule" onclick={handleClick}>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class="icon icon-6"
			><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path
				d="M224 64C206.3 64 192 78.3 192 96L192 128L160 128C124.7 128 96 156.7 96 192L96 240L544 240L544 192C544 156.7 515.3 128 480 128L448 128L448 96C448 78.3 433.7 64 416 64C398.3 64 384 78.3 384 96L384 128L256 128L256 96C256 78.3 241.7 64 224 64zM96 288L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 288L96 288z"
			/></svg
		>
		Schedule
	</button>
</div>
