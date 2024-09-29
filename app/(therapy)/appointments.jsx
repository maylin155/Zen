import { View, Text, SafeAreaView, FlatList, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import { FetchBooking, removeBooking } from '../../services/bookingService';
import BookingCard from '../../components/BookingCard';
import { supabase } from '../../lib/supabase';

const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);

  const getAppointments = async () => {
    let response = await FetchBooking(user?.id);
    if (response.success) {
      setAppointments(response.data);
    } else {
      Alert.alert(response.msg);
    }
  };

  const handleBookingEvent = async (payload) => {
    console.log("payload", payload);
    if(payload.eventType == 'DELETE' && payload.old.id){
      setAppointments(prevAppointments => {
        let updatedAppointments = prevAppointments.filter(booking => booking.id != payload.old.id)
        return updatedAppointments;
      })
    }
  }

  const handleBookingDeleted = async (item) => {
    let response = await removeBooking(item?.id)
    if (response.success) {
      console.log("Success")
      console.log("Deleted booking", item)
    } else {
      Alert.alert("Booking", response.msg)
    }
  }

  useEffect(() => {
    getAppointments();
    let bookingChannel = supabase
    .channel('appointments')
    .on('postgres_changes', {event: '*', schema: 'public', table: 'appointments'}, handleBookingEvent)
    .subscribe();

    return () => {
      supabase.removeChannel(bookingChannel);
    };
  }, [])

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 mx-4 mt-3">
        <Header title="Upcoming Session" mb={24} />
        <FlatList
          data={appointments}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 20, paddingHorizontal: 4 }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 1, marginTop: 4 }}>
              <BookingCard item={item} currentUser={user} onBookingDeleted={handleBookingDeleted} />
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

export default Appointments;
