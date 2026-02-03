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
import { Instagram, Copy, Check, Sparkles, RefreshCw } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '@/constants/Colors';
import { askGroq, OfflineError } from '@/services/groqAI';
import { useStorageStore } from '@/stores/useStorageStore';
import ToolHeader from '@/components/ToolHeader';

const CAPTION_STYLES = [
  { id: 'aesthetic', label: '✨ Aesthetic' },
  { id: 'funny', label: '😂 Funny' },
  { id: 'inspirational', label: '💪 Inspirational' },
  { id: 'storytelling', label: '📖 Storytelling' },
  { id: 'casual', label: '😎 Casual' },
  { id: 'promotional', label: '🛒 Promotional' },
];

const CAPTION_LENGTHS = [
  { id: 'short', label: 'Short (~50 words)' },
  { id: 'medium', label: 'Medium (~100 words)' },
  { id: 'long', label: 'Long (~150 words)' },
];

export default function AIInstagramCaptionScreen() {
  const insets = useSafeAreaInsets();
  const { addToHistory } = useStorageStore();
  const scrollRef = useRef<ScrollView>(null);

  const [description, setDescription] = useState('');
  const [style, setStyle] = useState('aesthetic');
  const [length, setLength] = useState('medium');
  const [captions, setCaptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState('');

  const generateCaptions = async () => {
    if (!description.trim()) {
      setError('Please describe your photo/post');
      return;
    }

    setLoading(true);
    setError('');
    setCaptions([]);

    try {
      const selectedStyle = CAPTION_STYLES.find(s => s.id === style)?.label.split(' ')[1] || 'aesthetic';
      const selectedLength = CAPTION_LENGTHS.find(l => l.id === length)?.label || 'medium';

      const prompt = `Generate 3 ${selectedStyle} Instagram captions for a post about: "${description}"

Requirements:
- Length: ${selectedLength}
- Include relevant emojis throughout
- Add 5-10 relevant hashtags at the end
- Make it engaging and authentic
- ${style === 'promotional' ? 'Include a soft call-to-action' : ''}
- ${style === 'storytelling' ? 'Start with a hook and tell a mini story' : ''}
- Each caption should be different and unique

Format: Number each caption 1-3. Include emojis and hashtags.`;

      const systemPrompt = 'You are an Instagram influencer who creates viral captions. Write engaging, authentic captions with emojis and hashtags.';

      const response = await askGroq(prompt, systemPrompt, {
        temperature: 0.85,
        maxTokens: 800,
      });

      // Split by numbered patterns
      const captionMatches = response.split(/(?=\d+[\.\)]\s*)/);
      const parsedCaptions = captionMatches
        .map(caption => caption.replace(/^\d+[\.\)]\s*/, '').trim())
        .filter(caption => caption.length > 20)
        .slice(0, 3);

      setCaptions(parsedCaptions);

      addToHistory({
        path: '/ai-instagram-caption-generator',
        name: 'AI Instagram Caption',
        result: `${parsedCaptions.length} captions generated`,
        type: 'ai',
      });

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err: any) {
      if (err instanceof OfflineError || err.name === 'OfflineError') {
        setError('No internet connection. Please check your network.');
      } else {
        setError('Failed to generate captions. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (caption: string, index: number) => {
    await Clipboard.setStringAsync(caption);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleReset = () => {
    setDescription('');
    setStyle('aesthetic');
    setLength('medium');
    setCaptions([]);
    setError('');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ToolHeader title="AI Instagram Caption" toolId="ai-instagram-caption-generator" onRefresh={handleReset} />

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
              <Text style={styles.label}>Describe Your Post *</Text>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                placeholder="e.g., Sunset beach photo, Coffee shop selfie, Hiking adventure..."
                placeholderTextColor={Colors.textMuted}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Caption Style</Text>
              <View style={styles.optionGrid}>
                {CAPTION_STYLES.map((s) => (
                  <TouchableOpacity
                    key={s.id}
                    style={[styles.optionChip, style === s.id && styles.optionChipActive]}
                    onPress={() => setStyle(s.id)}
                  >
                    <Text style={[styles.optionText, style === s.id && styles.optionTextActive]}>
                      {s.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Caption Length</Text>
              <View style={styles.lengthRow}>
                {CAPTION_LENGTHS.map((l) => (
                  <TouchableOpacity
                    key={l.id}
                    style={[styles.lengthChip, length === l.id && styles.lengthChipActive]}
                    onPress={() => setLength(l.id)}
                  >
                    <Text style={[styles.lengthText, length === l.id && styles.lengthTextActive]}>
                      {l.label}
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
              onPress={generateCaptions}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Instagram size={20} color="#fff" />
                  <Text style={styles.generateButtonText}>Generate Captions</Text>
                </>
              )}
            </TouchableOpacity>

            {captions.length > 0 ? (
              <View style={styles.resultContainer}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle}>Generated Captions</Text>
                  <TouchableOpacity onPress={generateCaptions}>
                    <RefreshCw size={18} color={Colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                {captions.map((caption, index) => (
                  <View key={index} style={styles.captionCard}>
                    <View style={styles.captionHeader}>
                      <Text style={styles.captionNumber}>Caption {index + 1}</Text>
                      <TouchableOpacity
                        style={styles.copyButton}
                        onPress={() => handleCopy(caption, index)}
                      >
                        {copiedIndex === index ? (
                          <Check size={18} color={Colors.success} />
                        ) : (
                          <Copy size={18} color={Colors.textSecondary} />
                        )}
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.captionText}>{caption}</Text>
                  </View>
                ))}
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
    backgroundColor: '#E1306C',
    borderColor: '#E1306C',
  },
  optionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  optionTextActive: {
    color: '#fff',
  },
  lengthRow: {
    flexDirection: 'row',
    gap: 10,
  },
  lengthChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
    alignItems: 'center',
  },
  lengthChipActive: {
    backgroundColor: Colors.accentPrimary,
    borderColor: Colors.accentPrimary,
  },
  lengthText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  lengthTextActive: {
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
    backgroundColor: '#E1306C',
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
  captionCard: {
    backgroundColor: Colors.bgPrimary,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  captionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  captionNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E1306C',
  },
  copyButton: {
    padding: 4,
  },
  captionText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
});
