import type { Actions } from './$types';

export const actions: Actions = {
	default: async (event) => {
        const { request, locals: { supabase } } = event;
        const formData = await request.formData();
        console.log('Form Data:', Array.from(formData.entries()));
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        let due = formData.get('due') as string | null;
        if (!title) {
            return { success: false, message: 'Title is required' };
        }

        if (due === '') {
            due = null;
        } else if (due) {
            const dueDate = new Date(due);
            if (isNaN(dueDate.getTime())) {
                return { success: false, message: 'Invalid due date' };
            }
            due = dueDate.toISOString();
        }

        const { data, error } = await supabase
            .from('tasks')
            .insert([{ name: title, desc: description, expiry: due, selected: false }])
            .select();
        if (error) {
            console.error('Error creating task:', error.message);
            return { success: false, message: error.message };
        }
        return { success: true, message: 'Task created successfully', task: data[0] };
    }
};
