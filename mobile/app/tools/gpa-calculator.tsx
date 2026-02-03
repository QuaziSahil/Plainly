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
import { GraduationCap, Plus, Trash2, BookOpen, Award, TrendingUp } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { calculateGPA } from '@/services/calculations';
import { useStorageStore } from '@/stores/useStorageStore';
import ToolHeader from '@/components/ToolHeader';

type Course = {
  id: string;
  name: string;
  grade: string;
  credits: string;
};

const GRADE_OPTIONS = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];

export default function GPACalculatorScreen() {
  const { addToHistory } = useStorageStore();
  
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: '', grade: 'A', credits: '3' },
    { id: '2', name: '', grade: 'B+', credits: '3' },
  ]);
  const [showGradeSelector, setShowGradeSelector] = useState<string | null>(null);
  const [result, setResult] = useState<ReturnType<typeof calculateGPA> | null>(null);

  const addCourse = () => {
    setCourses([
      ...courses,
      { id: Date.now().toString(), name: '', grade: 'A', credits: '3' },
    ]);
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter((c) => c.id !== id));
    }
  };

  const updateCourse = (id: string, field: keyof Course, value: string) => {
    setCourses(
      courses.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleCalculate = () => {
    const validCourses = courses.filter((c) => c.credits && parseFloat(c.credits) > 0);
    if (validCourses.length === 0) return;

    const gradesData = validCourses.map((c) => ({
      grade: c.grade,
      credits: parseFloat(c.credits),
    }));

    const calcResult = calculateGPA(gradesData);
    setResult(calcResult);
    
    addToHistory({
      path: '/gpa-calculator',
      name: 'GPA Calculator',
      result: `${calcResult.gpa} GPA`,
      type: 'calculator',
    });
  };

  const handleReset = () => {
    setCourses([
      { id: '1', name: '', grade: 'A', credits: '3' },
      { id: '2', name: '', grade: 'B+', credits: '3' },
    ]);
    setResult(null);
  };

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.7) return Colors.success;
    if (gpa >= 3.0) return Colors.accentPrimary;
    if (gpa >= 2.0) return Colors.warning;
    return Colors.error;
  };

  const getGPALabel = (gpa: number) => {
    if (gpa >= 3.9) return 'Outstanding';
    if (gpa >= 3.7) return 'Excellent';
    if (gpa >= 3.5) return 'Very Good';
    if (gpa >= 3.0) return 'Good';
    if (gpa >= 2.5) return 'Satisfactory';
    if (gpa >= 2.0) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.bgPrimary} />
        
        <ToolHeader title="GPA Calculator" toolId="gpa-calculator" onRefresh={handleReset} />

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView 
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Courses */}
            <View style={styles.coursesSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.label}>Your Courses</Text>
                <TouchableOpacity style={styles.addButton} onPress={addCourse}>
                  <Plus size={18} color="#000" />
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>

              {courses.map((course, index) => (
                <View key={course.id} style={styles.courseCard}>
                  <View style={styles.courseHeader}>
                    <View style={styles.courseNumber}>
                      <BookOpen size={14} color={Colors.textSecondary} />
                      <Text style={styles.courseNumberText}>Course {index + 1}</Text>
                    </View>
                    {courses.length > 1 && (
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeCourse(course.id)}
                      >
                        <Trash2 size={16} color={Colors.error} />
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={styles.courseInputs}>
                    {/* Grade Selector */}
                    <View style={styles.gradeInput}>
                      <Text style={styles.inputLabel}>Grade</Text>
                      <TouchableOpacity
                        style={styles.gradeSelector}
                        onPress={() => setShowGradeSelector(showGradeSelector === course.id ? null : course.id)}
                      >
                        <Text style={styles.gradeSelectorText}>{course.grade}</Text>
                      </TouchableOpacity>
                      {showGradeSelector === course.id && (
                        <View style={styles.gradeDropdown}>
                          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.gradeOptions}>
                              {GRADE_OPTIONS.map((grade) => (
                                <TouchableOpacity
                                  key={grade}
                                  style={[
                                    styles.gradeOption,
                                    course.grade === grade && styles.gradeOptionActive,
                                  ]}
                                  onPress={() => {
                                    updateCourse(course.id, 'grade', grade);
                                    setShowGradeSelector(null);
                                  }}
                                >
                                  <Text
                                    style={[
                                      styles.gradeOptionText,
                                      course.grade === grade && styles.gradeOptionTextActive,
                                    ]}
                                  >
                                    {grade}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                            </View>
                          </ScrollView>
                        </View>
                      )}
                    </View>

                    {/* Credits Input */}
                    <View style={styles.creditsInput}>
                      <Text style={styles.inputLabel}>Credits</Text>
                      <TextInput
                        style={styles.creditField}
                        placeholder="3"
                        placeholderTextColor={Colors.textMuted}
                        keyboardType="number-pad"
                        value={course.credits}
                        onChangeText={(value) => updateCourse(course.id, 'credits', value)}
                      />
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Calculate Button */}
            <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
              <GraduationCap size={20} color="#000" />
              <Text style={styles.calculateButtonText}>Calculate GPA</Text>
            </TouchableOpacity>

            {/* Results */}
            {result && (
              <View style={styles.resultsCard}>
                {/* Main GPA */}
                <View style={styles.gpaMain}>
                  <Award size={32} color={getGPAColor(result.gpa)} />
                  <Text style={[styles.gpaValue, { color: getGPAColor(result.gpa) }]}>
                    {result.gpa}
                  </Text>
                  <Text style={styles.gpaLabel}>{getGPALabel(result.gpa)}</Text>
                </View>

                <View style={styles.divider} />

                {/* Stats */}
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{result.totalCredits}</Text>
                    <Text style={styles.statLabel}>Total Credits</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{result.totalPoints.toFixed(1)}</Text>
                    <Text style={styles.statLabel}>Grade Points</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{courses.length}</Text>
                    <Text style={styles.statLabel}>Courses</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                {/* GPA Scale */}
                <View style={styles.scaleSection}>
                  <Text style={styles.scaleTitle}>GPA Scale</Text>
                  <View style={styles.scaleBar}>
                    <View style={[styles.scaleFill, { width: `${(result.gpa / 4) * 100}%` }]}>
                      <View style={[styles.scaleIndicator, { backgroundColor: getGPAColor(result.gpa) }]} />
                    </View>
                  </View>
                  <View style={styles.scaleLabels}>
                    <Text style={styles.scaleLabel}>0.0</Text>
                    <Text style={styles.scaleLabel}>2.0</Text>
                    <Text style={styles.scaleLabel}>4.0</Text>
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
  coursesSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.accentPrimary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  courseCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  courseNumber: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  courseNumberText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  removeButton: {
    padding: 6,
  },
  courseInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  gradeInput: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginBottom: 8,
  },
  gradeSelector: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  gradeSelectorText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.accentPrimary,
  },
  gradeDropdown: {
    marginTop: 8,
  },
  gradeOptions: {
    flexDirection: 'row',
    gap: 6,
  },
  gradeOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.bgSecondary,
  },
  gradeOptionActive: {
    backgroundColor: Colors.accentPrimary,
  },
  gradeOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  gradeOptionTextActive: {
    color: '#000',
  },
  creditsInput: {
    width: 100,
  },
  creditField: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
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
  gpaMain: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  gpaValue: {
    fontSize: 64,
    fontWeight: '800',
    letterSpacing: -2,
    marginTop: 8,
  },
  gpaLabel: {
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
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: Colors.borderPrimary,
  },
  scaleSection: {
    marginTop: 4,
  },
  scaleTitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 12,
    fontWeight: '600',
  },
  scaleBar: {
    height: 10,
    backgroundColor: Colors.bgSecondary,
    borderRadius: 5,
    overflow: 'hidden',
  },
  scaleFill: {
    height: '100%',
    backgroundColor: 'rgba(168, 85, 247, 0.3)',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  scaleIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: -8,
    borderWidth: 2,
    borderColor: Colors.bgCard,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  scaleLabel: {
    fontSize: 11,
    color: Colors.textMuted,
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
