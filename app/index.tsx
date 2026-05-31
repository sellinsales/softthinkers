import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming,
  withSequence, withDelay, Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from 'react-native';
import { useAppStore } from '../stores/appStore';
import { isOnboardingComplete } from '../lib/storage/cache';
import { Lumi } from '../components/mascot/Lumi';
import { Colors, FontFamily, FontSize, Gradients } from '../constants/theme';

export default function SplashIndex() {
  const { profile, settings, isLoading } = useAppStore();

  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.7);
  const lumiOpacity = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);

  useEffect(() => {
    // Animate in sequence
    logoOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    logoScale.value = withDelay(200, withTiming(1, { duration: 600, easing: Easing.out(Easing.back(1.5)) }));
    lumiOpacity.value = withDelay(700, withTiming(1, { duration: 500 }));
    taglineOpacity.value = withDelay(1100, withTiming(1, { duration: 500 }));

    // Navigate after animations
    const timer = setTimeout(async () => {
      if (isLoading) return;
      const onboarded = await isOnboardingComplete();
      if (!onboarded || !profile) {
        router.replace('/onboarding');
      } else {
        router.replace('/(tabs)');
      }
    }, 2400);

    return () => clearTimeout(timer);
  }, [isLoading, profile, logoOpacity, logoScale, lumiOpacity, taglineOpacity]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));
  const lumiStyle = useAnimatedStyle(() => ({ opacity: lumiOpacity.value }));
  const tagStyle = useAnimatedStyle(() => ({ opacity: taglineOpacity.value }));

  return (
    <LinearGradient colors={Gradients.splash} style={styles.container}>
      <Animated.View style={[styles.lumiWrap, lumiStyle]}>
        <Lumi mood="excited" size="xl" showBubble={false} />
      </Animated.View>
      <Animated.View style={[styles.logoWrap, logoStyle]}>
        <Text style={styles.logo}>
          Lingo<Text style={styles.logoAccent}>Hunt</Text>
        </Text>
      </Animated.View>
      <Animated.View style={tagStyle}>
        <Text style={styles.tagline}>Explore. Scan. Learn! 🌍</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  lumiWrap: { marginBottom: 8 },
  logoWrap: { alignItems: 'center' },
  logo: {
    fontFamily: FontFamily.black,
    fontSize: 52,
    color: Colors.textPrimary,
    letterSpacing: -1,
  },
  logoAccent: { color: Colors.primary },
  tagline: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.h4,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
});
