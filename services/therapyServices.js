import { supabase } from "../lib/supabase";

export const FetchTherapists = async () => {
    try {
        const { data, error } = await supabase
            .from('therapists')
            .select()    
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

export const FetchTherapistData = async (therapistId) => {
    try {
        const {data, error} = await supabase
        .from('therapists')
        .select()
        .eq('id', therapistId)
        if (error) {
            console.log("Fetch Therapist Error", error);
            return { success: false, msg: "Could not fetch therapist data" };
        }
    } catch (error) {
        console.log("Catch Error", error);
        return { success: false, msg: "Could not fetch therapist data" };
    }
}
