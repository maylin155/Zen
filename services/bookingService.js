import { supabase } from "../lib/supabase";

export const UpdateBooking = async (session) => {
    try {
        const { data, error } = await supabase
            .from('appointments')
            .upsert(session)
            .select()
            .single();

        if (error) {
            console.log("Create Booking error", error);
            return { success: false, msg: 'Could not create your booking' }

        }
        return { success: true, data: data };

    } catch (error) {
        console.log('CreateBooking error: ', error);
        return { success: false, msg: 'Could not create your booking' }

    }
}

export const FetchBooking = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('appointments')
            .select(
                `*,
                therapist: therapists(name)
                `)
            .eq('userId', userId)  // Filter by userId
            .order('created_at', { ascending: false })

        if (error) {
            console.log("Fetch Booking Error", error);
            return { success: false, msg: "Could not fetch booking" };
        }

        return { success: true, data: data };
    } catch (error) {
        console.log("Catch Error", error);
        return { success: false, msg: "Could not fetch booking" };
    }
};

export const removeBooking = async (bookingId) => {
    try {
        const { error } = await supabase
            .from('appointments')
            .delete()
            .eq('id', bookingId);

        if (error) {
            console.error('Error deleting booking:', error.message);
            return { success: false, msg: 'Could not remove the booking' };
        } 

        return { success: true, data: {bookingId} };

    } catch (error) {
        console.error('Booking Error:', error);
        return { success: false, msg: 'An unexpected error occurred while removing the booking' };
    }
};

