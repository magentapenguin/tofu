<script lang="ts">
	import Dialog from '$lib/Dialog.svelte';
	import Task from '$lib/Task.svelte';
	import { page } from '$app/state';
	import { goto, pushState } from '$app/navigation';
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	import { supabase } from '$lib/db';
    import posthog from 'posthog-js'
	let tasks: Array<{
		id: string;
		title: string;
		description: string;
		due?: string;
		completed?: boolean;
		syncing?: boolean;
	}> = $state([]);
	let syncing_tasks = $state(new Set<string>());

	let { form, data }: PageProps = $props();
	tasks = data.tasks.map(task => ({
		id: task.id,
		title: task.name,
		description: task.desc,
		due: task.expiry ?? undefined,
		completed: task.selected,
		syncing: false
	}));

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

		let due = tasks.find(task => task.id === id)?.due as string | null | undefined;
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
		supabase
			.from('tasks')
			.update({
				name: tasks.find(task => task.id === id)?.title,
				desc: tasks.find(task => task.id === id)?.description,
				expiry: due,
				selected: (tasks.find(task => task.id === id)?.completed ?? false) ? 'TRUE' : 'FALSE'
			})
			.eq('id', id)
			.then(({ error }) => {
				if (error) {
					console.error('Error syncing task:', error.message);
					posthog.captureException(error);
				}
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
		tasks = tasks.filter(task => task.id !== id);
		supabase
			.from('tasks')
			.delete()
			.eq('id', id)
			.then(({ error }) => {
				if (error) {
					console.error('Error deleting task:', error.message);
					posthog.captureException(error);
				}
			});
	}
	let loading = $state(false);
</script>

{#if page.state.new}
	<div>Creating new task...</div>
	<Dialog open={true} onClose={() => pushState('',{new:false})} title="New Task">
		<form method="post" use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				if (form?.message) {
					console.error('Error creating task:', form.message);
				} else if (form?.task) {
					tasks = [form.task, ...tasks];
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
				<input type="date" id="due" name="due" class="w-full input" />
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
{#await Promise.resolve(tasks) }
	<p>Loading tasks...</p>
{:then}
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
{:catch error}
	<p class="text-red-700 dark:text-red-400 font-semibold">
		Error loading tasks: {error.message}
	</p>
{/await}