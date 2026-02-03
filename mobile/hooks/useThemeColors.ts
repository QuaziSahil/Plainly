/**
 * Plainly - The Tool Hub
 * Theme Colors Hook
 * Returns colors based on current theme setting
 */

import { getColors, DarkColors, LightColors } from '@/constants/Colors';
import { useSettingsStore } from '@/stores/useSettingsStore';

export function useThemeColors() {
  const { theme } = useSettingsStore();
  return getColors(theme);
}

export function useIsDarkTheme() {
  const { theme } = useSettingsStore();
  return theme === 'dark';
}

// For StyleSheet.create() which can't use hooks,
// we export both color sets so components can conditionally apply
export { DarkColors, LightColors };
