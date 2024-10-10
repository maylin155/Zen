import { View, Text, SafeAreaView, FlatList, Alert, RefreshControl, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import React, { useEffect, useState } from 'react';
import JournalCard from '../../components/JournalCard';
import MoodCard from '../../components/MoodCard';
import { FetchJournals } from '../../services/journalService';
import { FetchMood } from '../../services/moodService';
import moment from 'moment';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';

const Journal = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch journals and moods
  const fetchData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      
      // Fetch both journals and moods
      const journalResponse = await FetchJournals(user.id);
      const moodResponse = await FetchMood(user.id);

      if (journalResponse.success && moodResponse.success) {
        const combinedData = combineData(journalResponse.data, moodResponse.data);
        setData(combinedData);
      } else {
        Alert.alert("Error", "Failed to fetch data");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch data");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Combine journals and moods by date
  const combineData = (journals, moods) => {
    let combined = {};

    journals.forEach(journal => {
      const date = moment(journal.created_at).format('YYYY-MM-DD');
      if (!combined[date]) combined[date] = { journals: [], moods: [] };
      combined[date].journals.push(journal);
    });

    moods.forEach(mood => {
      const date = moment(mood.created_at).format('YYYY-MM-DD');
      if (!combined[date]) combined[date] = { journals: [], moods: [] };
      combined[date].moods.push(mood);
    });

    return Object.keys(combined).map(date => ({
      date,
      journals: combined[date].journals,
      moods: combined[date].moods,
    })).sort((a, b) => new Date(b.date) - new Date(a.date)); 
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <View>
      <Text className="text-lg font-bold mb-4 text-primary tracking-widest">
        {moment(item.date).format('dddd, MMM DD')}
      </Text>
  
      {item.moods.map((mood) => (
        <MoodCard key={mood.id} item={mood} />  // Render MoodCard for each mood
      ))}
  
      {item.journals.map((journal) => (
        <JournalCard key={journal.id} item={journal} />
      ))}
    </View>
  );

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 mx-4">
        {data.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-lg text-gray-600 mb-3 font-psemibold">No journals or moods available.</Text>
            <Text className="text-md text-gray-600 mb-2">Tap the plus button to get started!</Text>
          </View>
        ) : (
          <FlatList
              data={data}
              keyExtractor={(item) => item.date}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingTop: 20, paddingHorizontal: 4 }}
              ItemSeparatorComponent={() => <View style={{ height: 18 }} />}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          )}
          
          {/* Floating Plus Icon */}
          <TouchableOpacity
            onPress={() => {
              router.push('moodSlider');
            }}
            style={{
              position: 'absolute',
              width: 60,
              height: 60,
              alignItems: 'center',
              justifyContent: 'center',
              right: -5,
              bottom: 30,
              elevation: 10,
            }}
          >
            <AntDesign name="pluscircle" size={50} color="#6575A8" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };

  export default Journal;
