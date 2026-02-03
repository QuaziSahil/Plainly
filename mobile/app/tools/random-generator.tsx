import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { Stack } from 'expo-router';
import { Dices, RefreshCw, Sparkles, Hash, Copy, Check, Shuffle } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import * as Clipboard from 'expo-clipboard';
import { useStorageStore } from '@/stores/useStorageStore';
import ToolHeader from '@/components/ToolHeader';

type GeneratorMode = 'number' | 'coin' | 'dice' | 'password' | 'color';

const DICE_FACES = [1, 2, 3, 4, 5, 6];

export default function RandomGeneratorScreen() {
  const { addToHistory } = useStorageStore();
  
  const [mode, setMode] = useState<GeneratorMode>('number');
  const [numberRange, setNumberRange] = useState({ min: 1, max: 100 });
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [diceRolling, setDiceRolling] = useState(false);

  const handleReset = () => {
    setMode('number');
    setNumberRange({ min: 1, max: 100 });
    setResult(null);
    setHistory([]);
    setCopied(false);
  };

  const generateRandom = () => {
    let newResult = '';
    
    switch (mode) {
      case 'number':
        newResult = String(Math.floor(Math.random() * (numberRange.max - numberRange.min + 1)) + numberRange.min);
        break;
      case 'coin':
        newResult = Math.random() < 0.5 ? 'Heads' : 'Tails';
        break;
      case 'dice':
        setDiceRolling(true);
        setTimeout(() => {
          const roll = DICE_FACES[Math.floor(Math.random() * 6)];
          setResult(String(roll));
          setHistory(prev => [String(roll), ...prev.slice(0, 9)]);
          setDiceRolling(false);
        }, 500);
        return;
      case 'password':
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        newResult = Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        break;
      case 'color':
        newResult = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        break;
    }
    
    setResult(newResult);
    setHistory(prev => [newResult, ...prev.slice(0, 9)]);
    
    addToHistory({
      path: '/random-generator',
      name: 'Random Generator',
      result: `${mode}: ${newResult}`,
      type: 'calculator',
    });
  };

  const copyToClipboard = async () => {
    if (result) {
      await Clipboard.setStringAsync(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const adjustRange = (type: 'min' | 'max', delta: number) => {
    setNumberRange(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta),
    }));
  };

  const getDiceIcon = (value: number) => {
    const dots = {
      1: [[1, 1]],
      2: [[0, 0], [2, 2]],
      3: [[0, 0], [1, 1], [2, 2]],
      4: [[0, 0], [0, 2], [2, 0], [2, 2]],
      5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
      6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
    };
    return dots[value as keyof typeof dots] || [];
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.bgPrimary} />
        
        <ToolHeader title="Random Generator" toolId="random-generator" onRefresh={handleReset} />

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Mode Selector */}
          <View style={styles.modeSelector}>
            {[
              { id: 'number', icon: Hash, label: 'Number' },
              { id: 'coin', icon: RefreshCw, label: 'Coin' },
              { id: 'dice', icon: Dices, label: 'Dice' },
              { id: 'password', icon: Shuffle, label: 'Password' },
              { id: 'color', icon: Sparkles, label: 'Color' },
            ].map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.modeButton, mode === item.id && styles.modeButtonActive]}
                onPress={() => {
                  setMode(item.id as GeneratorMode);
                  setResult(null);
                }}
              >
                <item.icon size={18} color={mode === item.id ? '#000' : Colors.textSecondary} />
                <Text style={[styles.modeText, mode === item.id && styles.modeTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Number Range (only for number mode) */}
          {mode === 'number' && (
            <View style={styles.rangeSection}>
              <Text style={styles.label}>Range</Text>
              <View style={styles.rangeRow}>
                <View style={styles.rangeControl}>
                  <TouchableOpacity 
                    style={styles.rangeButton} 
                    onPress={() => adjustRange('min', -10)}
                  >
                    <Text style={styles.rangeButtonText}>-10</Text>
                  </TouchableOpacity>
                  <View style={styles.rangeValue}>
                    <Text style={styles.rangeValueText}>{numberRange.min}</Text>
                    <Text style={styles.rangeLabel}>Min</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.rangeButton} 
                    onPress={() => adjustRange('min', 10)}
                  >
                    <Text style={styles.rangeButtonText}>+10</Text>
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.rangeTo}>to</Text>
                
                <View style={styles.rangeControl}>
                  <TouchableOpacity 
                    style={styles.rangeButton} 
                    onPress={() => adjustRange('max', -10)}
                  >
                    <Text style={styles.rangeButtonText}>-10</Text>
                  </TouchableOpacity>
                  <View style={styles.rangeValue}>
                    <Text style={styles.rangeValueText}>{numberRange.max}</Text>
                    <Text style={styles.rangeLabel}>Max</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.rangeButton} 
                    onPress={() => adjustRange('max', 10)}
                  >
                    <Text style={styles.rangeButtonText}>+10</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* Result Display */}
          <View style={styles.resultCard}>
            {mode === 'dice' && result ? (
              <View style={styles.diceContainer}>
                <View style={[styles.dice, diceRolling && styles.diceRolling]}>
                  {getDiceIcon(parseInt(result)).map((pos, i) => (
                    <View
                      key={i}
                      style={[
                        styles.diceDot,
                        { left: `${pos[1] * 30 + 20}%`, top: `${pos[0] * 30 + 20}%` },
                      ]}
                    />
                  ))}
                </View>
              </View>
            ) : mode === 'coin' && result ? (
              <View style={styles.coinContainer}>
                <View style={[styles.coin, result === 'Heads' && styles.coinHeads]}>
                  <Text style={styles.coinText}>{result === 'Heads' ? 'H' : 'T'}</Text>
                </View>
                <Text style={styles.coinLabel}>{result}</Text>
              </View>
            ) : mode === 'color' && result ? (
              <View style={styles.colorContainer}>
                <View style={[styles.colorSwatch, { backgroundColor: result }]} />
                <Text style={styles.colorValue}>{result.toUpperCase()}</Text>
              </View>
            ) : result ? (
              <View style={styles.textResult}>
                <Text 
                  style={[
                    styles.resultText,
                    mode === 'password' && styles.passwordText,
                  ]}
                  selectable
                >
                  {result}
                </Text>
              </View>
            ) : (
              <View style={styles.placeholder}>
                <Sparkles size={40} color={Colors.textMuted} />
                <Text style={styles.placeholderText}>
                  Tap generate to get a random {mode}
                </Text>
              </View>
            )}

            {result && (
              <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
                {copied ? (
                  <Check size={18} color={Colors.success} />
                ) : (
                  <Copy size={18} color={Colors.textSecondary} />
                )}
                <Text style={[styles.copyText, copied && { color: Colors.success }]}>
                  {copied ? 'Copied!' : 'Copy'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Generate Button */}
          <TouchableOpacity 
            style={styles.generateButton} 
            onPress={generateRandom}
            disabled={diceRolling}
          >
            <RefreshCw size={20} color="#000" />
            <Text style={styles.generateButtonText}>Generate</Text>
          </TouchableOpacity>

          {/* History */}
          {history.length > 0 && (
            <View style={styles.historySection}>
              <Text style={styles.label}>History</Text>
              <View style={styles.historyList}>
                {history.map((item, index) => (
                  <View key={index} style={styles.historyItem}>
                    <Text style={styles.historyText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderPrimary,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  modeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  modeButtonActive: {
    backgroundColor: Colors.accentPrimary,
    borderColor: Colors.accentPrimary,
  },
  modeText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  modeTextActive: {
    color: '#000',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  rangeSection: {
    marginBottom: 24,
  },
  rangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rangeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rangeButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  rangeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  rangeValue: {
    alignItems: 'center',
    minWidth: 50,
  },
  rangeValueText: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.accentPrimary,
  },
  rangeLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  rangeTo: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  resultCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    padding: 32,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.borderSecondary,
    alignItems: 'center',
    minHeight: 180,
    justifyContent: 'center',
  },
  placeholder: {
    alignItems: 'center',
    gap: 12,
  },
  placeholderText: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  textResult: {
    alignItems: 'center',
  },
  resultText: {
    fontSize: 56,
    fontWeight: '800',
    color: Colors.accentPrimary,
    letterSpacing: -2,
  },
  passwordText: {
    fontSize: 18,
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  diceContainer: {
    alignItems: 'center',
  },
  dice: {
    width: 100,
    height: 100,
    backgroundColor: Colors.textPrimary,
    borderRadius: 16,
    position: 'relative',
  },
  diceRolling: {
    opacity: 0.5,
  },
  diceDot: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.bgPrimary,
    marginLeft: -8,
    marginTop: -8,
  },
  coinContainer: {
    alignItems: 'center',
    gap: 16,
  },
  coin: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.warning,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  coinHeads: {
    backgroundColor: Colors.accentPrimary,
  },
  coinText: {
    fontSize: 40,
    fontWeight: '800',
    color: '#000',
  },
  coinLabel: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  colorContainer: {
    alignItems: 'center',
    gap: 16,
  },
  colorSwatch: {
    width: 100,
    height: 100,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  colorValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: Colors.bgSecondary,
  },
  copyText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.accentPrimary,
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 24,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  historySection: {
    marginTop: 8,
  },
  historyList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  historyItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  historyText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
});
