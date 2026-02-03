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
import { Flame, User, Dumbbell, Activity, Moon, Zap, Target } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { calculateCalories } from '@/services/calculations';
import { useStorageStore } from '@/stores/useStorageStore';
import ToolHeader from '@/components/ToolHeader';

type Gender = 'male' | 'female';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';

const ACTIVITY_LEVELS: { id: ActivityLevel; label: string; desc: string; icon: any }[] = [
  { id: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise', icon: Moon },
  { id: 'light', label: 'Lightly Active', desc: '1-3 days/week', icon: Activity },
  { id: 'moderate', label: 'Moderately Active', desc: '3-5 days/week', icon: Dumbbell },
  { id: 'active', label: 'Very Active', desc: '6-7 days/week', icon: Zap },
  { id: 'very-active', label: 'Extra Active', desc: 'Athlete level', icon: Target },
];

export default function CalorieCalculatorScreen() {
  const { addToHistory } = useStorageStore();
  
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [result, setResult] = useState<ReturnType<typeof calculateCalories> | null>(null);

  const handleCalculate = () => {
    const ageNum = parseFloat(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    if (isNaN(ageNum) || isNaN(weightNum) || isNaN(heightNum)) return;

    const calcResult = calculateCalories(weightNum, heightNum, ageNum, gender, activityLevel);
    setResult(calcResult);
    
    addToHistory({
      path: '/calorie-calculator',
      name: 'Calorie Calculator',
      result: `${calcResult.goals.maintain} kcal/day`,
      type: 'calculator',
    });
  };

  const handleReset = () => {
    setAge('');
    setWeight('');
    setHeight('');
    setResult(null);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.bgPrimary} />
        
        <ToolHeader title="Calorie Calculator" toolId="calorie" onRefresh={handleReset} />

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView 
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Gender Toggle */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.genderRow}>
                <TouchableOpacity
                  style={[styles.genderButton, gender === 'male' && styles.genderButtonActive]}
                  onPress={() => setGender('male')}
                >
                  <User size={20} color={gender === 'male' ? '#000' : Colors.textSecondary} />
                  <Text style={[styles.genderText, gender === 'male' && styles.genderTextActive]}>
                    Male
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.genderButton, gender === 'female' && styles.genderButtonActive]}
                  onPress={() => setGender('female')}
                >
                  <User size={20} color={gender === 'female' ? '#000' : Colors.textSecondary} />
                  <Text style={[styles.genderText, gender === 'female' && styles.genderTextActive]}>
                    Female
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Age, Weight, Height */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Age</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="25"
                    placeholderTextColor={Colors.textMuted}
                    keyboardType="number-pad"
                    value={age}
                    onChangeText={setAge}
                  />
                  <Text style={styles.unit}>yrs</Text>
                </View>
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Weight</Text>
                <View style={styles.inputWrapper}>
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
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Height</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="175"
                    placeholderTextColor={Colors.textMuted}
                    keyboardType="number-pad"
                    value={height}
                    onChangeText={setHeight}
                  />
                  <Text style={styles.unit}>cm</Text>
                </View>
              </View>
            </View>

            {/* Activity Level */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Activity Level</Text>
              <View style={styles.activityList}>
                {ACTIVITY_LEVELS.map((level) => {
                  const IconComponent = level.icon;
                  const isActive = activityLevel === level.id;
                  return (
                    <TouchableOpacity
                      key={level.id}
                      style={[styles.activityItem, isActive && styles.activityItemActive]}
                      onPress={() => setActivityLevel(level.id)}
                    >
                      <View style={[styles.activityIcon, isActive && styles.activityIconActive]}>
                        <IconComponent size={18} color={isActive ? '#000' : Colors.textSecondary} />
                      </View>
                      <View style={styles.activityInfo}>
                        <Text style={[styles.activityLabel, isActive && styles.activityLabelActive]}>
                          {level.label}
                        </Text>
                        <Text style={styles.activityDesc}>{level.desc}</Text>
                      </View>
                      <View style={[styles.radio, isActive && styles.radioActive]}>
                        {isActive && <View style={styles.radioDot} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Calculate Button */}
            <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
              <Flame size={20} color="#000" />
              <Text style={styles.calculateButtonText}>Calculate Calories</Text>
            </TouchableOpacity>

            {/* Results */}
            {result && (
              <View style={styles.resultsCard}>
                {/* BMR */}
                <View style={styles.bmrSection}>
                  <Text style={styles.bmrLabel}>Basal Metabolic Rate (BMR)</Text>
                  <Text style={styles.bmrValue}>{result.bmr} <Text style={styles.bmrUnit}>kcal/day</Text></Text>
                  <Text style={styles.bmrHint}>Calories your body needs at rest</Text>
                </View>

                <View style={styles.divider} />

                {/* Calorie Goals */}
                <Text style={styles.goalsTitle}>Daily Calorie Goals</Text>
                <View style={styles.goalsGrid}>
                  <View style={[styles.goalCard, { backgroundColor: Colors.successBg }]}>
                    <Text style={styles.goalLabel}>Lose Weight</Text>
                    <Text style={[styles.goalValue, { color: Colors.success }]}>
                      {result.goals.lose}
                    </Text>
                    <Text style={styles.goalUnit}>kcal/day</Text>
                  </View>
                  <View style={[styles.goalCard, { backgroundColor: 'rgba(168, 85, 247, 0.12)' }]}>
                    <Text style={styles.goalLabel}>Maintain</Text>
                    <Text style={[styles.goalValue, { color: Colors.accentPrimary }]}>
                      {result.goals.maintain}
                    </Text>
                    <Text style={styles.goalUnit}>kcal/day</Text>
                  </View>
                  <View style={[styles.goalCard, { backgroundColor: Colors.infoBg }]}>
                    <Text style={styles.goalLabel}>Gain Weight</Text>
                    <Text style={[styles.goalValue, { color: Colors.info }]}>
                      {result.goals.gain}
                    </Text>
                    <Text style={styles.goalUnit}>kcal/day</Text>
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
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
    marginLeft: 6,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
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
  genderButtonActive: {
    backgroundColor: Colors.accentPrimary,
    borderColor: Colors.accentPrimary,
  },
  genderText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  genderTextActive: {
    color: '#000',
  },
  activityList: {
    gap: 10,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
    gap: 12,
  },
  activityItemActive: {
    borderColor: Colors.accentPrimary,
    backgroundColor: 'rgba(168, 85, 247, 0.08)',
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIconActive: {
    backgroundColor: Colors.accentPrimary,
  },
  activityInfo: {
    flex: 1,
  },
  activityLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  activityLabelActive: {
    color: Colors.accentPrimary,
  },
  activityDesc: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.borderSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: Colors.accentPrimary,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.accentPrimary,
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
  bmrSection: {
    alignItems: 'center',
  },
  bmrLabel: {
    fontSize: 13,
    color: Colors.textTertiary,
    marginBottom: 6,
  },
  bmrValue: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  bmrUnit: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  bmrHint: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 6,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderPrimary,
    marginVertical: 20,
  },
  goalsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 14,
    textAlign: 'center',
  },
  goalsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  goalCard: {
    flex: 1,
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
  },
  goalLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 6,
    textAlign: 'center',
  },
  goalValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  goalUnit: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
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
