import { supabase } from "../lib/supabase";

export const UpdateMood = async (mood) => {
    try {
        const { data, error } = await supabase
            .from('mood')
            .upsert(mood)
            .select()
            .single();

        if (error) {
            console.log("Create Mood Error", error);
            return { success: false, msg: 'Could not update your mood' }

        }
        return { success: true, data: data };

    } catch (error) {
        console.log('Create Mood error: ', error);
        return { success: false, msg: 'Could not update your mood' }

    }
}

export const FetchMood = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('mood')
            .select()
            .eq('userId', userId)  // Filter by userId
            .order('created_at', { ascending: false })

        if (error) {
            console.log("Fetch Mood Error", error);
            return { success: false, msg: "Could not fetch mood" };
        }

        return { success: true, data: data };
    } catch (error) {
        console.log("Catch Error", error);
        return { success: false, msg: "Could not fetch mood" };
    }
};

