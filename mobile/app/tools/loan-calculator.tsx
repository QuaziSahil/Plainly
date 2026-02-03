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
import { Calculator, DollarSign, Percent, Calendar, PieChart, TrendingUp, Wallet } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { calculateLoan } from '@/services/calculations';
import { useStorageStore } from '@/stores/useStorageStore';
import ToolHeader from '@/components/ToolHeader';

export default function LoanCalculatorScreen() {
  const { addToHistory } = useStorageStore();
  
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calculateLoan> | null>(null);

  const handleCalculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const y = parseFloat(years);
    if (isNaN(p) || isNaN(r) || isNaN(y) || p <= 0 || r < 0 || y <= 0) return;

    // Calculate loan expects months, so convert years to months
    const calcResult = calculateLoan(p, r, y * 12);
    setResult(calcResult);
    
    addToHistory({
      path: '/loan-calculator',
      name: 'Loan Calculator',
      result: `$${calcResult.monthlyPayment.toFixed(2)}/mo`,
      type: 'calculator',
    });
  };

  const handleReset = () => {
    setPrincipal('');
    setRate('');
    setYears('');
    setResult(null);
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(2)}`;
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.bgPrimary} />
        
        <ToolHeader title="Loan Calculator" toolId="loan-calculator" onRefresh={handleReset} />

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView 
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Loan Amount */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Loan Amount</Text>
              <View style={styles.inputWrapper}>
                <DollarSign size={20} color={Colors.textTertiary} />
                <TextInput
                  style={styles.input}
                  placeholder="250,000"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="decimal-pad"
                  value={principal}
                  onChangeText={setPrincipal}
                />
              </View>
            </View>

            {/* Interest Rate */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Annual Interest Rate</Text>
              <View style={styles.inputWrapper}>
                <Percent size={20} color={Colors.textTertiary} />
                <TextInput
                  style={styles.input}
                  placeholder="7.5"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="decimal-pad"
                  value={rate}
                  onChangeText={setRate}
                />
              </View>
            </View>

            {/* Loan Term */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Loan Term (Years)</Text>
              <View style={styles.inputWrapper}>
                <Calendar size={20} color={Colors.textTertiary} />
                <TextInput
                  style={styles.input}
                  placeholder="30"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="number-pad"
                  value={years}
                  onChangeText={setYears}
                />
              </View>
            </View>

            {/* Calculate Button */}
            <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
              <Calculator size={20} color="#000" />
              <Text style={styles.calculateButtonText}>Calculate Loan</Text>
            </TouchableOpacity>

            {/* Results */}
            {result && (
              <View style={styles.resultsCard}>
                {/* Monthly Payment Highlight */}
                <View style={styles.monthlyCard}>
                  <Text style={styles.monthlyLabel}>Monthly Payment</Text>
                  <Text style={styles.monthlyValue}>
                    ${result.monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Text>
                  <Text style={styles.monthlySubtext}>for {parseFloat(years)} years ({parseFloat(years) * 12} payments)</Text>
                </View>

                <View style={styles.divider} />

                {/* Breakdown Stats */}
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <View style={[styles.statIcon, { backgroundColor: Colors.infoBg }]}>
                      <Wallet size={18} color={Colors.info} />
                    </View>
                    <Text style={styles.statLabel}>Principal</Text>
                    <Text style={styles.statValue}>{formatCurrency(parseFloat(principal))}</Text>
                  </View>
                  
                  <View style={styles.statItem}>
                    <View style={[styles.statIcon, { backgroundColor: Colors.warningBg }]}>
                      <TrendingUp size={18} color={Colors.warning} />
                    </View>
                    <Text style={styles.statLabel}>Total Interest</Text>
                    <Text style={[styles.statValue, { color: Colors.warning }]}>
                      {formatCurrency(result.totalInterest)}
                    </Text>
                  </View>
                  
                  <View style={styles.statItem}>
                    <View style={[styles.statIcon, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
                      <PieChart size={18} color={Colors.accentPrimary} />
                    </View>
                    <Text style={styles.statLabel}>Total Payment</Text>
                    <Text style={[styles.statValue, { color: Colors.accentPrimary }]}>
                      {formatCurrency(result.totalPayment)}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                {/* Interest Percentage Bar */}
                <View style={styles.interestSection}>
                  <Text style={styles.interestTitle}>Payment Breakdown</Text>
                  <View style={styles.breakdownBar}>
                    <View 
                      style={[
                        styles.breakdownPrincipal, 
                        { flex: parseFloat(principal) / result.totalPayment }
                      ]} 
                    />
                    <View 
                      style={[
                        styles.breakdownInterest, 
                        { flex: result.totalInterest / result.totalPayment }
                      ]} 
                    />
                  </View>
                  <View style={styles.legendRow}>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: Colors.info }]} />
                      <Text style={styles.legendText}>
                        Principal ({((parseFloat(principal) / result.totalPayment) * 100).toFixed(1)}%)
                      </Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: Colors.warning }]} />
                      <Text style={styles.legendText}>
                        Interest ({((result.totalInterest / result.totalPayment) * 100).toFixed(1)}%)
                      </Text>
                    </View>
                  </View>
                </View>

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
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 10,
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
  calculateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.accentPrimary,
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 24,
    marginTop: 8,
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
  monthlyCard: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  monthlyLabel: {
    fontSize: 14,
    color: Colors.textTertiary,
    marginBottom: 6,
  },
  monthlyValue: {
    fontSize: 42,
    fontWeight: '800',
    color: Colors.accentPrimary,
    letterSpacing: -1,
  },
  monthlySubtext: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 6,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderPrimary,
    marginVertical: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textTertiary,
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  interestSection: {
    marginTop: 4,
  },
  interestTitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 12,
    fontWeight: '600',
  },
  breakdownBar: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
  },
  breakdownPrincipal: {
    backgroundColor: Colors.info,
  },
  breakdownInterest: {
    backgroundColor: Colors.warning,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  resetButton: {
    marginTop: 20,
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
