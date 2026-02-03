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
import { FileText, Copy, Check, Sparkles, RefreshCw } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '@/constants/Colors';
import { askGroq, OfflineError } from '@/services/groqAI';
import { useStorageStore } from '@/stores/useStorageStore';
import ToolHeader from '@/components/ToolHeader';
import AIOutputFormatter from '@/components/AIOutputFormatter';

const COVER_LETTER_TONES = [
  { id: 'professional', label: '💼 Professional' },
  { id: 'enthusiastic', label: '🔥 Enthusiastic' },
  { id: 'confident', label: '💪 Confident' },
  { id: 'creative', label: '🎨 Creative' },
];

export default function AICoverLetterScreen() {
  const insets = useSafeAreaInsets();
  const { addToHistory } = useStorageStore();
  const scrollRef = useRef<ScrollView>(null);

  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [tone, setTone] = useState('professional');
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const generateCoverLetter = async () => {
    if (!jobTitle.trim()) {
      setError('Please enter the job title');
      return;
    }

    setLoading(true);
    setError('');
    setCoverLetter('');

    try {
      const selectedTone = COVER_LETTER_TONES.find(t => t.id === tone)?.label.split(' ')[1] || 'professional';
      const companyPart = company.trim() ? ` at ${company}` : '';
      const skillsPart = skills.trim() ? `\nRelevant skills: ${skills}` : '';
      const expPart = experience.trim() ? `\nExperience highlights: ${experience}` : '';

      const prompt = `Write a ${selectedTone} cover letter for a ${jobTitle} position${companyPart}.${skillsPart}${expPart}

Requirements:
- Professional greeting (use "Dear Hiring Manager" if no specific name)
- Strong opening hook that shows enthusiasm
- 2-3 paragraphs highlighting relevant qualifications
- Show knowledge of the company/industry
- Include specific achievements where possible
- Strong closing with call-to-action
- Professional sign-off
- 250-350 words

Make it compelling and tailored to the position.`;

      const systemPrompt = 'You are an expert career coach who writes compelling cover letters that get interviews. Create personalized, impactful cover letters.';

      const response = await askGroq(prompt, systemPrompt, {
        temperature: 0.7,
        maxTokens: 800,
      });

      setCoverLetter(response.trim());

      addToHistory({
        path: '/ai-cover-letter-generator',
        name: 'AI Cover Letter',
        result: `Cover letter for ${jobTitle}`,
        type: 'ai',
      });

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err: any) {
      if (err instanceof OfflineError || err.name === 'OfflineError') {
        setError('No internet connection. Please check your network.');
      } else {
        setError('Failed to generate cover letter. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setJobTitle('');
    setCompany('');
    setSkills('');
    setExperience('');
    setTone('professional');
    setCoverLetter('');
    setError('');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ToolHeader title="AI Cover Letter" toolId="ai-cover-letter-generator" onRefresh={handleReset} />

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
              <Text style={styles.label}>Job Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Software Engineer, Marketing Manager..."
                placeholderTextColor={Colors.textMuted}
                value={jobTitle}
                onChangeText={setJobTitle}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Company Name (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Google, Microsoft, Startup Inc..."
                placeholderTextColor={Colors.textMuted}
                value={company}
                onChangeText={setCompany}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Your Key Skills (Optional)</Text>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                placeholder="e.g., Python, React, Leadership, Data Analysis..."
                placeholderTextColor={Colors.textMuted}
                value={skills}
                onChangeText={setSkills}
                multiline
                numberOfLines={2}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Experience Highlights (Optional)</Text>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                placeholder="e.g., 5 years in tech, Led team of 10, Increased sales 50%..."
                placeholderTextColor={Colors.textMuted}
                value={experience}
                onChangeText={setExperience}
                multiline
                numberOfLines={2}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tone</Text>
              <View style={styles.toneRow}>
                {COVER_LETTER_TONES.map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    style={[styles.toneChip, tone === t.id && styles.toneChipActive]}
                    onPress={() => setTone(t.id)}
                  >
                    <Text style={[styles.toneText, tone === t.id && styles.toneTextActive]}>
                      {t.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.generateButton, loading && styles.generateButtonDisabled]}
              onPress={generateCoverLetter}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <FileText size={20} color="#fff" />
                  <Text style={styles.generateButtonText}>Generate Cover Letter</Text>
                </>
              )}
            </TouchableOpacity>

            {coverLetter ? (
              <View style={styles.resultContainer}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle}>Your Cover Letter</Text>
                  <View style={styles.resultActions}>
                    <TouchableOpacity onPress={generateCoverLetter} style={styles.actionButton}>
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
                <View style={styles.letterContent}>
                  <AIOutputFormatter text={coverLetter} />
                </View>
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
  toneRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  toneChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  toneChipActive: {
    backgroundColor: Colors.accentPrimary,
    borderColor: Colors.accentPrimary,
  },
  toneText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  toneTextActive: {
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
  letterContent: {
    backgroundColor: Colors.bgPrimary,
    borderRadius: 10,
    padding: 16,
  },
});
