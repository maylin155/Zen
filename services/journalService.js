import { supabase } from "../lib/supabase";


export const UpdateJournal = async (journal) => {
    try {
        const { data, error } = await supabase
            .from('journals')
            .upsert(journal)
            .select()
            .single();

        if (error) {
            console.log("Create Journal Error", error);
            return { success: false, msg: 'Could not create your journal' }

        }
        return { success: true, data: data };

    } catch (error) {
        console.log('CreateJournal error: ', error);
        return { success: false, msg: 'Could not create your journal' }

    }
}

export const FetchJournals = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('journals')
            .select()
            .eq('userId', userId)  // Filter by userId
            .order('created_at', { ascending: false })

        if (error) {
            console.log("Fetch Journal Error", error);
            return { success: false, msg: "Could not fetch journal" };
        }

        return { success: true, data: data };
    } catch (error) {
        console.log("Catch Error", error);
        return { success: false, msg: "Could not fetch journal" };
    }
};

