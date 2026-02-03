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
import { Copy, Check, FileText, Sparkles, RotateCcw } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '@/constants/Colors';
import { askGroq, OfflineError } from '@/services/groqAI';
import { useStorageStore } from '@/stores/useStorageStore';
import AIOutputFormatter from '@/components/AIOutputFormatter';
import ToolHeader from '@/components/ToolHeader';

const STYLES = [
  { id: 'concise', label: 'Concise', desc: '2-3 sentences' },
  { id: 'detailed', label: 'Detailed', desc: 'All key points' },
  { id: 'bullets', label: 'Bullet Points', desc: 'Easy to scan' },
];

export default function AITextSummarizerScreen() {
  const insets = useSafeAreaInsets();
  const { addToHistory } = useStorageStore();
  const scrollRef = useRef<ScrollView>(null);

  const [inputText, setInputText] = useState('');
  const [style, setStyle] = useState('concise');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const summarizeText = async () => {
    if (!inputText.trim()) {
      setError('Please enter text to summarize');
      return;
    }

    if (inputText.trim().length < 50) {
      setError('Please enter at least 50 characters to summarize');
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      const styleInstructions: { [key: string]: string } = {
        concise: 'Provide a brief 2-3 sentence summary.',
        detailed: 'Provide a comprehensive summary covering all key points.',
        bullets: 'Provide a summary as bullet points.',
      };

      const prompt = `Summarize the following text:

"${inputText}"

${styleInstructions[style]}`;

      const systemPrompt = 'You are an expert summarizer. Be accurate and capture the essence of the text.';

      const response = await askGroq(prompt, systemPrompt, {
        temperature: 0.3,
        maxTokens: 500,
      });

      setResult(response);

      addToHistory({
        path: '/ai-text-summarizer',
        name: 'AI Text Summarizer',
        result: 'Text summarized',
        type: 'ai',
      });

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err: any) {
      if (err instanceof OfflineError || err.name === 'OfflineError') {
        setError('No internet connection. Please check your network and try again.');
      } else {
        setError('Failed to summarize text. Please try again.');
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
    setStyle('concise');
    setResult('');
    setError('');
  };

  const wordCount = inputText.trim().split(/\s+/).filter(Boolean).length;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ToolHeader title="AI Text Summarizer" toolId="ai-summarizer" onRefresh={handleReset} />

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
              <View style={styles.labelRow}>
                <Text style={styles.label}>Text to Summarize *</Text>
                <Text style={styles.wordCount}>{wordCount} words</Text>
              </View>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Paste your article, essay, document, or any text here..."
                placeholderTextColor={Colors.textMuted}
                value={inputText}
                onChangeText={setInputText}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
              />
            </View>

            {/* Style Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Summary Style</Text>
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
              onPress={summarizeText}
              disabled={!inputText.trim() || loading}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <>
                  <Sparkles size={20} color="#000" />
                  <Text style={styles.generateButtonText}>Summarize Text</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Result */}
            {result ? (
              <View style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle}>Summary</Text>
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
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  wordCount: {
    fontSize: 12,
    color: Colors.textTertiary,
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
    minHeight: 180,
    paddingTop: 14,
  },
  styleOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  styleCard: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
    alignItems: 'center',
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
    fontSize: 11,
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
});
