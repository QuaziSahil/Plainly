/**
 * Plainly - The Tool Hub
 * Settings Store
 */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeType } from '../constants/Colors';

interface SettingsState {
  theme: ThemeType;
  decimalPlaces: number;
  currency: string;
  unitSystem: 'metric' | 'imperial';
  hapticsEnabled: boolean;
  
  // Actions
  setTheme: (theme: ThemeType) => void;
  setDecimalPlaces: (places: number) => void;
  setCurrency: (currency: string) => void;
  setUnitSystem: (system: 'metric' | 'imperial') => void;
  setHapticsEnabled: (enabled: boolean) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS = {
  theme: 'dark' as ThemeType,
  decimalPlaces: 2,
  currency: 'USD',
  unitSystem: 'metric' as const,
  hapticsEnabled: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,

      setTheme: (theme) => set({ theme }),
      setDecimalPlaces: (decimalPlaces) => set({ decimalPlaces }),
      setCurrency: (currency) => set({ currency }),
      setUnitSystem: (unitSystem) => set({ unitSystem }),
      setHapticsEnabled: (hapticsEnabled) => set({ hapticsEnabled }),
      resetSettings: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: 'plainly-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
