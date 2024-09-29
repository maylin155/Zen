import { View, SafeAreaView, Text, ScrollView, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import Header from '../../components/Header';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import SelectDropdown from 'react-native-select-dropdown';
import CustomButton from '../../components/CustomButton';
import { UpdateBooking } from '../../services/bookingService';
import Loading from '../../components/Loading';


const Booking = () => {
    const { therapistId, userId } = useLocalSearchParams();

    // Initialize with current date in formatted string 'YYYY-MM-DD'
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [time, setTime] = useState(null);
    const [loading, setLoading] = useState(false);

    // console.log(date)
    // console.log(time)

    const timeSlot = [
        "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"
    ];

    const onSubmit = async () => {
        if (date == '' || time == null) {
            Alert.alert("Booking", "Please select a date and time.")
        }

        let data = {
            userId: userId,
            therapistId: therapistId,
            date: date,
            time: time
        }
        setLoading(true);
        let res = await UpdateBooking(data);
        // console.log(res);
        setLoading(false);
        if (res.success) {
            router.replace('/bookingSuccess')
        } else {
            Alert.alert("Booking", res.msg);
        }
    }

    return (
        <SafeAreaView className="flex-1">
            <ScrollView>
                <View className="flex-1 mx-5">
                    <View className="my-5">
                        <Header title={`Booking`} />
                    </View>
                    <View className="flex-row gap-3 items-center my-2">
                        <FontAwesome5 name="calendar-alt" size={20} color="#6575A8" />
                        <Text className="text-base font-pregular ">Select date</Text>
                    </View>

                    <View className="bg-white rounded-lg p-7 my-2 shadow-md w-200">
                        <DateTimePicker
                            mode="single"
                            date={dayjs(date).toDate()} // Convert formatted string back to a Date object
                            onChange={(params) => setDate(dayjs(params.date).format('YYYY-MM-DD'))} // Store formatted date
                            selectedItemColor='#8b86b2'
                        />
                    </View>

                    <View className="flex-row gap-3 items-center my-1">
                        <FontAwesome5 name="clock" size={20} color="#6575A8" />
                        <Text className="text-base font-pregular ">Select time</Text>
                    </View>
                    <View className="my-2">
                        <SelectDropdown
                            data={timeSlot}
                            onSelect={(selectedItem) => {
                                setTime(selectedItem);
                            }}
                            renderButton={(selectedItem, isOpened) => {
                                const buttonStyle = {
                                    width: 200,
                                    height: 50,
                                    backgroundColor: '#fff',
                                    borderRadius: 12,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingHorizontal: 12,
                                    shadowColor: 'grey',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 4,
                                    elevation: 4,
                                    borderWidth: selectedItem ? 2 : 0, // Show border when selected
                                    borderColor: selectedItem ? '#BEBAD6' : 'transparent', // Border color when selected
                                };

                                return (
                                    <View style={buttonStyle}>
                                        <Text>{selectedItem || 'Time'}</Text>
                                    </View>
                                );
                            }}
                            renderItem={(item, index, isSelected) => {
                                return (
                                    <View
                                        style={{
                                            width: '100%',
                                            flexDirection: 'row',
                                            paddingHorizontal: 12,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            paddingVertical: 8,
                                            backgroundColor: '#fff'
                                        }}
                                    >
                                        <Text>{item}</Text>
                                    </View>
                                );
                            }}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                    {loading ? (
                        <Loading />
                    ) : (
                        <CustomButton title="Confirm" containerStyles="bg-primary mt-8" handlePress={onSubmit} />
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Booking;
