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
import { Droplets, User, Activity, Thermometer, Sun, Target, Plus, Minus, Coffee } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { calculateWaterIntake } from '@/services/calculations';
import { useStorageStore } from '@/stores/useStorageStore';
import ToolHeader from '@/components/ToolHeader';

type ActivityLevel = 'sedentary' | 'moderate' | 'active' | 'very-active';

const CLIMATE_OPTIONS = [
  { id: 'cold', label: 'Cold', icon: '❄️' },
  { id: 'moderate', label: 'Moderate', icon: '🌤️' },
  { id: 'hot', label: 'Hot', icon: '☀️' },
];

const ACTIVITY_OPTIONS: { id: ActivityLevel; label: string; desc: string }[] = [
  { id: 'sedentary', label: 'Low', desc: 'Office work' },
  { id: 'moderate', label: 'Medium', desc: 'Regular exercise' },
  { id: 'active', label: 'High', desc: 'Intense training' },
];

export default function WaterIntakeCalculatorScreen() {
  const { addToHistory } = useStorageStore();
  
  const [weight, setWeight] = useState('');
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [climate, setClimate] = useState('moderate');
  const [result, setResult] = useState<ReturnType<typeof calculateWaterIntake> | null>(null);

  const handleCalculate = () => {
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) return;

    const calcResult = calculateWaterIntake(weightNum, activity);
    setResult(calcResult);
    
    addToHistory({
      path: '/water-intake-calculator',
      name: 'Water Intake Calculator',
      result: `${(calcResult.dailyIntakeMl / 1000).toFixed(1)} L/day`,
      type: 'calculator',
    });
  };

  const handleReset = () => {
    setWeight('');
    setResult(null);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.bgPrimary} />
        
        <ToolHeader title="Water Intake" toolId="water-intake-calculator" onRefresh={handleReset} />

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView 
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Weight Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Your Weight</Text>
              <View style={styles.inputWrapper}>
                <User size={20} color={Colors.textTertiary} />
                <TextInput
                  style={styles.input}
                  placeholder="70"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="decimal-pad"
                  value={weight}
                  onChangeText={setWeight}
                />
                <Text style={styles.unit}>kg</Text>
              </View>
            </View>

            {/* Activity Level */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Activity Level</Text>
              <View style={styles.activityRow}>
                {ACTIVITY_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.activityCard,
                      activity === option.id && styles.activityCardActive,
                    ]}
                    onPress={() => setActivity(option.id)}
                  >
                    <Activity 
                      size={20} 
                      color={activity === option.id ? '#000' : Colors.textSecondary} 
                    />
                    <Text
                      style={[
                        styles.activityCardLabel,
                        activity === option.id && styles.activityCardLabelActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                    <Text style={styles.activityCardDesc}>{option.desc}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Climate */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Climate</Text>
              <View style={styles.climateRow}>
                {CLIMATE_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.climateButton,
                      climate === option.id && styles.climateButtonActive,
                    ]}
                    onPress={() => setClimate(option.id)}
                  >
                    <Text style={styles.climateIcon}>{option.icon}</Text>
                    <Text
                      style={[
                        styles.climateText,
                        climate === option.id && styles.climateTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Calculate Button */}
            <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
              <Droplets size={20} color="#000" />
              <Text style={styles.calculateButtonText}>Calculate Intake</Text>
            </TouchableOpacity>

            {/* Results */}
            {result && (
              <View style={styles.resultsCard}>
                {/* Main Result */}
                <View style={styles.mainResult}>
                  <View style={styles.waterDrop}>
                    <Droplets size={32} color={Colors.info} />
                  </View>
                  <Text style={styles.resultValue}>{(result.dailyIntakeMl / 1000).toFixed(1)}</Text>
                  <Text style={styles.resultUnit}>liters / day</Text>
                </View>

                <View style={styles.divider} />

                {/* Additional Stats */}
                <View style={styles.statsRow}>
                  <View style={styles.statCard}>
                    <Coffee size={18} color={Colors.textSecondary} />
                    <Text style={styles.statValue}>{result.glasses}</Text>
                    <Text style={styles.statLabel}>glasses</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Droplets size={18} color={Colors.info} />
                    <Text style={styles.statValue}>{result.dailyIntakeMl}</Text>
                    <Text style={styles.statLabel}>ml total</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Target size={18} color={Colors.success} />
                    <Text style={styles.statValue}>{result.dailyIntakeOz}</Text>
                    <Text style={styles.statLabel}>oz</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                {/* Tips */}
                <View style={styles.tipsSection}>
                  <Text style={styles.tipsTitle}>💡 Quick Tips</Text>
                  <View style={styles.tipItem}>
                    <Text style={styles.tipBullet}>•</Text>
                    <Text style={styles.tipText}>Drink a glass of water when you wake up</Text>
                  </View>
                  <View style={styles.tipItem}>
                    <Text style={styles.tipBullet}>•</Text>
                    <Text style={styles.tipText}>Keep a water bottle at your desk</Text>
                  </View>
                  <View style={styles.tipItem}>
                    <Text style={styles.tipBullet}>•</Text>
                    <Text style={styles.tipText}>Drink before you feel thirsty</Text>
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
  unit: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  activityRow: {
    flexDirection: 'row',
    gap: 10,
  },
  activityCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
    gap: 8,
  },
  activityCardActive: {
    backgroundColor: Colors.accentPrimary,
    borderColor: Colors.accentPrimary,
  },
  activityCardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  activityCardLabelActive: {
    color: '#000',
  },
  activityCardDesc: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  climateRow: {
    flexDirection: 'row',
    gap: 10,
  },
  climateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  climateButtonActive: {
    backgroundColor: Colors.accentPrimary,
    borderColor: Colors.accentPrimary,
  },
  climateIcon: {
    fontSize: 18,
  },
  climateText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  climateTextActive: {
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
  mainResult: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  waterDrop: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.infoBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  resultValue: {
    fontSize: 56,
    fontWeight: '800',
    color: Colors.info,
    letterSpacing: -2,
  },
  resultUnit: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderPrimary,
    marginVertical: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  tipsSection: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: 14,
    padding: 16,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  tipBullet: {
    color: Colors.info,
    fontSize: 14,
    fontWeight: '700',
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
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
