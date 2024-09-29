import { View, Text, SafeAreaView, Pressable, FlatList, Alert, RefreshControl } from 'react-native';
import Avatar from '../../components/Avatar';
import { useAuth } from '../../context/AuthContext';
import React, { useEffect, useState } from 'react';
import CheckInCard from '../../components/CheckInCard';
import { images } from '../../constants';
import { router } from 'expo-router';
import { FetchJournals } from '../../services/journalService';
import JournalCard from '../../components/JournalCard';
import moment from 'moment';
import { getUserData } from '../../services/userService';
import { supabase } from '../../lib/supabase';

const Journal = () => {
  const { user } = useAuth();
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // Refresh state

  const fetchJournals = async () => {
    if (!user) return;

    try {
      setLoading(true);
      let response = await FetchJournals(user.id);
      if (response.success) {
        setJournals(groupJournalsByDate(response.data));
      } else {
        Alert.alert("Error", response.msg);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch journals");
      console.error("Error fetching journals:", error);
    } finally {
      setLoading(false);
      setRefreshing(false); // Stop refreshing after fetch
    }
  };

  useEffect(() => {
    fetchJournals()
  }, [])

  const groupJournalsByDate = (journals) => {
    return journals.reduce((groupedJournals, journal) => {
      const journalDate = moment(journal.created_at).format('YYYY-MM-DD');
      if (!groupedJournals[journalDate]) {
        groupedJournals[journalDate] = [];
      }
      groupedJournals[journalDate].push(journal);
      return groupedJournals;
    }, {});
  };

  const renderItem = ({ item }) => (
    <View>
      <Text className="text-lg font-bold mb-4 text-primary">
        {moment(item.date).format('MMM DD, dddd')}
      </Text>
      {item.journals.map((journal) => (
        <JournalCard key={journal.id} item={journal} currentUser={user} />
      ))}
    </View>
  );

  const groupedJournals = Object.keys(journals).map((date) => ({
    date,
    journals: journals[date]
  }));

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchJournals();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 mx-4">
        {/* Header */}
        <View className="flex-row justify-between my-8 items-center">
          <Text className="text-2xl font-psemibold text-gray-600">Hello, <Text className="text-primary">{user && user.name}</Text></Text>
          <Pressable onPress={() => router.push('/profile')}>
            <Avatar uri={user && user.image} size={50} rounded={30} />
          </Pressable>
        </View>

        {/* CheckInCard */}
        <CheckInCard
          text="How are you feeling today?"
          image={images.journal}
          onPress={() => router.push('/journalEditor')}
          buttonText="Write Journal"
        />

        {/* Grouped Journals */}
        <FlatList
          data={groupedJournals}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 20, paddingHorizontal: 4 }}
          keyExtractor={(item) => item.date}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={{ height: 18 }} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default Journal;
