import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { UpdateMood } from '../../services/moodService';
const MoodSlider = () => {
  const {user} = useAuth();
  const [mood, setMood] = useState(2); 
  const moodLabels = ['Bad', 'Not Great', 'Okay', 'Fine', 'Good'];
  const moodEmojis = ['😞', '😕', '😐', '😊', '😇']; 
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    let data = {
      userId: user?.id,
      moodValue: mood,
      moodDetail: moodLabels[mood]
    }
    setLoading(true);
    let res = await UpdateMood(data);
    setLoading(false);
    if (res.success){
      console.log(res.data);
      router.replace('/journalEditor')
    } else {
      Alert.alert("Mood", res.msg);
    }
  }

  return (
    <View className="flex-1 items-center">
      <View className="flex-1 mx-5 items-center justify-center">
        <Text className="text-lg font-pmedium mb-5">How are you feeling today?</Text>
        <Text style={styles.emoji}>{moodEmojis[mood]}</Text>

        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={4}
          step={1}
          value={mood}
          onValueChange={(value) => setMood(value)}
          minimumTrackTintColor="#C5C3D9"
          maximumTrackTintColor="#DDDDDD"
          thumbTintColor="#9E9ABF"
        />

        {/* Display mood details below the slider */}
        <Text className="font-pmedium text-base">{moodLabels[mood]}</Text>
      </View>
      <TouchableOpacity className="p-4 w-64 bg-primary rounded-2xl absolute bottom-20" onPress={handlePress}>
        <Text className="text-center text-white text-lg">Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  emoji: {
    fontSize: 40, // Adjust size as needed
    marginBottom: 10,
  },
  slider: {
    width: 300,
    height: 40,
  },
  moodText: {
    fontSize: 18,
    marginTop: 10,
  },
});

export default MoodSlider;
