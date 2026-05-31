import React, { useCallback } from 'react';
import {
  Pressable, Text, ActivityIndicator,
  StyleSheet, ViewStyle, TextStyle,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withSpring, withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontFamily, FontSize, Radius, Spacing, TouchTarget } from '../../constants/theme';
import { hapticLight } from '../../lib/audio/speech';

type Variant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  emoji?: string;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  haptic?: boolean;
}

const GRADIENT_COLORS: Record<Variant, readonly [string, string]> = {
  primary: [Colors.primary, Colors.primaryDark],
  secondary: [Colors.secondary, Colors.secondaryDark],
  accent: [Colors.accent, Colors.accentDark],
  ghost: ['transparent', 'transparent'],
  danger: [Colors.error, '#E05555'],
};

const TEXT_COLORS: Record<Variant, string> = {
  primary: Colors.textOnPrimary,
  secondary: Colors.textOnSecondary,
  accent: Colors.textOnPrimary,
  ghost: Colors.primary,
  danger: Colors.textOnPrimary,
};

const HEIGHTS: Record<Size, number> = {
  sm: TouchTarget.sm,
  md: TouchTarget.md,
  lg: TouchTarget.lg,
  xl: TouchTarget.xl,
};

const FONT_SIZES: Record<Size, number> = {
  sm: FontSize.small,
  md: FontSize.body,
  lg: FontSize.h4,
  xl: FontSize.h3,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button: React.FC<ButtonProps> = ({
  label, onPress, variant = 'primary', size = 'lg',
  emoji, loading = false, disabled = false,
  fullWidth = false, style, textStyle, haptic = true,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.94, { damping: 15, stiffness: 200 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  }, [scale]);

  const handlePress = useCallback(async () => {
    if (haptic) await hapticLight();
    onPress();
  }, [haptic, onPress]);

  const isGhost = variant === 'ghost';
  const colors = GRADIENT_COLORS[variant];
  const height = HEIGHTS[size];
  const fontSize = FONT_SIZES[size];
  const textColor = TEXT_COLORS[variant];

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      style={[animatedStyle, fullWidth && { width: '100%' }]}
    >
      {isGhost ? (
        <Animated.View
          style={[
            styles.base,
            { height, borderWidth: 2.5, borderColor: Colors.primary, borderRadius: Radius.xl },
            disabled && styles.disabled,
            style,
          ]}
        >
          {renderContent(emoji, label, fontSize, textColor, loading)}
        </Animated.View>
      ) : (
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.base,
            { height, borderRadius: Radius.xl },
            disabled && styles.disabled,
            style,
          ]}
        >
          {renderContent(emoji, label, fontSize, textColor, loading, textStyle)}
        </LinearGradient>
      )}
    </AnimatedPressable>
  );
};

function renderContent(
  emoji: string | undefined,
  label: string,
  fontSize: number,
  textColor: string,
  loading: boolean,
  textStyle?: TextStyle,
) {
  if (loading) {
    return <ActivityIndicator color={textColor} size="small" />;
  }
  return (
    <>
      {emoji && <Text style={[styles.emoji, { fontSize: fontSize + 2 }]}>{emoji}</Text>}
      <Text
        style={[styles.label, { fontSize, color: textColor }, textStyle]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  label: {
    fontFamily: FontFamily.extraBold,
    letterSpacing: 0.3,
  },
  emoji: {
    lineHeight: undefined,
  },
  disabled: {
    opacity: 0.5,
  },
});
