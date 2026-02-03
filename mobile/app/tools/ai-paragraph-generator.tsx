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
import { Sparkles, Copy, Check, RotateCcw } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '@/constants/Colors';
import { askGroq, OfflineError } from '@/services/groqAI';
import { useStorageStore } from '@/stores/useStorageStore';
import AIOutputFormatter from '@/components/AIOutputFormatter';
import ToolHeader from '@/components/ToolHeader';

const TONES = [
  { id: 'professional', label: 'Professional' },
  { id: 'casual', label: 'Casual' },
  { id: 'academic', label: 'Academic' },
  { id: 'creative', label: 'Creative' },
  { id: 'persuasive', label: 'Persuasive' },
];

const LENGTHS = [
  { id: 'short', label: 'Short', words: '50-75' },
  { id: 'medium', label: 'Medium', words: '100-150' },
  { id: 'long', label: 'Long', words: '200-300' },
];

export default function AIParagraphGeneratorScreen() {
  const insets = useSafeAreaInsets();
  const { addToHistory } = useStorageStore();
  const scrollRef = useRef<ScrollView>(null);

  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const generateParagraph = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      const lengthGuide: { [key: string]: string } = {
        short: '50-75 words',
        medium: '100-150 words',
        long: '200-300 words',
      };

      const prompt = `Write a ${tone} paragraph about: "${topic}"

Length: approximately ${lengthGuide[length]}.
Make it engaging, informative, and well-written.`;

      const systemPrompt = `You are an expert content writer. Write in a ${tone} tone. Return only the paragraph without any explanations or metadata.`;

      const response = await askGroq(prompt, systemPrompt, {
        temperature: 0.7,
        maxTokens: 500,
      });

      setResult(response);

      addToHistory({
        path: '/ai-paragraph-generator',
        name: 'AI Paragraph Generator',
        result: 'Paragraph generated',
        type: 'ai',
      });

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err: any) {
      if (err instanceof OfflineError || err.name === 'OfflineError') {
        setError('No internet connection. Please check your network and try again.');
      } else {
        setError('Failed to generate. Please try again.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setTopic('');
    setTone('professional');
    setLength('medium');
    setResult('');
    setError('');
  };

  const handleRegenerate = () => {
    generateParagraph();
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ToolHeader title="AI Paragraph Generator" toolId="ai-paragraph" onRefresh={handleReset} />

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
            {/* AI Badge */}
            <View style={styles.aiBadge}>
              <Sparkles size={14} color={Colors.accentPrimary} />
              <Text style={styles.aiBadgeText}>Powered by AI</Text>
            </View>

            {/* Topic Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Topic *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="e.g., Benefits of remote work, Climate change solutions, AI in healthcare..."
                placeholderTextColor={Colors.textMuted}
                value={topic}
                onChangeText={setTopic}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Tone Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tone</Text>
              <View style={styles.optionsRow}>
                {TONES.map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    style={[styles.optionButton, tone === t.id && styles.optionButtonActive]}
                    onPress={() => setTone(t.id)}
                  >
                    <Text style={[styles.optionText, tone === t.id && styles.optionTextActive]}>
                      {t.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Length Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Length</Text>
              <View style={styles.lengthOptions}>
                {LENGTHS.map((l) => (
                  <TouchableOpacity
                    key={l.id}
                    style={[styles.lengthCard, length === l.id && styles.lengthCardActive]}
                    onPress={() => setLength(l.id)}
                  >
                    <Text style={[styles.lengthLabel, length === l.id && styles.lengthLabelActive]}>
                      {l.label}
                    </Text>
                    <Text style={[styles.lengthWords, length === l.id && styles.lengthWordsActive]}>
                      ~{l.words} words
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Error */}
            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Generate Button */}
            <TouchableOpacity
              style={[styles.generateButton, (!topic.trim() || loading) && styles.generateButtonDisabled]}
              onPress={generateParagraph}
              disabled={!topic.trim() || loading}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <>
                  <Sparkles size={20} color="#000" />
                  <Text style={styles.generateButtonText}>Generate Paragraph</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Result */}
            {result ? (
              <View style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle}>Generated Paragraph</Text>
                  <View style={styles.resultActions}>
                    <TouchableOpacity style={styles.actionButton} onPress={handleCopy}>
                      {copied ? (
                        <Check size={18} color={Colors.success} />
                      ) : (
                        <Copy size={18} color={Colors.textSecondary} />
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={handleReset}>
                      <RotateCcw size={18} color={Colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                </View>
                <AIOutputFormatter text={result} />

                <TouchableOpacity style={styles.regenerateButton} onPress={handleRegenerate}>
                  <Sparkles size={16} color={Colors.accentPrimary} />
                  <Text style={styles.regenerateText}>Generate Another</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            <View style={{ height: 100 }} />
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
    padding: 20,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.accentGlow,
    borderRadius: 20,
    marginBottom: 20,
  },
  aiBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.accentPrimary,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  optionButtonActive: {
    backgroundColor: Colors.accentGlow,
    borderColor: Colors.accentPrimary,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  optionTextActive: {
    color: Colors.accentPrimary,
  },
  lengthOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  lengthCard: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
    alignItems: 'center',
  },
  lengthCardActive: {
    backgroundColor: Colors.accentGlow,
    borderColor: Colors.accentPrimary,
  },
  lengthLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  lengthLabelActive: {
    color: Colors.accentPrimary,
  },
  lengthWords: {
    fontSize: 11,
    color: Colors.textTertiary,
  },
  lengthWordsActive: {
    color: Colors.textSecondary,
  },
  errorBox: {
    padding: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    color: Colors.error,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.accentPrimary,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
  },
  generateButtonDisabled: {
    backgroundColor: Colors.bgCard,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  resultCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    borderWidth: 1,
    borderColor: Colors.accentPrimary,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultText: {
    fontSize: 15,
    lineHeight: 24,
    color: Colors.textSecondary,
  },
  regenerateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.bgElevated,
  },
  regenerateText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.accentPrimary,
  },
});
