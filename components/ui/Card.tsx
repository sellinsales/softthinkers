import React from 'react';
import { Pressable, View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius, Spacing, Shadow, FontFamily, FontSize } from '../../constants/theme';
import { hapticLight } from '../../lib/audio/speech';

// ─── Base Card ────────────────────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  gradient?: readonly [string, string];
  elevated?: boolean;
  radius?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Card: React.FC<CardProps> = ({
  children, onPress, style, gradient, elevated = true, radius = Radius.xl,
}) => {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const pressIn = () => { scale.value = withSpring(0.97, { damping: 15, stiffness: 180 }); };
  const pressOut = () => { scale.value = withSpring(1, { damping: 15, stiffness: 180 }); };
  const handlePress = async () => {
    await hapticLight();
    onPress?.();
  };

  const content = gradient ? (
    <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      style={[styles.inner, { borderRadius: radius }, style]}>
      {children}
    </LinearGradient>
  ) : (
    <View style={[styles.inner, { borderRadius: radius, backgroundColor: Colors.surface }, elevated && Shadow.md, style]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <AnimatedPressable onPress={handlePress} onPressIn={pressIn} onPressOut={pressOut} style={animStyle}>
        {content}
      </AnimatedPressable>
    );
  }
  return content;
};

// ─── Word Card ────────────────────────────────────────────────────────────────

interface WordCardProps {
  wordEn: string;
  wordSv: string;
  emoji: string;
  category: string;
  isLearned?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export const WordCard: React.FC<WordCardProps> = ({
  wordEn, wordSv, emoji, category, isLearned = false, onPress, style,
}) => {
  const categoryColors: Record<string, readonly [string, string]> = {
    animals: ['#FF9F7F', '#FF6B6B'],
    food: ['#7ED957', '#06D6A0'],
    nature: ['#48CAE4', '#4ECDC4'],
    household: ['#9B5DE5', '#7B3FC7'],
    transport: ['#F77F00', '#E06000'],
    clothing: ['#E63946', '#C0202E'],
  };
  const gradient = categoryColors[category] ?? ['#4ECDC4', '#38B2AA'];

  return (
    <Card onPress={onPress} gradient={gradient} style={[styles.wordCard, style]}>
      <Text style={styles.wordEmoji}>{emoji}</Text>
      <Text style={styles.wordEn}>{wordEn}</Text>
      <Text style={styles.wordSv}>{wordSv}</Text>
      {isLearned && (
        <View style={styles.learnedBadge}>
          <Text style={styles.learnedText}>✓</Text>
        </View>
      )}
    </Card>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  value: string | number;
  label: string;
  emoji: string;
  color: string;
  style?: ViewStyle;
}

export const StatCard: React.FC<StatCardProps> = ({ value, label, emoji, color, style }) => (
  <View style={[styles.statCard, { borderColor: color + '40', backgroundColor: color + '15' }, style]}>
    <Text style={styles.statEmoji}>{emoji}</Text>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  inner: {
    overflow: 'hidden',
    padding: Spacing.base,
  },
  wordCard: {
    padding: Spacing.base,
    alignItems: 'center',
    minWidth: 140,
    minHeight: 160,
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  wordEmoji: { fontSize: 52 },
  wordEn: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.h3,
    color: Colors.textOnPrimary,
    textAlign: 'center',
  },
  wordSv: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.body,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  learnedBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.success,
    borderRadius: Radius.full,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  learnedText: {
    color: Colors.textOnPrimary,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
  },
  statCard: {
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    padding: Spacing.base,
    alignItems: 'center',
    gap: Spacing.xs,
    flex: 1,
    minWidth: 90,
  },
  statEmoji: { fontSize: 28 },
  statValue: {
    fontFamily: FontFamily.black,
    fontSize: FontSize.h2,
  },
  statLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});
