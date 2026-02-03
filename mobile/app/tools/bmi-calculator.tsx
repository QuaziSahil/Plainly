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
import { Scale, Ruler, Activity } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { calculateBMI } from '@/services/calculations';
import { useStorageStore } from '@/stores/useStorageStore';
import ToolHeader from '@/components/ToolHeader';

export default function BMICalculatorScreen() {
  const { addToHistory } = useStorageStore();
  
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [result, setResult] = useState<ReturnType<typeof calculateBMI> | null>(null);

  const handleCalculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return;

    const calcResult = calculateBMI(w, h, unit);
    setResult(calcResult);
    
    addToHistory({
      path: '/bmi-calculator',
      name: 'BMI Calculator',
      result: `BMI: ${calcResult.bmi} - ${calcResult.category}`,
      type: 'calculator',
    });
  };

  const handleReset = () => {
    setWeight('');
    setHeight('');
    setResult(null);
  };

  const getBMIIndicatorPosition = (bmi: number): number => {
    // Scale BMI from 15-40 to 0-100%
    const min = 15;
    const max = 40;
    const position = ((bmi - min) / (max - min)) * 100;
    return Math.min(100, Math.max(0, position));
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.bgPrimary} />
        
        {/* Header */}
        <ToolHeader title="BMI Calculator" toolId="bmi" onRefresh={handleReset} />

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView 
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Unit Toggle */}
            <View style={styles.unitToggle}>
              <TouchableOpacity
                style={[styles.unitButton, unit === 'metric' && styles.unitButtonActive]}
                onPress={() => setUnit('metric')}
              >
                <Text style={[styles.unitButtonText, unit === 'metric' && styles.unitButtonTextActive]}>
                  Metric
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.unitButton, unit === 'imperial' && styles.unitButtonActive]}
                onPress={() => setUnit('imperial')}
              >
                <Text style={[styles.unitButtonText, unit === 'imperial' && styles.unitButtonTextActive]}>
                  Imperial
                </Text>
              </TouchableOpacity>
            </View>

            {/* Weight Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Weight {unit === 'metric' ? '(kg)' : '(lbs)'}
              </Text>
              <View style={styles.inputWrapper}>
                <Scale size={20} color={Colors.textTertiary} />
                <TextInput
                  style={styles.input}
                  placeholder={unit === 'metric' ? '70' : '154'}
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="decimal-pad"
                  value={weight}
                  onChangeText={setWeight}
                />
                <Text style={styles.inputUnit}>{unit === 'metric' ? 'kg' : 'lbs'}</Text>
              </View>
            </View>

            {/* Height Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Height {unit === 'metric' ? '(cm)' : '(inches)'}
              </Text>
              <View style={styles.inputWrapper}>
                <Ruler size={20} color={Colors.textTertiary} />
                <TextInput
                  style={styles.input}
                  placeholder={unit === 'metric' ? '170' : '67'}
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="decimal-pad"
                  value={height}
                  onChangeText={setHeight}
                />
                <Text style={styles.inputUnit}>{unit === 'metric' ? 'cm' : 'in'}</Text>
              </View>
            </View>

            {/* Calculate Button */}
            <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
              <Text style={styles.calculateButtonText}>Calculate BMI</Text>
            </TouchableOpacity>

            {/* Results */}
            {result && (
              <View style={styles.resultsCard}>
                {/* BMI Value */}
                <View style={styles.bmiValueContainer}>
                  <Text style={styles.bmiLabel}>Your BMI</Text>
                  <Text style={[styles.bmiValue, { color: result.color }]}>{result.bmi}</Text>
                  <View style={[styles.categoryBadge, { backgroundColor: `${result.color}20` }]}>
                    <Text style={[styles.categoryText, { color: result.color }]}>
                      {result.category}
                    </Text>
                  </View>
                </View>

                {/* BMI Scale */}
                <View style={styles.scaleContainer}>
                  <View style={styles.scaleBar}>
                    <View style={[styles.scaleSegment, { backgroundColor: '#3b82f6', flex: 1 }]} />
                    <View style={[styles.scaleSegment, { backgroundColor: '#22c55e', flex: 1.5 }]} />
                    <View style={[styles.scaleSegment, { backgroundColor: '#f59e0b', flex: 1 }]} />
                    <View style={[styles.scaleSegment, { backgroundColor: '#ef4444', flex: 1.5 }]} />
                  </View>
                  <View 
                    style={[
                      styles.scaleIndicator, 
                      { left: `${getBMIIndicatorPosition(result.bmi)}%` }
                    ]} 
                  />
                  <View style={styles.scaleLabels}>
                    <Text style={styles.scaleLabel}>15</Text>
                    <Text style={styles.scaleLabel}>18.5</Text>
                    <Text style={styles.scaleLabel}>25</Text>
                    <Text style={styles.scaleLabel}>30</Text>
                    <Text style={styles.scaleLabel}>40</Text>
                  </View>
                </View>

                {/* Healthy Range */}
                <View style={styles.healthyRangeCard}>
                  <Activity size={20} color={Colors.success} />
                  <View style={styles.healthyRangeInfo}>
                    <Text style={styles.healthyRangeTitle}>Healthy Weight Range</Text>
                    <Text style={styles.healthyRangeValue}>
                      {result.healthyWeightRange.min} - {result.healthyWeightRange.max} {unit === 'metric' ? 'kg' : 'lbs'}
                    </Text>
                  </View>
                </View>

                {/* BMI Categories Legend */}
                <View style={styles.legendContainer}>
                  <Text style={styles.legendTitle}>BMI Categories</Text>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#3b82f6' }]} />
                    <Text style={styles.legendText}>Underweight: &lt; 18.5</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#22c55e' }]} />
                    <Text style={styles.legendText}>Normal: 18.5 - 24.9</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
                    <Text style={styles.legendText}>Overweight: 25 - 29.9</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
                    <Text style={styles.legendText}>Obese: ≥ 30</Text>
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
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  unitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  unitButtonActive: {
    backgroundColor: Colors.accentPrimary,
  },
  unitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  unitButtonTextActive: {
    color: '#000',
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
  inputUnit: {
    fontSize: 14,
    color: Colors.textTertiary,
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
  resultsCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.borderSecondary,
  },
  bmiValueContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  bmiLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  bmiValue: {
    fontSize: 64,
    fontWeight: '800',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scaleContainer: {
    marginBottom: 24,
    position: 'relative',
  },
  scaleBar: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  scaleSegment: {
    height: '100%',
  },
  scaleIndicator: {
    position: 'absolute',
    top: -4,
    width: 4,
    height: 20,
    backgroundColor: Colors.textPrimary,
    borderRadius: 2,
    transform: [{ translateX: -2 }],
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  scaleLabel: {
    fontSize: 10,
    color: Colors.textTertiary,
  },
  healthyRangeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.successBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  healthyRangeInfo: {
    flex: 1,
  },
  healthyRangeTitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  healthyRangeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.success,
  },
  legendContainer: {
    marginBottom: 16,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 13,
    color: Colors.textTertiary,
  },
  resetButton: {
    marginTop: 8,
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
