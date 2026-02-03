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
import { Feather, Copy, Check, Sparkles } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '@/constants/Colors';
import { askGroq, OfflineError } from '@/services/groqAI';
import { useStorageStore } from '@/stores/useStorageStore';
import ToolHeader from '@/components/ToolHeader';
import AIOutputFormatter from '@/components/AIOutputFormatter';

const POEM_TYPES = [
  { id: 'haiku', label: 'Haiku' },
  { id: 'sonnet', label: 'Sonnet' },
  { id: 'limerick', label: 'Limerick' },
  { id: 'free-verse', label: 'Free Verse' },
  { id: 'rhyming', label: 'Rhyming' },
  { id: 'acrostic', label: 'Acrostic' },
];

const POEM_MOODS = [
  { id: 'romantic', label: '💕 Romantic' },
  { id: 'sad', label: '😢 Melancholic' },
  { id: 'happy', label: '😊 Joyful' },
  { id: 'inspirational', label: '✨ Inspirational' },
  { id: 'dark', label: '🌑 Dark' },
  { id: 'peaceful', label: '🕊️ Peaceful' },
];

export default function AIPoemGeneratorScreen() {
  const insets = useSafeAreaInsets();
  const { addToHistory } = useStorageStore();
  const scrollRef = useRef<ScrollView>(null);

  const [topic, setTopic] = useState('');
  const [poemType, setPoemType] = useState('free-verse');
  const [mood, setMood] = useState('inspirational');
  const [poem, setPoem] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const generatePoem = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic for your poem');
      return;
    }

    setLoading(true);
    setError('');
    setPoem('');

    try {
      const selectedType = POEM_TYPES.find(t => t.id === poemType)?.label || 'free verse';
      const selectedMood = POEM_MOODS.find(m => m.id === mood)?.label.split(' ')[1] || 'inspirational';

      const prompt = `Write a ${selectedType} poem about "${topic}" with a ${selectedMood} mood.

Requirements:
${poemType === 'haiku' ? '- Follow 5-7-5 syllable structure' : ''}
${poemType === 'sonnet' ? '- 14 lines with proper sonnet structure' : ''}
${poemType === 'limerick' ? '- 5 lines with AABBA rhyme scheme' : ''}
${poemType === 'rhyming' ? '- Include consistent rhyme scheme' : ''}
${poemType === 'acrostic' ? '- First letters spell out the topic word' : ''}
- Use vivid imagery and metaphors
- Evoke strong emotions
- Be creative and original

Write only the poem, no title or explanations.`;

      const systemPrompt = 'You are a talented poet with mastery of various poetic forms. Write beautiful, evocative poetry. Return only the poem text.';

      const response = await askGroq(prompt, systemPrompt, {
        temperature: 0.85,
        maxTokens: 600,
      });

      setPoem(response.trim());

      addToHistory({
        path: '/ai-poem-generator',
        name: 'AI Poem Generator',
        result: `${selectedType} poem about ${topic}`,
        type: 'ai',
      });

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err: any) {
      if (err instanceof OfflineError || err.name === 'OfflineError') {
        setError('No internet connection. Please check your network.');
      } else {
        setError('Failed to generate poem. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(poem);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setTopic('');
    setPoemType('free-verse');
    setMood('inspirational');
    setPoem('');
    setError('');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ToolHeader title="AI Poem Generator" toolId="ai-poem-generator" onRefresh={handleReset} />

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
              <Text style={styles.label}>Topic / Subject *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Love, Nature, Time, Dreams..."
                placeholderTextColor={Colors.textMuted}
                value={topic}
                onChangeText={setTopic}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Poem Type</Text>
              <View style={styles.optionGrid}>
                {POEM_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[styles.optionChip, poemType === type.id && styles.optionChipActive]}
                    onPress={() => setPoemType(type.id)}
                  >
                    <Text style={[styles.optionText, poemType === type.id && styles.optionTextActive]}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mood</Text>
              <View style={styles.optionGrid}>
                {POEM_MOODS.map((m) => (
                  <TouchableOpacity
                    key={m.id}
                    style={[styles.optionChip, mood === m.id && styles.optionChipActive]}
                    onPress={() => setMood(m.id)}
                  >
                    <Text style={[styles.optionText, mood === m.id && styles.optionTextActive]}>
                      {m.label}
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
              onPress={generatePoem}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Feather size={20} color="#fff" />
                  <Text style={styles.generateButtonText}>Generate Poem</Text>
                </>
              )}
            </TouchableOpacity>

            {poem ? (
              <View style={styles.resultContainer}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle}>Your Poem</Text>
                  <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
                    {copied ? (
                      <Check size={18} color={Colors.success} />
                    ) : (
                      <Copy size={18} color={Colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                </View>
                <View style={styles.poemContent}>
                  <AIOutputFormatter text={poem} />
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
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  optionChipActive: {
    backgroundColor: Colors.accentPrimary,
    borderColor: Colors.accentPrimary,
  },
  optionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  optionTextActive: {
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
  poemContent: {
    backgroundColor: Colors.bgPrimary,
    borderRadius: 10,
    padding: 16,
  },
});
