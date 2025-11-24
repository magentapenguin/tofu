<script lang="ts">
	import Dialog from '$lib/Dialog.svelte';
	import Task from '$lib/Task.svelte';
	import { page } from '$app/state';
	import { goto, pushState } from '$app/navigation';
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
    import posthog from 'posthog-js'
    import { onMount } from 'svelte'
	let tasks: Array<{
		id: string;
		title: string;
		description: string;
		due?: string;
		completed?: boolean;
		syncing?: boolean;
	}> = $state([]);
	// load tasks from cache while syncing with supabase

	onMount(() => {
		const cachedTasks = localStorage.getItem('tasks');
		if (cachedTasks) {
			try {
				tasks = JSON.parse(cachedTasks);
			} catch (error) {
				console.error('Error parsing cached tasks:', error);
			}
		}
	});

	let syncing_tasks = $state(new Set<string>());

	let { form, data }: PageProps = $props();
	const supabase = data.supabase;
	
	let tasksLoaded = new Promise<void>(resolve => {
		supabase
		.from('tasks')
		.select()
		.then(({ error, data }) => {
			if (error || !data) {
				console.error('Error fetching tasks:', error?.message);
				posthog.captureException(error);
				return;
			}
			console.log('Tasks fetched:', data);
			tasks = data.map(task => ({
				id: task.id,
				title: task.name,
				description: task.desc,
				due: task.expiry ?? undefined,
				completed: Boolean(task.selected),
				syncing: false
			}));
			resolve();
			localStorage.setItem('tasks', JSON.stringify(tasks));
		});
	});

	
	/*tasks = data.tasks.map(task => ({
		id: task.id,
		title: task.name,
		description: task.desc,
		due: task.expiry ?? undefined,
		completed: Boolean(task.selected),
		syncing: false
	}));*/
	$effect(() => {
		console.log(typeof tasks[0].completed);
	});	

	function taskOnModify({ title, description, due, id }: { title?: string; description?: string; due?: string; id: string }) {
		console.log('Task modified:', { id, title, description, due });
		tasks = tasks.map(task => {
			if (task.id === id) {
				return {
					...task,
					title: title ?? task.title,
					description: description ?? task.description,
					due: due ?? task.due
				};
			}
			return task;
		});
		syncTask({ id });
	}

	function taskOnChange({ completed, id }: { completed: boolean; id: string }) {
		console.log('Task changed:', { id, completed });
		tasks = tasks.map(task => {
			if (task.id === id) {
				return {
					...task,
					completed
				};
			}
			return task;
		});
		syncTask({ id });
	}

	function syncTask({ id }: { id: string }) {
		const taskToSync = tasks.find(task => task.id === id);
		if (!taskToSync) {
			console.error('Task not found:', id);
			return;
		}
		console.log(tasks, id);

		tasks = tasks.map(task => {
			if (task.id === id) {
				return {
					...task,
					syncing: true
				};
			}
			return task;
		});
		syncing_tasks.add(id);
		// Sync with supabase

		let due = taskToSync.due as string | null | undefined;
		if (due === undefined) {
			due = null;
		} else if (due) {
			const dueDate = new Date(due);
			if (!isNaN(dueDate.getTime())) {
				due = dueDate.toISOString();
			} else {
				due = null;
			}
		}
		localStorage.setItem('tasks', JSON.stringify(tasks));
		supabase
			.from('tasks')
			.update({
				name: taskToSync.title,
				desc: taskToSync.description,
				expiry: due,
				selected: Boolean(taskToSync.completed),
			})
			.eq('id', id)
			.select()
			.then(({ error, data }) => {
				if (error || !data) {
					console.error('Error syncing task:', error?.message);
					posthog.captureException(error);
				}
				console.log('Task synced:', data);
				tasks = tasks.map(task => {
					if (task.id === id) {
						return {
							...task,
							syncing: false
						};
					}
					return task;
				});
				syncing_tasks.delete(id);
			});
	}

	function taskOnDelete({ id }: { id: string }) {
		console.log('Task deleted:', id);
		console.log('Tasks before delete:', tasks);
		tasks = tasks.filter(task => task.id !== id);
		console.log('Tasks after delete:', tasks);
		supabase
			.from('tasks')
			.delete()
			.eq('id', id)
			.then(({ error, data }) => {
				if (error) {
					console.error('Error deleting task:', error.message);
					posthog.captureException(error);
				} else {
					console.log('Task deleted from database successfully');
				}
			});
	}
	let loading = $state(false);
</script>

{#if page.state.new}
	<Dialog open={true} onClose={() => pushState('',{new:false})} title="New Task">
		<form method="post" use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				if (form?.message) {
					console.error('Error creating task:', form.message);
				} else if (form?.task) {
					// Transform the task from DB format to component format
					tasks = [{
						id: form.task.id,
						title: form.task.name,
						description: form.task.desc,
						due: form.task.expiry ?? undefined,
						completed: Boolean(form.task.selected),
						syncing: false
					}, ...tasks];
				}
				update();
				loading = false;
				goto('/user/tasks');

			};
		}} class="flex flex-col gap-4" inert={loading}>
			<div>
				<label for="title" class="block font-semibold mb-1">Title</label>
				<input type="text" id="title" name="title" required class="w-full input" />
			</div>
			<div>
				<label for="description" class="block font-semibold mb-1">Description</label>
				<textarea id="description" name="description" class="w-full input"></textarea>
			</div>
			<div>
				<label for="due" class="block font-semibold mb-1">Due Date</label>
				<input type="datetime-local" id="due" name="due" class="w-full input" />
			</div>
			<div class="flex justify-end gap-2">
				<button type="button" onclick={() => pushState('', { new: false })} class="btn btn-secondary">Cancel</button>
				<button type="submit" class="btn">Create</button>
			</div>
			{#if form?.message !== undefined}
				<div class="{form?.success ? 'text-green-500' : 'text-red-600'}">
					{form?.message}
				</div>
			{/if}
		</form>
	</Dialog>
{/if}
{#await tasksLoaded}
	<p class="text-gray-600 dark:text-gray-400">Loading tasks...</p>
{/await}
{#if tasks.length === 0}
	<p class="text-gray-600 dark:text-gray-400">No tasks found. Click "New Task" to create one.</p>
{/if}
{#each tasks as task (task.id)}
	<Task
		id={task.id}
		title={task.title}
		description={task.description}
		due={task.due}
		completed={task.completed}
		syncing={task.syncing}
		onChange={taskOnChange}
		onModify={taskOnModify}
		onDelete={taskOnDelete}
	/>
{/each}