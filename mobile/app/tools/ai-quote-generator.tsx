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
import { Quote, Copy, Check, Sparkles, RefreshCw } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '@/constants/Colors';
import { askGroq, OfflineError } from '@/services/groqAI';
import { useStorageStore } from '@/stores/useStorageStore';
import ToolHeader from '@/components/ToolHeader';

const QUOTE_TYPES = [
  { id: 'motivational', label: 'Motivational', emoji: '💪' },
  { id: 'inspirational', label: 'Inspirational', emoji: '✨' },
  { id: 'wisdom', label: 'Wisdom', emoji: '🦉' },
  { id: 'love', label: 'Love', emoji: '❤️' },
  { id: 'success', label: 'Success', emoji: '🏆' },
  { id: 'funny', label: 'Funny', emoji: '😂' },
  { id: 'philosophical', label: 'Philosophical', emoji: '🤔' },
  { id: 'leadership', label: 'Leadership', emoji: '👑' },
];

export default function AIQuoteGeneratorScreen() {
  const insets = useSafeAreaInsets();
  const { addToHistory } = useStorageStore();
  const scrollRef = useRef<ScrollView>(null);

  const [topic, setTopic] = useState('');
  const [quoteType, setQuoteType] = useState('motivational');
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const generateQuote = async () => {
    setLoading(true);
    setError('');
    setQuote('');
    setAuthor('');

    try {
      const selectedType = QUOTE_TYPES.find(t => t.id === quoteType)?.label || 'motivational';
      const topicPart = topic.trim() ? ` about "${topic}"` : '';

      const prompt = `Generate a powerful ${selectedType} quote${topicPart}.

Requirements:
- Make it profound and memorable
- Keep it concise (1-3 sentences)
- Make it original and impactful
- Include a fictional or real author attribution

Format your response exactly like this:
QUOTE: [the quote]
AUTHOR: [author name]`;

      const systemPrompt = 'You are a wise philosopher and writer. Generate meaningful, impactful quotes. Follow the exact format requested.';

      const response = await askGroq(prompt, systemPrompt, {
        temperature: 0.8,
        maxTokens: 200,
      });

      const quoteMatch = response.match(/QUOTE:\s*(.+?)(?=AUTHOR:|$)/is);
      const authorMatch = response.match(/AUTHOR:\s*(.+)/i);

      if (quoteMatch) {
        setQuote(quoteMatch[1].trim().replace(/^["']|["']$/g, ''));
      }
      if (authorMatch) {
        setAuthor(authorMatch[1].trim().replace(/^[-–—]\s*/, ''));
      }

      addToHistory({
        path: '/ai-quote-generator',
        name: 'AI Quote Generator',
        result: `${selectedType} quote generated`,
        type: 'ai',
      });

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err: any) {
      if (err instanceof OfflineError || err.name === 'OfflineError') {
        setError('No internet connection. Please check your network.');
      } else {
        setError('Failed to generate quote. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    const fullQuote = author ? `"${quote}" — ${author}` : `"${quote}"`;
    await Clipboard.setStringAsync(fullQuote);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setTopic('');
    setQuoteType('motivational');
    setQuote('');
    setAuthor('');
    setError('');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ToolHeader title="AI Quote Generator" toolId="ai-quote-generator" onRefresh={handleReset} />

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
              <Text style={styles.label}>Topic (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., perseverance, happiness, growth..."
                placeholderTextColor={Colors.textMuted}
                value={topic}
                onChangeText={setTopic}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Quote Type</Text>
              <View style={styles.typeGrid}>
                {QUOTE_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[styles.typeChip, quoteType === type.id && styles.typeChipActive]}
                    onPress={() => setQuoteType(type.id)}
                  >
                    <Text style={styles.typeEmoji}>{type.emoji}</Text>
                    <Text style={[styles.typeText, quoteType === type.id && styles.typeTextActive]}>
                      {type.label}
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
              onPress={generateQuote}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Quote size={20} color="#fff" />
                  <Text style={styles.generateButtonText}>Generate Quote</Text>
                </>
              )}
            </TouchableOpacity>

            {quote ? (
              <View style={styles.resultContainer}>
                <View style={styles.quoteCard}>
                  <Text style={styles.quoteIcon}>"</Text>
                  <Text style={styles.quoteText}>{quote}</Text>
                  {author ? <Text style={styles.authorText}>— {author}</Text> : null}
                </View>
                <View style={styles.resultActions}>
                  <TouchableOpacity style={styles.actionButton} onPress={handleCopy}>
                    {copied ? (
                      <Check size={20} color={Colors.success} />
                    ) : (
                      <Copy size={20} color={Colors.textSecondary} />
                    )}
                    <Text style={styles.actionText}>{copied ? 'Copied!' : 'Copy'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton} onPress={generateQuote}>
                    <RefreshCw size={20} color={Colors.textSecondary} />
                    <Text style={styles.actionText}>New Quote</Text>
                  </TouchableOpacity>
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
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
    gap: 6,
  },
  typeChipActive: {
    backgroundColor: Colors.accentPrimary,
    borderColor: Colors.accentPrimary,
  },
  typeEmoji: {
    fontSize: 16,
  },
  typeText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  typeTextActive: {
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
  quoteCard: {
    backgroundColor: Colors.bgPrimary,
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  quoteIcon: {
    fontSize: 48,
    color: Colors.accentPrimary,
    opacity: 0.5,
    lineHeight: 48,
    marginBottom: 8,
  },
  quoteText: {
    fontSize: 20,
    color: Colors.textPrimary,
    lineHeight: 30,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  authorText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  resultActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
  },
  actionText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
