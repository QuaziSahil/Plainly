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
import { Minimize2, Copy, Check, Sparkles } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '@/constants/Colors';
import { askGroq, OfflineError } from '@/services/groqAI';
import { useStorageStore } from '@/stores/useStorageStore';
import ToolHeader from '@/components/ToolHeader';
import AIOutputFormatter from '@/components/AIOutputFormatter';

const SHORTENING_LEVELS = [
  { id: 'slight', label: '📏 Slightly (75%)' },
  { id: 'moderate', label: '📐 Moderately (50%)' },
  { id: 'aggressive', label: '⚡ Aggressively (25%)' },
];

const SHORTENING_PRIORITIES = [
  { id: 'clarity', label: 'Keep Clarity' },
  { id: 'key-points', label: 'Key Points Only' },
  { id: 'brevity', label: 'Maximum Brevity' },
];

export default function AISentenceShortenerScreen() {
  const insets = useSafeAreaInsets();
  const { addToHistory } = useStorageStore();
  const scrollRef = useRef<ScrollView>(null);

  const [text, setText] = useState('');
  const [level, setLevel] = useState('moderate');
  const [priority, setPriority] = useState('clarity');
  const [shortened, setShortened] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const shortenText = async () => {
    if (!text.trim()) {
      setError('Please enter text to shorten');
      return;
    }

    setLoading(true);
    setError('');
    setShortened('');

    try {
      const targetPercentage = level === 'slight' ? '75%' : level === 'moderate' ? '50%' : '25%';
      const selectedPriority = SHORTENING_PRIORITIES.find(p => p.id === priority)?.label || 'clarity';

      const prompt = `Shorten this text to approximately ${targetPercentage} of its original length while prioritizing ${selectedPriority}:

"${text}"

Requirements:
- Reduce to about ${targetPercentage} of original length
- ${priority === 'clarity' ? 'Maintain full clarity and meaning' : priority === 'key-points' ? 'Focus on main points only' : 'Be as brief as possible'}
- Remove redundancy and filler words
- Keep essential information
- Maintain grammatical correctness
- Preserve the original tone

Write only the shortened text.`;

      const systemPrompt = 'You are an expert editor who shortens text while preserving meaning. Write only the shortened text, no explanations.';

      const response = await askGroq(prompt, systemPrompt, {
        temperature: 0.5,
        maxTokens: 400,
      });

      setShortened(response.trim());

      addToHistory({
        path: '/ai-sentence-shortener',
        name: 'AI Sentence Shortener',
        result: `Shortened: ${text.length} → ${response.trim().length} chars`,
        type: 'ai',
      });

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err: any) {
      if (err instanceof OfflineError || err.name === 'OfflineError') {
        setError('No internet connection. Please check your network.');
      } else {
        setError('Failed to shorten text. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(shortened);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setText('');
    setLevel('moderate');
    setPriority('clarity');
    setShortened('');
    setError('');
  };

  const reductionPercentage = shortened ? 
    Math.round((1 - shortened.length / text.length) * 100) : 0;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ToolHeader title="AI Sentence Shortener" toolId="ai-sentence-shortener" onRefresh={handleReset} />

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
              <Text style={styles.label}>Text to Shorten *</Text>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                placeholder="Paste the text you want to make more concise..."
                placeholderTextColor={Colors.textMuted}
                value={text}
                onChangeText={setText}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>{text.length} characters</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Shortening Level</Text>
              <View style={styles.levelColumn}>
                {SHORTENING_LEVELS.map((l) => (
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
              <Text style={styles.label}>Priority</Text>
              <View style={styles.priorityRow}>
                {SHORTENING_PRIORITIES.map((p) => (
                  <TouchableOpacity
                    key={p.id}
                    style={[styles.priorityChip, priority === p.id && styles.priorityChipActive]}
                    onPress={() => setPriority(p.id)}
                  >
                    <Text style={[styles.priorityText, priority === p.id && styles.priorityTextActive]}>
                      {p.label}
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
              onPress={shortenText}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Minimize2 size={20} color="#fff" />
                  <Text style={styles.generateButtonText}>Shorten Text</Text>
                </>
              )}
            </TouchableOpacity>

            {shortened ? (
              <View style={styles.resultContainer}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle}>Shortened Text</Text>
                  <TouchableOpacity onPress={handleCopy} style={styles.copyButton}>
                    {copied ? (
                      <Check size={18} color={Colors.success} />
                    ) : (
                      <Copy size={18} color={Colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                </View>
                <View style={styles.shortenedContent}>
                  <AIOutputFormatter text={shortened} />
                </View>
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Original</Text>
                    <Text style={styles.statValue}>{text.length} chars</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Shortened</Text>
                    <Text style={styles.statValue}>{shortened.length} chars</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Reduced</Text>
                    <Text style={[styles.statValue, styles.reductionValue]}>
                      {reductionPercentage}%
                    </Text>
                  </View>
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
  inputMultiline: {
    minHeight: 140,
    paddingTop: 14,
  },
  charCount: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 6,
    textAlign: 'right',
  },
  levelColumn: {
    gap: 10,
  },
  levelChip: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
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
  priorityRow: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
    alignItems: 'center',
  },
  priorityChipActive: {
    backgroundColor: Colors.accentPrimary,
    borderColor: Colors.accentPrimary,
  },
  priorityText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  priorityTextActive: {
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
  copyButton: {
    padding: 4,
  },
  shortenedContent: {
    backgroundColor: Colors.bgPrimary,
    borderRadius: 10,
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 12,
    backgroundColor: Colors.bgPrimary,
    borderRadius: 10,
    padding: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  reductionValue: {
    color: Colors.success,
  },
});
