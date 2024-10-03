import { View, Text, SafeAreaView, FlatList, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Card from '../../components/Card'
import { images } from '../../constants'
import { useAuth } from '../../context/AuthContext'
import TherapistCard from '../../components/TherapistCard'
import { FetchTherapists } from '../../services/therapyServices'
import CheckInCard from '../../components/CheckInCard'
import { router } from 'expo-router'

const Therapy = () => {
  const { user } = useAuth();
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(false)

  const fetchTherapists = async () => {
    try {
      setLoading(true);
      let response = await FetchTherapists();
      if (response.success) {
        // console.log("Therapists data", response.data)
        setTherapists(response.data);
      } else {
        Alert.alert("Error", response.msg)
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch therapists");
      console.error("Error fetching therapists:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTherapists();
  }, [])


  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 mx-5 mt-5">
        <Text className="font-psemibold text-xl mt-4 text-gray-700">Find the Right Therapist</Text>
        <FlatList
          data={therapists}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 20, paddingHorizontal: 4 }}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
          renderItem={({ item }) => (
            <TherapistCard item={item} currentUser={user} />
          )}
        />
      </View>
    </SafeAreaView>
  )
}

export default Therapy