import { Stack, SplashScreen } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { AuthProvider, useAuth, setUserData } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { router } from 'expo-router';
import { getUserData } from '../services/userService';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Warning: TNodeChildrenRenderer', 'Warning: MemoizedTNodeRenderer', 'Warning: TRenderEngineProvider'])

const _layout = () => {
  return (
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  );
};

const RootLayout = () => {
  const { setAuth, setUserData } = useAuth();
  
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (error) {
      console.error("Error loading fonts:", error);
      return;
    }

    if (fontsLoaded) {
      SplashScreen.hideAsync(); // Hide splash screen once fonts are loaded
      
      // Set up auth state change listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          setAuth(session?.user); // Set user in context
          updatedUserData(session?.user, session?.user.email); // Fetch user data
          router.replace('/home'); // Navigate to home screen
        } else {
          setAuth(null); // Clear user in context
          router.push('/'); // Navigate to the welcome page or auth screen
        }
      });

      return () => {
        subscription?.unsubscribe(); // Cleanup listener on unmount
      };
    }
  }, [fontsLoaded, error]);

  const updatedUserData = async (user, email) => {
    let response = await getUserData(user?.id);
    if (response.success) {
      setUserData({ ...response.data, email }); // Update user data in context
    }
  };

  if (!fontsLoaded) {
    return null; // Show nothing until fonts are loaded, or you can render a loading screen
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide headers for all screens
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
      name="(post)/postDetails"
      options={{
        presentation: 'modal'
      }}
      />
      <Stack.Screen
      name="(journal)/journalEditor"
      options={{
        presentation: 'modal'
      }}
      />
    </Stack>
  );
};

export default _layout;
