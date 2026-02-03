import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Stack } from 'expo-router';
import { Calendar, Gift, Clock, Cake } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { calculateAge } from '@/services/calculations';
import { useStorageStore } from '@/stores/useStorageStore';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import ToolHeader from '@/components/ToolHeader';

export default function AgeCalculatorScreen() {
  const { addToHistory } = useStorageStore();
  
  const [birthDate, setBirthDate] = useState(new Date(2000, 0, 1));
  const [showPicker, setShowPicker] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof calculateAge> | null>(null);

  const handleReset = () => {
    setBirthDate(new Date(2000, 0, 1));
    setShowPicker(false);
    setResult(null);
  };

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowPicker(false);
    if (date) {
      setBirthDate(date);
    }
  };

  const handleCalculate = () => {
    const calcResult = calculateAge(birthDate);
    setResult(calcResult);
    
    addToHistory({
      path: '/age-calculator',
      name: 'Age Calculator',
      result: `${calcResult.years} years old`,
      type: 'calculator',
    });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.bgPrimary} />
        
        <ToolHeader title="Age Calculator" toolId="age" onRefresh={handleReset} />

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Date Picker */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowPicker(true)}
            >
              <Calendar size={22} color={Colors.accentPrimary} />
              <Text style={styles.dateButtonText}>{formatDate(birthDate)}</Text>
            </TouchableOpacity>
          </View>

          {showPicker && (
            <DateTimePicker
              value={birthDate}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
              maximumDate={new Date()}
              minimumDate={new Date(1900, 0, 1)}
              textColor={Colors.textPrimary}
            />
          )}

          {/* Calculate Button */}
          <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
            <Cake size={20} color="#000" />
            <Text style={styles.calculateButtonText}>Calculate Age</Text>
          </TouchableOpacity>

          {/* Results */}
          {result && (
            <View style={styles.resultsCard}>
              {/* Main Age Display */}
              <View style={styles.mainAge}>
                <Text style={styles.ageNumber}>{result.years}</Text>
                <Text style={styles.ageLabel}>years old</Text>
              </View>

              <View style={styles.ageDetails}>
                <View style={styles.ageDetailItem}>
                  <Text style={styles.ageDetailValue}>{result.months}</Text>
                  <Text style={styles.ageDetailLabel}>months</Text>
                </View>
                <View style={styles.ageDetailDivider} />
                <View style={styles.ageDetailItem}>
                  <Text style={styles.ageDetailValue}>{result.days}</Text>
                  <Text style={styles.ageDetailLabel}>days</Text>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Stats */}
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Clock size={20} color={Colors.accentPrimary} />
                  <Text style={styles.statValue}>{result.totalDays.toLocaleString()}</Text>
                  <Text style={styles.statLabel}>Total Days</Text>
                </View>
                <View style={styles.statCard}>
                  <Calendar size={20} color={Colors.info} />
                  <Text style={styles.statValue}>{result.totalWeeks.toLocaleString()}</Text>
                  <Text style={styles.statLabel}>Total Weeks</Text>
                </View>
                <View style={styles.statCard}>
                  <Calendar size={20} color={Colors.success} />
                  <Text style={styles.statValue}>{result.totalMonths}</Text>
                  <Text style={styles.statLabel}>Total Months</Text>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Next Birthday */}
              <View style={styles.birthdayCard}>
                <Gift size={24} color={Colors.warning} />
                <View style={styles.birthdayInfo}>
                  <Text style={styles.birthdayTitle}>Next Birthday</Text>
                  <Text style={styles.birthdayDate}>
                    {formatDate(result.nextBirthday)}
                  </Text>
                  <Text style={styles.birthdayCountdown}>
                    🎂 {result.daysUntilBirthday} days to go!
                  </Text>
                </View>
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
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    paddingHorizontal: 20,
    height: 64,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  dateButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
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
  mainAge: {
    alignItems: 'center',
    marginBottom: 16,
  },
  ageNumber: {
    fontSize: 72,
    fontWeight: '800',
    color: Colors.accentPrimary,
    lineHeight: 80,
  },
  ageLabel: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginTop: -4,
  },
  ageDetails: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  ageDetailItem: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  ageDetailDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.borderPrimary,
  },
  ageDetailValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  ageDetailLabel: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderPrimary,
    marginVertical: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.bgElevated,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textTertiary,
  },
  birthdayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: Colors.warningBg,
    borderRadius: 14,
    padding: 16,
  },
  birthdayInfo: {
    flex: 1,
  },
  birthdayTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.warning,
    marginBottom: 4,
  },
  birthdayDate: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  birthdayCountdown: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
});
