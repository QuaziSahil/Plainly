import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { User, Copy, Check, Sparkles, RefreshCw } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '@/constants/Colors';
import { askGroq, OfflineError } from '@/services/groqAI';
import { useStorageStore } from '@/stores/useStorageStore';
import ToolHeader from '@/components/ToolHeader';
import AIOutputFormatter from '@/components/AIOutputFormatter';

const EXPERIENCE_LEVELS = [
  { id: 'entry', label: 'Entry Level' },
  { id: 'mid', label: 'Mid Level' },
  { id: 'senior', label: 'Senior' },
  { id: 'executive', label: 'Executive' },
];

export default function AIResumeSummaryScreen() {
  const insets = useSafeAreaInsets();
  const { addToHistory } = useStorageStore();
  const scrollRef = useRef<ScrollView>(null);

  const [jobTitle, setJobTitle] = useState('');
  const [skills, setSkills] = useState('');
  const [achievements, setAchievements] = useState('');
  const [level, setLevel] = useState('mid');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const generateSummary = async () => {
    if (!jobTitle.trim()) {
      setError('Please enter your job title or target role');
      return;
    }

    setLoading(true);
    setError('');
    setSummary('');

    try {
      const selectedLevel = EXPERIENCE_LEVELS.find(l => l.id === level)?.label || 'mid level';
      const skillsPart = skills.trim() ? `\nKey skills: ${skills}` : '';
      const achievementsPart = achievements.trim() ? `\nKey achievements: ${achievements}` : '';

      const prompt = `Write a professional resume summary/objective for a ${selectedLevel} ${jobTitle}.${skillsPart}${achievementsPart}

Requirements:
- ${level === 'entry' ? '2-3 sentences focusing on education, skills, and career goals' : '3-4 sentences highlighting experience and achievements'}
- Start with a strong descriptor (e.g., "Results-driven", "Dynamic", "Accomplished")
- Include years of experience (estimate based on level)
- Mention key skills naturally
- Include measurable achievements if provided
- End with what you bring to the role
- Professional and impactful tone
- 50-100 words

Write only the summary, no labels or explanations.`;

      const systemPrompt = 'You are an expert resume writer and career coach. Write compelling resume summaries that get noticed by recruiters and ATS systems.';

      const response = await askGroq(prompt, systemPrompt, {
        temperature: 0.7,
        maxTokens: 300,
      });

      setSummary(response.trim());

      addToHistory({
        path: '/ai-resume-summary-generator',
        name: 'AI Resume Summary',
        result: `Summary for ${jobTitle}`,
        type: 'ai',
      });

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err: any) {
      if (err instanceof OfflineError || err.name === 'OfflineError') {
        setError('No internet connection. Please check your network.');
      } else {
        setError('Failed to generate summary. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setJobTitle('');
    setSkills('');
    setAchievements('');
    setLevel('mid');
    setSummary('');
    setError('');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ToolHeader title="AI Resume Summary" toolId="ai-resume-summary-generator" onRefresh={handleReset} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            ref={scrollRef}
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.aiBadge}>
              <Sparkles size={14} color={Colors.accentPrimary} />
              <Text style={styles.aiBadgeText}>Powered by AI</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Job Title / Target Role *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Software Developer, Project Manager..."
                placeholderTextColor={Colors.textMuted}
                value={jobTitle}
                onChangeText={setJobTitle}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Experience Level</Text>
              <View style={styles.levelRow}>
                {EXPERIENCE_LEVELS.map((l) => (
                  <TouchableOpacity
                    key={l.id}
                    style={[styles.levelChip, level === l.id && styles.levelChipActive]}
                    onPress={() => setLevel(l.id)}
                  >
                    <Text style={[styles.levelText, level === l.id && styles.levelTextActive]}>
                      {l.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Key Skills (Optional)</Text>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                placeholder="e.g., JavaScript, Team Leadership, Data Analysis..."
                placeholderTextColor={Colors.textMuted}
                value={skills}
                onChangeText={setSkills}
                multiline
                numberOfLines={2}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Key Achievements (Optional)</Text>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                placeholder="e.g., Increased revenue 30%, Led team of 15, Launched 5 products..."
                placeholderTextColor={Colors.textMuted}
                value={achievements}
                onChangeText={setAchievements}
                multiline
                numberOfLines={2}
                textAlignVertical="top"
              />
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.generateButton, loading && styles.generateButtonDisabled]}
              onPress={generateSummary}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <User size={20} color="#fff" />
                  <Text style={styles.generateButtonText}>Generate Summary</Text>
                </>
              )}
            </TouchableOpacity>

            {summary ? (
              <View style={styles.resultContainer}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle}>Your Resume Summary</Text>
                  <View style={styles.resultActions}>
                    <TouchableOpacity onPress={generateSummary} style={styles.actionButton}>
                      <RefreshCw size={18} color={Colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleCopy} style={styles.actionButton}>
                      {copied ? (
                        <Check size={18} color={Colors.success} />
                      ) : (
                        <Copy size={18} color={Colors.textSecondary} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.summaryContent}>
                  <AIOutputFormatter text={summary} />
                </View>
                <Text style={styles.tipText}>
                  💡 Tip: Customize this summary for each job application
                </Text>
              </View>
            ) : null}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.accentPrimary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
    gap: 6,
  },
  aiBadgeText: {
    color: Colors.accentPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  inputMultiline: {
    minHeight: 80,
    paddingTop: 14,
  },
  levelRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  levelChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  levelChipActive: {
    backgroundColor: Colors.accentPrimary,
    borderColor: Colors.accentPrimary,
  },
  levelText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  levelTextActive: {
    color: '#fff',
  },
  errorContainer: {
    backgroundColor: Colors.error + '20',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
  },
  generateButton: {
    backgroundColor: Colors.accentPrimary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 20,
  },
  generateButtonDisabled: {
    opacity: 0.7,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  resultActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  summaryContent: {
    backgroundColor: Colors.bgPrimary,
    borderRadius: 10,
    padding: 16,
  },
  tipText: {
    marginTop: 12,
    fontSize: 12,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
});
