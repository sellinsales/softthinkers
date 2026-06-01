import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts,
  Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold,
  Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black,
} from '@expo-google-fonts/nunito';
import * as SplashScreen from 'expo-splash-screen';
import { useAppStore } from '../stores/appStore';
import { getLastUid } from '../lib/storage/cache';
import { Colors } from '../constants/theme';

void SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });
  const [bootstrapped, setBootstrapped] = useState(false);

  const { initFromCache, loadFromApi, setLoading } = useAppStore();

  useEffect(() => {
    async function bootstrap() {
      const uid = await getLastUid();
      if (uid) {
        await initFromCache(uid);
        loadFromApi(uid).catch(() => {});
      } else {
        setLoading(false);
      }
      setBootstrapped(true);
      await SplashScreen.hideAsync().catch(() => {});
    }
    bootstrap().catch(async () => {
      setBootstrapped(true);
      await SplashScreen.hideAsync().catch(() => {});
    });
  }, [initFromCache, loadFromApi, setLoading]);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!bootstrapped && !fontsLoaded && !fontError) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" backgroundColor={Colors.background} />
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
          <Stack.Screen
            name="learning/[word]"
            options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
          />
          <Stack.Screen name="settings" options={{ animation: 'slide_from_right' }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
