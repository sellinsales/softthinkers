import { Platform } from 'react-native';

// ─── Color Palette ────────────────────────────────────────────────────────────

export const Colors = {
  // Brand
  primary: '#4ECDC4',
  primaryDark: '#38B2AA',
  primaryLight: '#A8EDEA',

  secondary: '#FFE66D',
  secondaryDark: '#F5C518',
  secondaryLight: '#FFF4B0',

  accent: '#FF6B9D',
  accentDark: '#E05580',
  accentLight: '#FFB3CC',

  // Semantic
  success: '#06D6A0',
  successLight: '#B7F5E1',
  warning: '#FFB703',
  warningLight: '#FFE8A0',
  error: '#FF6B6B',
  errorLight: '#FFD0D0',
  info: '#74B9FF',
  infoLight: '#CCEEFF',

  // Neutral
  background: '#FFF9F0',
  surface: '#FFFFFF',
  surfaceAlt: '#F8F4EE',
  border: '#E8E0D5',
  borderLight: '#F2EDE8',

  // Text
  textPrimary: '#2D3436',
  textSecondary: '#636E72',
  textTertiary: '#B2BEC3',
  textOnPrimary: '#FFFFFF',
  textOnSecondary: '#2D3436',

  // Category colors
  animals: '#FF9F7F',
  animalsLight: '#FFE4DA',
  food: '#7ED957',
  foodLight: '#D4F5B8',
  nature: '#48CAE4',
  natureLight: '#C4EEFA',
  household: '#9B5DE5',
  householdLight: '#DEC8FA',
  transport: '#F77F00',
  transportLight: '#FFD9A8',
  clothing: '#E63946',
  clothingLight: '#FACCC0',

  // XP / Level colors
  xpFill: '#FFB703',
  xpBackground: '#FFF0C0',

  // Overlay
  overlay: 'rgba(0,0,0,0.5)',
  overlayLight: 'rgba(255,255,255,0.85)',
  scrim: 'rgba(45,52,54,0.7)',
} as const;

// ─── Gradients ────────────────────────────────────────────────────────────────

export const Gradients = {
  background: ['#FFF9F0', '#FFF0E6'] as const,
  primary: ['#4ECDC4', '#38B2AA'] as const,
  secondary: ['#FFE66D', '#F5C518'] as const,
  accent: ['#FF6B9D', '#E05580'] as const,
  success: ['#06D6A0', '#00B880'] as const,
  reward: ['#FFD93D', '#FF9500'] as const,
  sky: ['#74B9FF', '#0984E3'] as const,
  splash: ['#FFF9F0', '#A8EDEA'] as const,
  camera: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.65)'] as const,
  cardAnimal: ['#FF9F7F', '#FF6B6B'] as const,
  cardFood: ['#7ED957', '#06D6A0'] as const,
  cardNature: ['#48CAE4', '#4ECDC4'] as const,
  cardHousehold: ['#9B5DE5', '#7B3FC7'] as const,
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────

export const FontFamily = {
  black: 'Nunito_900Black',
  extraBold: 'Nunito_800ExtraBold',
  bold: 'Nunito_700Bold',
  semiBold: 'Nunito_600SemiBold',
  medium: 'Nunito_500Medium',
  regular: 'Nunito_400Regular',
} as const;

export const FontSize = {
  display: 40,
  h1: 32,
  h2: 26,
  h3: 22,
  h4: 18,
  body: 16,
  small: 14,
  xs: 12,
  micro: 10,
} as const;

export const LineHeight = {
  tight: 1.15,
  normal: 1.4,
  relaxed: 1.6,
} as const;

// ─── Spacing ─────────────────────────────────────────────────────────────────

export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  huge: 64,
} as const;

// ─── Border Radius ────────────────────────────────────────────────────────────

export const Radius = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 36,
  full: 999,
} as const;

// ─── Shadows ─────────────────────────────────────────────────────────────────

export const Shadow = {
  sm: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
    android: { elevation: 2 },
  }),
  md: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.10,
      shadowRadius: 8,
    },
    android: { elevation: 4 },
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
    },
    android: { elevation: 8 },
  }),
  colored: (color: string) =>
    Platform.select({
      ios: {
        shadowColor: color,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
      },
      android: { elevation: 6 },
    }),
} as const;

// ─── Animation ────────────────────────────────────────────────────────────────

export const Duration = {
  instant: 100,
  fast: 200,
  normal: 300,
  slow: 500,
  verySlow: 800,
} as const;

// ─── Touch targets (a11y: minimum 44x44) ──────────────────────────────────────

export const TouchTarget = {
  sm: 44,
  md: 56,
  lg: 64,
  xl: 72,
} as const;

// ─── Z-index ─────────────────────────────────────────────────────────────────

export const ZIndex = {
  base: 0,
  card: 10,
  overlay: 20,
  modal: 30,
  toast: 40,
} as const;
