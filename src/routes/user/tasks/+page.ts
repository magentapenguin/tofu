import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, data }) => {
    const { supabase } = await parent();
    return {
        supabase
    };
};
