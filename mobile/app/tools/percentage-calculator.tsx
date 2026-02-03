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
import { Percent, Calculator, TrendingUp, TrendingDown } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { calculatePercentage } from '@/services/calculations';
import { useStorageStore } from '@/stores/useStorageStore';
import ToolHeader from '@/components/ToolHeader';

type CalculationType = 'percentOf' | 'whatPercent' | 'percentChange' | 'increase' | 'decrease';

export default function PercentageCalculatorScreen() {
  const { addToHistory } = useStorageStore();
  
  const [calcType, setCalcType] = useState<CalculationType>('percentOf');
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const calculations: { type: CalculationType; label: string; icon: React.ReactNode }[] = [
    { type: 'percentOf', label: 'X% of Y', icon: <Percent size={18} color={Colors.textPrimary} /> },
    { type: 'whatPercent', label: 'X is what % of Y?', icon: <Calculator size={18} color={Colors.textPrimary} /> },
    { type: 'percentChange', label: '% Change', icon: <TrendingUp size={18} color={Colors.textPrimary} /> },
    { type: 'increase', label: 'Increase by %', icon: <TrendingUp size={18} color={Colors.success} /> },
    { type: 'decrease', label: 'Decrease by %', icon: <TrendingDown size={18} color={Colors.error} /> },
  ];

  const getLabels = (): { label1: string; label2: string } => {
    switch (calcType) {
      case 'percentOf':
        return { label1: 'Percentage (%)', label2: 'Number' };
      case 'whatPercent':
        return { label1: 'Value', label2: 'Total' };
      case 'percentChange':
        return { label1: 'From', label2: 'To' };
      case 'increase':
      case 'decrease':
        return { label1: 'Number', label2: 'Percentage (%)' };
      default:
        return { label1: 'Value 1', label2: 'Value 2' };
    }
  };

  const handleCalculate = () => {
    const v1 = parseFloat(value1);
    const v2 = parseFloat(value2);
    if (isNaN(v1) || isNaN(v2)) return;

    let calcResult: number;
    switch (calcType) {
      case 'percentOf':
        calcResult = calculatePercentage.percentOf(v1, v2);
        break;
      case 'whatPercent':
        calcResult = calculatePercentage.whatPercent(v1, v2);
        break;
      case 'percentChange':
        calcResult = calculatePercentage.percentChange(v1, v2);
        break;
      case 'increase':
        calcResult = calculatePercentage.increaseBy(v1, v2);
        break;
      case 'decrease':
        calcResult = calculatePercentage.decreaseBy(v1, v2);
        break;
      default:
        return;
    }

    setResult(calcResult);
    
    addToHistory({
      path: '/percentage-calculator',
      name: 'Percentage Calculator',
      result: `Result: ${calcResult}`,
      type: 'calculator',
    });
  };

  const getResultLabel = (): string => {
    switch (calcType) {
      case 'percentOf':
        return `${value1}% of ${value2} is`;
      case 'whatPercent':
        return `${value1} is this % of ${value2}`;
      case 'percentChange':
        return 'Percentage Change';
      case 'increase':
        return `${value1} increased by ${value2}%`;
      case 'decrease':
        return `${value1} decreased by ${value2}%`;
      default:
        return 'Result';
    }
  };

  const handleReset = () => {
    setValue1('');
    setValue2('');
    setResult(null);
  };

  const labels = getLabels();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.bgPrimary} />
        
        <ToolHeader title="Percentage Calculator" toolId="percentage-calculator" onRefresh={handleReset} />

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView 
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Calculation Type Selector */}
            <View style={styles.typeSelector}>
              {calculations.map((calc) => (
                <TouchableOpacity
                  key={calc.type}
                  style={[
                    styles.typeButton,
                    calcType === calc.type && styles.typeButtonActive,
                  ]}
                  onPress={() => {
                    setCalcType(calc.type);
                    setResult(null);
                  }}
                >
                  {calc.icon}
                  <Text
                    style={[
                      styles.typeButtonText,
                      calcType === calc.type && styles.typeButtonTextActive,
                    ]}
                  >
                    {calc.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Input 1 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{labels.label1}</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="decimal-pad"
                  value={value1}
                  onChangeText={setValue1}
                />
                {(calcType === 'percentOf' || calcType === 'increase' || calcType === 'decrease') && 
                  calcType === 'percentOf' && (
                  <Percent size={20} color={Colors.textTertiary} />
                )}
              </View>
            </View>

            {/* Input 2 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{labels.label2}</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="decimal-pad"
                  value={value2}
                  onChangeText={setValue2}
                />
                {(calcType === 'increase' || calcType === 'decrease') && (
                  <Percent size={20} color={Colors.textTertiary} />
                )}
              </View>
            </View>

            {/* Calculate Button */}
            <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
              <Text style={styles.calculateButtonText}>Calculate</Text>
            </TouchableOpacity>

            {/* Result */}
            {result !== null && (
              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>{getResultLabel()}</Text>
                <View style={styles.resultValueContainer}>
                  <Text style={styles.resultValue}>{result}</Text>
                  {(calcType === 'whatPercent' || calcType === 'percentChange') && (
                    <Text style={styles.resultUnit}>%</Text>
                  )}
                </View>
                
                {calcType === 'percentChange' && (
                  <View style={[
                    styles.changeBadge,
                    { backgroundColor: result >= 0 ? Colors.successBg : Colors.errorBg }
                  ]}>
                    {result >= 0 ? (
                      <TrendingUp size={16} color={Colors.success} />
                    ) : (
                      <TrendingDown size={16} color={Colors.error} />
                    )}
                    <Text style={[
                      styles.changeText,
                      { color: result >= 0 ? Colors.success : Colors.error }
                    ]}>
                      {result >= 0 ? 'Increase' : 'Decrease'}
                    </Text>
                  </View>
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
  typeSelector: {
    marginBottom: 24,
    gap: 8,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  typeButtonActive: {
    borderColor: Colors.accentPrimary,
    backgroundColor: Colors.accentGlow,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  typeButtonTextActive: {
    color: Colors.textPrimary,
  },
  inputGroup: {
    marginBottom: 20,
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
  resultCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderSecondary,
  },
  resultLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  resultValueContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  resultValue: {
    fontSize: 56,
    fontWeight: '800',
    color: Colors.accentPrimary,
  },
  resultUnit: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 10,
    marginLeft: 4,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  resetButton: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
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
