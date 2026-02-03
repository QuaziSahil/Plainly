/**
 * Plainly - The Tool Hub
 * Storage Store (Favorites, History)
 */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface HistoryItem {
  path: string;
  name: string;
  result: string;
  resultUnit?: string;
  type: 'calculator' | 'ai' | 'converter';
  timestamp: number;
}

interface StorageState {
  favorites: string[];
  history: HistoryItem[];
  
  // Actions
  toggleFavorite: (path: string) => void;
  isFavorite: (path: string) => boolean;
  addToHistory: (item: Omit<HistoryItem, 'timestamp'>) => void;
  clearHistory: () => void;
  removeFromHistory: (path: string, timestamp: number) => void;
}

const MAX_HISTORY_ITEMS = 50;

export const useStorageStore = create<StorageState>()(
  persist(
    (set, get) => ({
      favorites: [],
      history: [],

      toggleFavorite: (path: string) => {
        set((state) => {
          if (state.favorites.includes(path)) {
            return { favorites: state.favorites.filter(p => p !== path) };
          }
          return { favorites: [...state.favorites, path] };
        });
      },

      isFavorite: (path: string) => {
        return get().favorites.includes(path);
      },

      addToHistory: (item) => {
        set((state) => {
          const newItem: HistoryItem = {
            ...item,
            timestamp: Date.now(),
          };

          // Remove duplicate if exists
          const filtered = state.history.filter(
            h => !(h.path === item.path && h.result === item.result)
          );

          // Add new item at the beginning
          const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
          return { history: updated };
        });
      },

      clearHistory: () => {
        set({ history: [] });
      },

      removeFromHistory: (path: string, timestamp: number) => {
        set((state) => ({
          history: state.history.filter(
            h => !(h.path === path && h.timestamp === timestamp)
          ),
        }));
      },
    }),
    {
      name: 'plainly-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
