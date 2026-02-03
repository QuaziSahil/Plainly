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
import { TrendingUp, DollarSign, Calendar, Percent } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { calculateCompoundInterest } from '@/services/calculations';
import { useStorageStore } from '@/stores/useStorageStore';
import ToolHeader from '@/components/ToolHeader';

const FREQUENCIES = [
  { key: 'annually', label: 'Annually' },
  { key: 'semi-annually', label: 'Semi-Annually' },
  { key: 'quarterly', label: 'Quarterly' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'daily', label: 'Daily' },
] as const;

export default function CompoundInterestCalculatorScreen() {
  const { addToHistory } = useStorageStore();
  
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [frequency, setFrequency] = useState<typeof FREQUENCIES[number]['key']>('annually');
  const [result, setResult] = useState<ReturnType<typeof calculateCompoundInterest> | null>(null);

  const handleCalculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const t = parseInt(years);
    if (isNaN(p) || isNaN(r) || isNaN(t) || p <= 0 || r <= 0 || t <= 0) return;

    const calcResult = calculateCompoundInterest(p, r, t, frequency);
    setResult(calcResult);
    
    addToHistory({
      path: '/compound-interest-calculator',
      name: 'Compound Interest',
      result: `$${calcResult.futureValue.toLocaleString()}`,
      type: 'calculator',
    });
  };

  const handleReset = () => {
    setPrincipal('');
    setRate('');
    setYears('');
    setFrequency('annually');
    setResult(null);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.bgPrimary} />
        
        <ToolHeader title="Compound Interest" toolId="compound-interest" onRefresh={handleReset} />

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView 
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Principal Amount */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Initial Investment</Text>
              <View style={styles.inputWrapper}>
                <DollarSign size={20} color={Colors.textTertiary} />
                <TextInput
                  style={styles.input}
                  placeholder="10,000"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="decimal-pad"
                  value={principal}
                  onChangeText={setPrincipal}
                />
              </View>
            </View>

            {/* Interest Rate */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Annual Interest Rate (%)</Text>
              <View style={styles.inputWrapper}>
                <Percent size={20} color={Colors.textTertiary} />
                <TextInput
                  style={styles.input}
                  placeholder="7"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="decimal-pad"
                  value={rate}
                  onChangeText={setRate}
                />
              </View>
            </View>

            {/* Time Period */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Time Period (Years)</Text>
              <View style={styles.inputWrapper}>
                <Calendar size={20} color={Colors.textTertiary} />
                <TextInput
                  style={styles.input}
                  placeholder="10"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="number-pad"
                  value={years}
                  onChangeText={setYears}
                />
              </View>
            </View>

            {/* Compounding Frequency */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Compounding Frequency</Text>
              <View style={styles.frequencyGrid}>
                {FREQUENCIES.map((f) => (
                  <TouchableOpacity
                    key={f.key}
                    style={[
                      styles.frequencyButton,
                      frequency === f.key && styles.frequencyButtonActive,
                    ]}
                    onPress={() => setFrequency(f.key)}
                  >
                    <Text
                      style={[
                        styles.frequencyButtonText,
                        frequency === f.key && styles.frequencyButtonTextActive,
                      ]}
                    >
                      {f.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Calculate Button */}
            <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
              <TrendingUp size={20} color="#000" />
              <Text style={styles.calculateButtonText}>Calculate Growth</Text>
            </TouchableOpacity>

            {/* Results */}
            {result && (
              <View style={styles.resultsCard}>
                <Text style={styles.resultsTitle}>Investment Growth</Text>
                
                {/* Future Value */}
                <View style={styles.mainResult}>
                  <Text style={styles.mainResultLabel}>Final Balance</Text>
                  <Text style={styles.mainResultValue}>
                    ${result.futureValue.toLocaleString()}
                  </Text>
                </View>

                <View style={styles.divider} />

                {/* Details */}
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Initial Investment</Text>
                  <Text style={styles.resultValue}>${parseFloat(principal).toLocaleString()}</Text>
                </View>
                
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Total Interest Earned</Text>
                  <Text style={[styles.resultValue, styles.resultValueGreen]}>
                    +${result.totalInterest.toLocaleString()}
                  </Text>
                </View>
                
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Effective Annual Rate</Text>
                  <Text style={styles.resultValue}>{result.effectiveRate}%</Text>
                </View>

                {/* Yearly Breakdown Preview */}
                {result.yearlyBreakdown.length > 0 && (
                  <>
                    <View style={styles.divider} />
                    <Text style={styles.breakdownTitle}>Year-by-Year Growth</Text>
                    <View style={styles.breakdownList}>
                      {result.yearlyBreakdown.slice(0, 5).map((year) => (
                        <View key={year.year} style={styles.breakdownRow}>
                          <Text style={styles.breakdownYear}>Year {year.year}</Text>
                          <Text style={styles.breakdownBalance}>
                            ${year.balance.toLocaleString()}
                          </Text>
                          <Text style={styles.breakdownInterest}>
                            +${year.interest.toLocaleString()}
                          </Text>
                        </View>
                      ))}
                      {result.yearlyBreakdown.length > 5 && (
                        <Text style={styles.moreYears}>
                          ... and {result.yearlyBreakdown.length - 5} more years
                        </Text>
                      )}
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
  frequencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  frequencyButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  frequencyButtonActive: {
    backgroundColor: Colors.accentPrimary,
    borderColor: Colors.accentPrimary,
  },
  frequencyButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  frequencyButtonTextActive: {
    color: '#000',
  },
  calculateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.accentPrimary,
    paddingVertical: 18,
    borderRadius: 16,
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
  mainResult: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mainResultLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  mainResultValue: {
    fontSize: 42,
    fontWeight: '800',
    color: Colors.accentPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderPrimary,
    marginVertical: 16,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  resultValueGreen: {
    color: Colors.success,
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  breakdownList: {
    gap: 8,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgElevated,
    borderRadius: 10,
    padding: 12,
  },
  breakdownYear: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  breakdownBalance: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginRight: 12,
  },
  breakdownInterest: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: '500',
  },
  moreYears: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 8,
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
