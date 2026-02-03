/**
 * Plainly - The Tool Hub
 * Design System Colors
 * AMOLED Dark Theme with Vibrant Purple (Matching Stitch Design)
 */

// Theme type
export type ThemeType = 'dark' | 'light' | 'sepia' | 'rose';

// Dark Theme (Default - AMOLED with Vibrant Purple)
export const DarkColors = {
  // Backgrounds - Pure AMOLED Black
  bgPrimary: '#000000',
  bgSecondary: '#0a0a0f',
  bgTertiary: '#0f0f17',
  bgCard: '#12121c',
  bgCardGlass: 'rgba(18, 18, 28, 0.7)',
  bgElevated: '#1a1a28',
  bgGradientStart: '#0a0a14',
  bgGradientEnd: '#000000',

  // Text Colors - Clean White/Gray
  textPrimary: '#ffffff',
  textSecondary: '#a0a0b0',
  textTertiary: '#6a6a7a',
  textMuted: '#4a4a58',
  textDisabled: '#2a2a38',
  textGradient: 'linear-gradient(90deg, #a78bfa, #c4b5fd)',

  // Accent - Vibrant Purple (Matching Stitch)
  accentPrimary: '#a855f7',
  accentPrimaryHover: '#c084fc',
  accentSecondary: '#9333ea',
  accentTertiary: '#7c3aed',
  accentGlow: 'rgba(168, 85, 247, 0.2)',
  accentGlowStrong: 'rgba(168, 85, 247, 0.4)',
  accentGradientStart: '#a855f7',
  accentGradientEnd: '#6366f1',

  // Semantic Colors
  success: '#22c55e',
  successBg: 'rgba(34, 197, 94, 0.15)',
  warning: '#f59e0b',
  warningBg: 'rgba(245, 158, 11, 0.15)',
  error: '#ef4444',
  errorBg: 'rgba(239, 68, 68, 0.15)',
  info: '#3b82f6',
  infoBg: 'rgba(59, 130, 246, 0.15)',

  // Borders - Subtle glass effect
  borderPrimary: 'rgba(255, 255, 255, 0.06)',
  borderSecondary: 'rgba(255, 255, 255, 0.1)',
  borderAccent: 'rgba(168, 85, 247, 0.3)',
  borderHover: 'rgba(255, 255, 255, 0.15)',

  // Tab Bar
  tabBarBg: 'rgba(0, 0, 0, 0.95)',
  tabBarBorder: 'rgba(255, 255, 255, 0.06)',
  tabIconActive: '#a855f7',
  tabIconInactive: '#4a4a58',
};

// Light Theme
export const LightColors = {
  bgPrimary: '#f5f3ef',
  bgSecondary: '#edeae4',
  bgTertiary: '#e5e1da',
  bgCard: '#ffffff',
  bgElevated: '#ffffff',

  textPrimary: '#2c2825',
  textSecondary: '#5c5650',
  textTertiary: '#8a8378',
  textMuted: '#a8a099',
  textDisabled: '#c4bdb5',

  accentPrimary: '#8b5cf6',
  accentPrimaryHover: '#7c3aed',
  accentSecondary: '#6d28d9',
  accentTertiary: '#5b21b6',
  accentGlow: 'rgba(139, 92, 246, 0.15)',

  success: '#22c55e',
  successBg: 'rgba(34, 197, 94, 0.12)',
  warning: '#f59e0b',
  warningBg: 'rgba(245, 158, 11, 0.12)',
  error: '#ef4444',
  errorBg: 'rgba(239, 68, 68, 0.12)',
  info: '#3b82f6',
  infoBg: 'rgba(59, 130, 246, 0.12)',

  borderPrimary: '#e0dbd3',
  borderSecondary: '#d1cbc2',
  borderAccent: '#c2bab0',
  borderHover: '#b3aa9e',

  tabBarBg: '#ffffff',
  tabBarBorder: '#e0dbd3',
  tabIconActive: '#8b5cf6',
  tabIconInactive: '#a8a099',
};

// Get colors by theme
export const getColors = (theme: ThemeType = 'dark') => {
  switch (theme) {
    case 'light':
      return LightColors;
    default:
      return DarkColors;
  }
};

// Default export for convenience
export const Colors = DarkColors;

export default {
  light: LightColors,
  dark: DarkColors,
};
