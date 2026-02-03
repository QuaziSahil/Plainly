import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Sparkles } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

interface AIFloatingButtonProps {
  onPress: () => void;
}

export default function AIFloatingButton({ onPress }: AIFloatingButtonProps) {
  const insets = useSafeAreaInsets();
  const bottomOffset = Math.max(insets.bottom, 10) + 70; // 70 for tab bar height
  
  return (
    <View style={[styles.container, { bottom: bottomOffset }]}>
      {/* Main button - no glow, no shadows */}
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Sparkles size={26} color="#fff" strokeWidth={2.5} />
      </TouchableOpacity>

      {/* Label */}
      <View style={styles.labelContainer}>
        <Text style={styles.label}>AI</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    alignItems: 'center',
    zIndex: 999,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.accentPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    // No shadows - clean button
  },
  labelContainer: {
    position: 'absolute',
    top: -8,
    right: -4,
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: '#fff',
  },
});
