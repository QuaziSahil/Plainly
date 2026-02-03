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
import { Copy, Check, Sparkles, Globe, ArrowRight, RotateCcw } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '@/constants/Colors';
import { askGroq, OfflineError } from '@/services/groqAI';
import { useStorageStore } from '@/stores/useStorageStore';
import AIOutputFormatter from '@/components/AIOutputFormatter';
import ToolHeader from '@/components/ToolHeader';

const LANGUAGES = [
  { id: 'spanish', label: '🇪🇸 Spanish' },
  { id: 'french', label: '🇫🇷 French' },
  { id: 'german', label: '🇩🇪 German' },
  { id: 'italian', label: '🇮🇹 Italian' },
  { id: 'portuguese', label: '🇵🇹 Portuguese' },
  { id: 'chinese', label: '🇨🇳 Chinese' },
  { id: 'japanese', label: '🇯🇵 Japanese' },
  { id: 'korean', label: '🇰🇷 Korean' },
  { id: 'arabic', label: '🇸🇦 Arabic' },
  { id: 'hindi', label: '🇮🇳 Hindi' },
  { id: 'russian', label: '🇷🇺 Russian' },
  { id: 'dutch', label: '🇳🇱 Dutch' },
];

export default function AITranslatorScreen() {
  const insets = useSafeAreaInsets();
  const { addToHistory } = useStorageStore();
  const scrollRef = useRef<ScrollView>(null);

  const [inputText, setInputText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('spanish');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const translateText = async () => {
    if (!inputText.trim()) {
      setError('Please enter text to translate');
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      const langName = LANGUAGES.find(l => l.id === targetLanguage)?.label.split(' ')[1] || targetLanguage;
      
      const prompt = `Translate the following text to ${langName}:

"${inputText}"

Provide only the translation, no explanations.`;

      const systemPrompt = 'You are an expert translator. Provide accurate, natural-sounding translations.';

      const response = await askGroq(prompt, systemPrompt, {
        temperature: 0.3,
        maxTokens: 1000,
      });

      setResult(response);

      addToHistory({
        path: '/ai-translator',
        name: 'AI Translator',
        result: `Translated to ${langName}`,
        type: 'ai',
      });

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err: any) {
      if (err instanceof OfflineError || err.name === 'OfflineError') {
        setError('No internet connection. Please check your network and try again.');
      } else {
        setError('Failed to translate. Please try again.');
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
    setResult('');
    setError('');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <ToolHeader title="AI Translator" toolId="ai-translator" onRefresh={handleReset} />

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
              <Text style={styles.label}>Text to Translate *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter text in any language..."
                placeholderTextColor={Colors.textMuted}
                value={inputText}
                onChangeText={setInputText}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>

            {/* Language Direction */}
            <View style={styles.directionRow}>
              <View style={styles.languageBox}>
                <Text style={styles.languageBoxLabel}>Auto-detect</Text>
              </View>
              <ArrowRight size={20} color={Colors.textTertiary} />
              <View style={[styles.languageBox, styles.languageBoxActive]}>
                <Text style={styles.languageBoxLabelActive}>
                  {LANGUAGES.find(l => l.id === targetLanguage)?.label}
                </Text>
              </View>
            </View>

            {/* Target Language */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Translate To</Text>
              <View style={styles.languageGrid}>
                {LANGUAGES.map((lang) => (
                  <TouchableOpacity
                    key={lang.id}
                    style={[styles.langButton, targetLanguage === lang.id && styles.langButtonActive]}
                    onPress={() => setTargetLanguage(lang.id)}
                  >
                    <Text style={[styles.langText, targetLanguage === lang.id && styles.langTextActive]}>
                      {lang.label}
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

            {/* Translate Button */}
            <TouchableOpacity
              style={[styles.generateButton, (!inputText.trim() || loading) && styles.generateButtonDisabled]}
              onPress={translateText}
              disabled={!inputText.trim() || loading}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <>
                  <Globe size={20} color="#000" />
                  <Text style={styles.generateButtonText}>Translate</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Result */}
            {result ? (
              <View style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle}>Translation</Text>
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
    minHeight: 120,
    paddingTop: 14,
  },
  directionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  languageBox: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  languageBoxActive: {
    backgroundColor: Colors.accentGlow,
    borderColor: Colors.accentPrimary,
  },
  languageBoxLabel: {
    fontSize: 14,
    color: Colors.textTertiary,
  },
  languageBoxLabelActive: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.accentPrimary,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  langButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  langButtonActive: {
    backgroundColor: Colors.accentGlow,
    borderColor: Colors.accentPrimary,
  },
  langText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  langTextActive: {
    color: Colors.accentPrimary,
    fontWeight: '600',
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
