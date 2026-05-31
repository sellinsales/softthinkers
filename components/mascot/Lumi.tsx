import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat,
  withTiming, withSequence, withSpring, Easing,
} from 'react-native-reanimated';
import { Colors, Radius, Spacing, FontFamily, FontSize, Shadow } from '../../constants/theme';

export type LumiMood = 'happy' | 'excited' | 'thinking' | 'cheering' | 'idle' | 'scanning';

interface LumiProps {
  mood?: LumiMood;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  style?: ViewStyle;
  showBubble?: boolean;
}

const SIZES = {
  sm: 60,
  md: 90,
  lg: 120,
  xl: 160,
} as const;

const MOOD_EMOJIS: Record<LumiMood, string> = {
  happy: '😊',
  excited: '🤩',
  thinking: '🤔',
  cheering: '🎉',
  idle: '😊',
  scanning: '👀',
};

export const Lumi: React.FC<LumiProps> = ({
  mood = 'idle', size = 'md', message, style, showBubble = true,
}) => {
  const bob = useSharedValue(0);
  const wobble = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    // Bob animation (all moods)
    bob.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 800, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 800, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );

    // Mood-specific animations
    if (mood === 'excited' || mood === 'cheering') {
      wobble.value = withRepeat(
        withSequence(
          withTiming(-10, { duration: 100 }),
          withTiming(10, { duration: 100 }),
          withTiming(0, { duration: 100 }),
        ),
        4,
        false,
      );
      scale.value = withSequence(
        withSpring(1.2, { damping: 6, stiffness: 200 }),
        withSpring(1, { damping: 8, stiffness: 200 }),
      );
    } else if (mood === 'scanning') {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 400 }),
          withTiming(0.97, { duration: 400 }),
        ),
        -1,
        false,
      );
    }
  }, [mood, bob, wobble, scale]);

  const bodyStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: bob.value },
      { rotate: `${wobble.value}deg` },
      { scale: scale.value },
    ],
  }));

  const foxSize = SIZES[size];
  const bubbleFontSize = size === 'xl' ? FontSize.body : size === 'lg' ? FontSize.small : FontSize.xs;

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={bodyStyle}>
        {/* Fox body rendered with styled views + emoji overlay */}
        <View style={[styles.foxBody, { width: foxSize, height: foxSize * 1.1 }]}>
          {/* Ears */}
          <View style={[styles.earLeft, { top: foxSize * 0.04 }]} />
          <View style={[styles.earRight, { top: foxSize * 0.04 }]} />
          {/* Head */}
          <View style={[styles.head, {
            width: foxSize * 0.82,
            height: foxSize * 0.82,
            borderRadius: foxSize * 0.41,
            top: foxSize * 0.06,
            left: foxSize * 0.09,
          }]}>
            {/* Face emoji */}
            <Text style={{ fontSize: foxSize * 0.45, lineHeight: foxSize * 0.82 }}>
              {MOOD_EMOJIS[mood]}
            </Text>
          </View>
          {/* Tail */}
          <View style={[styles.tail, { bottom: foxSize * 0.0, right: -foxSize * 0.18 }]} />
        </View>
      </Animated.View>

      {showBubble && message ? (
        <View style={styles.speechBubble}>
          <Text style={[styles.speechText, { fontSize: bubbleFontSize }]}>
            {message}
          </Text>
          <View style={styles.bubbleTail} />
        </View>
      ) : null}
    </View>
  );
};

// ─── Lumi Avatar (used in header / rewards) ───────────────────────────────────

interface LumiAvatarProps {
  xp: number;
  style?: ViewStyle;
}

export const LumiAvatar: React.FC<LumiAvatarProps> = ({ xp, style }) => {
  const mood: LumiMood = xp > 500 ? 'excited' : xp > 100 ? 'happy' : 'idle';
  return <Lumi mood={mood} size="md" style={style} showBubble={false} />;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  foxBody: {
    position: 'relative',
    alignItems: 'center',
  },
  head: {
    backgroundColor: '#FF9F7F',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    ...Shadow.md,
  },
  earLeft: {
    position: 'absolute',
    left: '12%',
    width: 22,
    height: 28,
    backgroundColor: '#FF7755',
    borderRadius: 14,
    transform: [{ rotate: '-15deg' }],
    zIndex: 1,
  },
  earRight: {
    position: 'absolute',
    right: '12%',
    width: 22,
    height: 28,
    backgroundColor: '#FF7755',
    borderRadius: 14,
    transform: [{ rotate: '15deg' }],
    zIndex: 1,
  },
  tail: {
    position: 'absolute',
    width: 36,
    height: 24,
    backgroundColor: '#FF9F7F',
    borderRadius: 18,
    transform: [{ rotate: '30deg' }],
  },
  speechBubble: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    marginTop: Spacing.sm,
    maxWidth: 220,
    alignItems: 'center',
    ...Shadow.md,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  speechText: {
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 22,
  },
  bubbleTail: {
    position: 'absolute',
    top: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Colors.surface,
  },
});
