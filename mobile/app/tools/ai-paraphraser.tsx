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
import { RefreshCw, Copy, Check, RotateCcw, Sparkles } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '@/constants/Colors';
import { askGroq, OfflineError } from '@/services/groqAI';
import { useStorageStore } from '@/stores/useStorageStore';
import AIOutputFormatter from '@/components/AIOutputFormatter';
import ToolHeader from '@/components/ToolHeader';

const STYLES = [
  { id: 'professional', label: 'Professional', desc: 'Formal tone' },
  { id: 'casual', label: 'Casual', desc: 'Friendly tone' },
  { id: 'academic', label: 'Academic', desc: 'Scholarly' },
  { id: 'simple', label: 'Simple', desc: 'Easy to read' },
];

export default function AIParaphraserScreen() {
  const insets = useSafeAreaInsets();
  const { addToHistory } = useStorageStore();
  const scrollRef = useRef<ScrollView>(null);

  const [inputText, setInputText] = useState('');
  const [style, setStyle] = useState('professional');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const paraphraseText = async () => {
    if (!inputText.trim()) {
      setError('Please enter text to paraphrase');
      return;
    }

    if (inputText.trim().length < 20) {
      setError('Please enter at least 20 characters');
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      const prompt = `Improve and rewrite the following text to make it more ${style}:

"${inputText}"

Keep the same meaning but improve clarity, grammar, and flow. Make it sound ${style}.`;

      const systemPrompt = 'You are an expert editor. Improve text while maintaining its original meaning. Return only the improved text without any explanations.';

      const response = await askGroq(prompt, systemPrompt, {
        temperature: 0.5,
        maxTokens: 1000,
      });

      setResult(response);

      addToHistory({
        path: '/ai-paraphraser',
        name: 'AI Paraphraser',
        result: 'Text paraphrased',
        type: 'ai',
      });

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err: any) {
      if (err instanceof OfflineError || err.name === 'OfflineError') {
        setError('No internet connection. Please check your network and try again.');
      } else {
        setError('Failed to paraphrase. Please try again.');
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
    setInputText('');
    setStyle('professional');
    setResult('');
    setError('');
  };

  const handleUseResult = () => {
    setInputText(result);
    setResult('');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ToolHeader title="AI Paraphraser" toolId="ai-paraphraser" onRefresh={handleReset} />

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

            {/* Input Text */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Text to Paraphrase *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter or paste text to rewrite and improve..."
                placeholderTextColor={Colors.textMuted}
                value={inputText}
                onChangeText={setInputText}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            {/* Style Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Writing Style</Text>
              <View style={styles.styleOptions}>
                {STYLES.map((s) => (
                  <TouchableOpacity
                    key={s.id}
                    style={[styles.styleCard, style === s.id && styles.styleCardActive]}
                    onPress={() => setStyle(s.id)}
                  >
                    <Text style={[styles.styleLabel, style === s.id && styles.styleLabelActive]}>
                      {s.label}
                    </Text>
                    <Text style={[styles.styleDesc, style === s.id && styles.styleDescActive]}>
                      {s.desc}
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
              style={[styles.generateButton, (!inputText.trim() || loading) && styles.generateButtonDisabled]}
              onPress={paraphraseText}
              disabled={!inputText.trim() || loading}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <>
                  <RefreshCw size={20} color="#000" />
                  <Text style={styles.generateButtonText}>Paraphrase</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Result */}
            {result ? (
              <View style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle}>Paraphrased Text</Text>
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
                
                <TouchableOpacity style={styles.useResultButton} onPress={handleUseResult}>
                  <RefreshCw size={16} color={Colors.accentPrimary} />
                  <Text style={styles.useResultText}>Paraphrase Again</Text>
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
    minHeight: 150,
    paddingTop: 14,
  },
  styleOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  styleCard: {
    width: '48%',
    padding: 14,
    borderRadius: 12,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  styleCardActive: {
    backgroundColor: Colors.accentGlow,
    borderColor: Colors.accentPrimary,
  },
  styleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  styleLabelActive: {
    color: Colors.accentPrimary,
  },
  styleDesc: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  styleDescActive: {
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
  useResultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.bgElevated,
  },
  useResultText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.accentPrimary,
  },
});
