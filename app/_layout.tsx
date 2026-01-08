import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';
import Toast from "react-native-toast-message";
import { WatchlistProvider } from '@/utilities/WatchlistContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {

  return (
    <>
      <WatchlistProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
       <Toast />
      </WatchlistProvider>
      <StatusBar style="auto" />
    </>
  );
}
