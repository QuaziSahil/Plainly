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
import { CheckCircle, Copy, Check, Sparkles } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '@/constants/Colors';
import { askGroq, OfflineError } from '@/services/groqAI';
import { useStorageStore } from '@/stores/useStorageStore';
import AIOutputFormatter from '@/components/AIOutputFormatter';
import ToolHeader from '@/components/ToolHeader';

export default function AIGrammarCheckerScreen() {
  const insets = useSafeAreaInsets();
  const { addToHistory } = useStorageStore();
  const scrollRef = useRef<ScrollView>(null);

  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const checkGrammar = async () => {
    if (!inputText.trim()) {
      setError('Please enter text to check');
      return;
    }

    if (inputText.trim().length < 10) {
      setError('Please enter at least 10 characters');
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      const prompt = `Check and correct the grammar, spelling, and punctuation in the following text. Also improve clarity while maintaining the original meaning:

"${inputText}"

Provide the corrected text first, then list the changes made.`;

      const systemPrompt = 'You are an expert editor and proofreader. Correct all grammar, spelling, and punctuation errors. Format your response with the corrected text first, then a brief list of changes made.';

      const response = await askGroq(prompt, systemPrompt, {
        temperature: 0.3,
        maxTokens: 1500,
      });

      setResult(response);

      addToHistory({
        path: '/ai-grammar-checker',
        name: 'AI Grammar Checker',
        result: 'Grammar checked',
        type: 'ai',
      });

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err: any) {
      if (err instanceof OfflineError || err.name === 'OfflineError') {
        setError('No internet connection. Please check your network.');
      } else {
        setError('Failed to check grammar. Please try again.');
      }
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
    setResult('');
    setError('');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ToolHeader title="AI Grammar Checker" toolId="ai-grammar-checker" onRefresh={handleReset} />

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
              <Text style={styles.label}>Text to Check *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter or paste your text here to check for grammar, spelling, and punctuation errors..."
                placeholderTextColor={Colors.textMuted}
                value={inputText}
                onChangeText={setInputText}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>{inputText.length} characters</Text>
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.generateButton, loading && styles.generateButtonDisabled]}
              onPress={checkGrammar}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <CheckCircle size={20} color="#fff" />
                  <Text style={styles.generateButtonText}>Check Grammar</Text>
                </>
              )}
            </TouchableOpacity>

            {result ? (
              <View style={styles.resultContainer}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle}>Corrected Text</Text>
                  <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
                    {copied ? (
                      <Check size={18} color={Colors.success} />
                    ) : (
                      <Copy size={18} color={Colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                </View>
                <AIOutputFormatter text={result} />
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
    marginBottom: 20,
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
  textArea: {
    minHeight: 180,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'right',
    marginTop: 4,
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
  copyButton: {
    padding: 8,
  },
});
