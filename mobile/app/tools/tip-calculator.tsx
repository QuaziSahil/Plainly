import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Stack } from 'expo-router';
import { DollarSign, Users, Percent } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { calculateTip } from '@/services/calculations';
import { useStorageStore } from '@/stores/useStorageStore';
import ToolHeader from '@/components/ToolHeader';

const TIP_PRESETS = [10, 15, 18, 20, 25];

export default function TipCalculatorScreen() {
  const { addToHistory } = useStorageStore();
  
  const [billAmount, setBillAmount] = useState('');
  const [tipPercent, setTipPercent] = useState(15);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [result, setResult] = useState<ReturnType<typeof calculateTip> | null>(null);

  const handleCalculate = () => {
    const bill = parseFloat(billAmount);
    if (isNaN(bill) || bill <= 0) return;

    const calcResult = calculateTip(bill, tipPercent, numberOfPeople);
    setResult(calcResult);
    
    addToHistory({
      path: '/tip-calculator',
      name: 'Tip Calculator',
      result: `$${calcResult.totalAmount} total`,
      type: 'calculator',
    });
  };

  const handleReset = () => {
    setBillAmount('');
    setTipPercent(15);
    setNumberOfPeople(1);
    setResult(null);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.bgPrimary} />
        
        <ToolHeader title="Tip Calculator" toolId="tip" onRefresh={handleReset} />

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView 
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Bill Amount Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bill Amount</Text>
              <View style={styles.inputWrapper}>
                <DollarSign size={20} color={Colors.textTertiary} />
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="decimal-pad"
                  value={billAmount}
                  onChangeText={setBillAmount}
                />
              </View>
            </View>

            {/* Tip Percentage */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tip Percentage</Text>
              <View style={styles.presetRow}>
                {TIP_PRESETS.map((preset) => (
                  <TouchableOpacity
                    key={preset}
                    style={[
                      styles.presetButton,
                      tipPercent === preset && styles.presetButtonActive,
                    ]}
                    onPress={() => setTipPercent(preset)}
                  >
                    <Text
                      style={[
                        styles.presetButtonText,
                        tipPercent === preset && styles.presetButtonTextActive,
                      ]}
                    >
                      {preset}%
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.inputWrapper}>
                <Percent size={20} color={Colors.textTertiary} />
                <TextInput
                  style={styles.input}
                  placeholder="15"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="number-pad"
                  value={tipPercent.toString()}
                  onChangeText={(text) => setTipPercent(parseInt(text) || 0)}
                />
              </View>
            </View>

            {/* Number of People */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Split Between</Text>
              <View style={styles.peopleRow}>
                <TouchableOpacity
                  style={styles.peopleButton}
                  onPress={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}
                >
                  <Text style={styles.peopleButtonText}>−</Text>
                </TouchableOpacity>
                <View style={styles.peopleCount}>
                  <Users size={18} color={Colors.textTertiary} />
                  <Text style={styles.peopleCountText}>{numberOfPeople}</Text>
                </View>
                <TouchableOpacity
                  style={styles.peopleButton}
                  onPress={() => setNumberOfPeople(numberOfPeople + 1)}
                >
                  <Text style={styles.peopleButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Calculate Button */}
            <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
              <Text style={styles.calculateButtonText}>Calculate Tip</Text>
            </TouchableOpacity>

            {/* Results */}
            {result && (
              <View style={styles.resultsCard}>
                <Text style={styles.resultsTitle}>Results</Text>
                
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Tip Amount</Text>
                  <Text style={styles.resultValue}>${result.tipAmount.toFixed(2)}</Text>
                </View>
                
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Total Amount</Text>
                  <Text style={[styles.resultValue, styles.resultValueLarge]}>
                    ${result.totalAmount.toFixed(2)}
                  </Text>
                </View>

                {numberOfPeople > 1 && (
                  <>
                    <View style={styles.divider} />
                    <Text style={styles.perPersonTitle}>Per Person</Text>
                    
                    <View style={styles.resultRow}>
                      <Text style={styles.resultLabel}>Tip per person</Text>
                      <Text style={styles.resultValue}>${result.tipPerPerson.toFixed(2)}</Text>
                    </View>
                    
                    <View style={styles.resultRow}>
                      <Text style={styles.resultLabel}>Total per person</Text>
                      <Text style={[styles.resultValue, styles.resultValueAccent]}>
                        ${result.totalPerPerson.toFixed(2)}
                      </Text>
                    </View>
                  </>
                )}

                <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                  <Text style={styles.resetButtonText}>Reset</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={{ height: 100 }} />
          </ScrollView>
        </KeyboardAvoidingView>
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
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  presetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.bgCard,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  presetButtonActive: {
    backgroundColor: Colors.accentPrimary,
    borderColor: Colors.accentPrimary,
  },
  presetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  presetButtonTextActive: {
    color: '#000',
  },
  peopleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  peopleButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  peopleButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  peopleCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
  },
  peopleCountText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  calculateButton: {
    backgroundColor: Colors.accentPrimary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  calculateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  resultsCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.borderSecondary,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultLabel: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
  resultValue: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  resultValueLarge: {
    fontSize: 24,
    fontWeight: '700',
  },
  resultValueAccent: {
    color: Colors.accentPrimary,
    fontSize: 24,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderPrimary,
    marginVertical: 16,
  },
  perPersonTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textTertiary,
    marginBottom: 12,
  },
  resetButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderSecondary,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});
