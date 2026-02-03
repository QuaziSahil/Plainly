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
import { Expand, Copy, Check, Sparkles } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '@/constants/Colors';
import { askGroq, OfflineError } from '@/services/groqAI';
import { useStorageStore } from '@/stores/useStorageStore';
import ToolHeader from '@/components/ToolHeader';
import AIOutputFormatter from '@/components/AIOutputFormatter';

const EXPANSION_LEVELS = [
  { id: 'slight', label: '📏 Slightly (2x)' },
  { id: 'moderate', label: '📐 Moderately (3x)' },
  { id: 'detailed', label: '📝 Detailed (4x+)' },
];

const EXPANSION_STYLES = [
  { id: 'descriptive', label: 'Descriptive' },
  { id: 'explanatory', label: 'Explanatory' },
  { id: 'creative', label: 'Creative' },
  { id: 'academic', label: 'Academic' },
];

export default function AISentenceExpanderScreen() {
  const insets = useSafeAreaInsets();
  const { addToHistory } = useStorageStore();
  const scrollRef = useRef<ScrollView>(null);

  const [sentence, setSentence] = useState('');
  const [level, setLevel] = useState('moderate');
  const [style, setStyle] = useState('descriptive');
  const [expanded, setExpanded] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const expandSentence = async () => {
    if (!sentence.trim()) {
      setError('Please enter a sentence to expand');
      return;
    }

    setLoading(true);
    setError('');
    setExpanded('');

    try {
      const selectedLevel = EXPANSION_LEVELS.find(l => l.id === level)?.label || 'moderately';
      const selectedStyle = EXPANSION_STYLES.find(s => s.id === style)?.label || 'descriptive';

      const multiplier = level === 'slight' ? '2x' : level === 'moderate' ? '3x' : '4x or more';

      const prompt = `Expand this sentence ${selectedLevel.split(' ')[1]} using a ${selectedStyle} style:

"${sentence}"

Requirements:
- Expand to approximately ${multiplier} the original length
- Add ${style === 'descriptive' ? 'vivid details and imagery' : style === 'explanatory' ? 'explanations and context' : style === 'creative' ? 'creative flourishes and metaphors' : 'formal language and precise terminology'}
- Maintain the original meaning
- Use smooth transitions
- Keep it natural and flowing
- Do not add bullet points or lists

Write only the expanded text.`;

      const systemPrompt = 'You are a skilled writer who expands sentences while maintaining their essence. Write only the expanded text, no explanations.';

      const response = await askGroq(prompt, systemPrompt, {
        temperature: 0.75,
        maxTokens: 500,
      });

      setExpanded(response.trim());

      addToHistory({
        path: '/ai-sentence-expander',
        name: 'AI Sentence Expander',
        result: `Expanded: "${sentence.substring(0, 30)}..."`,
        type: 'ai',
      });

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err: any) {
      if (err instanceof OfflineError || err.name === 'OfflineError') {
        setError('No internet connection. Please check your network.');
      } else {
        setError('Failed to expand sentence. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(expanded);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setSentence('');
    setLevel('moderate');
    setStyle('descriptive');
    setExpanded('');
    setError('');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ToolHeader title="AI Sentence Expander" toolId="ai-sentence-expander" onRefresh={handleReset} />

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
              <Text style={styles.label}>Sentence to Expand *</Text>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                placeholder="Enter a short sentence you want to expand..."
                placeholderTextColor={Colors.textMuted}
                value={sentence}
                onChangeText={setSentence}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>{sentence.length} characters</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Expansion Level</Text>
              <View style={styles.levelRow}>
                {EXPANSION_LEVELS.map((l) => (
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
              <Text style={styles.label}>Writing Style</Text>
              <View style={styles.styleRow}>
                {EXPANSION_STYLES.map((s) => (
                  <TouchableOpacity
                    key={s.id}
                    style={[styles.styleChip, style === s.id && styles.styleChipActive]}
                    onPress={() => setStyle(s.id)}
                  >
                    <Text style={[styles.styleText, style === s.id && styles.styleTextActive]}>
                      {s.label}
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
              onPress={expandSentence}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Expand size={20} color="#fff" />
                  <Text style={styles.generateButtonText}>Expand Sentence</Text>
                </>
              )}
            </TouchableOpacity>

            {expanded ? (
              <View style={styles.resultContainer}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle}>Expanded Text</Text>
                  <TouchableOpacity onPress={handleCopy} style={styles.copyButton}>
                    {copied ? (
                      <Check size={18} color={Colors.success} />
                    ) : (
                      <Copy size={18} color={Colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                </View>
                <View style={styles.expandedContent}>
                  <AIOutputFormatter text={expanded} />
                </View>
                <View style={styles.statsRow}>
                  <Text style={styles.statText}>
                    Original: {sentence.length} chars → Expanded: {expanded.length} chars
                  </Text>
                  <Text style={styles.statText}>
                    ({Math.round(expanded.length / sentence.length)}x longer)
                  </Text>
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
    minHeight: 100,
    paddingTop: 14,
  },
  charCount: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 6,
    textAlign: 'right',
  },
  levelRow: {
    gap: 10,
  },
  levelChip: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
    marginBottom: 8,
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
  styleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  styleChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  styleChipActive: {
    backgroundColor: Colors.accentPrimary,
    borderColor: Colors.accentPrimary,
  },
  styleText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  styleTextActive: {
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
  expandedContent: {
    backgroundColor: Colors.bgPrimary,
    borderRadius: 10,
    padding: 16,
  },
  statsRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
});
