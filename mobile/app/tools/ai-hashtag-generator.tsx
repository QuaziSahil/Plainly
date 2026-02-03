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
import { Hash, Copy, Check, Sparkles } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '@/constants/Colors';
import { askGroq, OfflineError } from '@/services/groqAI';
import { useStorageStore } from '@/stores/useStorageStore';
import ToolHeader from '@/components/ToolHeader';

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'twitter', label: 'Twitter/X' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'general', label: 'General' },
];

export default function AIHashtagGeneratorScreen() {
  const insets = useSafeAreaInsets();
  const { addToHistory } = useStorageStore();
  const scrollRef = useRef<ScrollView>(null);

  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [count, setCount] = useState('20');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const generateHashtags = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic or description');
      return;
    }

    setLoading(true);
    setError('');
    setHashtags([]);

    try {
      const selectedPlatform = PLATFORMS.find(p => p.id === platform)?.label || platform;
      const hashtagCount = parseInt(count) || 20;

      const prompt = `Generate ${hashtagCount} relevant hashtags for ${selectedPlatform} about: "${topic}"

Requirements:
- Mix of popular and niche hashtags
- Relevant to the topic
- Optimized for ${selectedPlatform}
- Include trending hashtags if applicable
- Format: Return only the hashtags separated by spaces, each starting with #`;

      const systemPrompt = 'You are a social media expert. Generate relevant, trending hashtags. Return only hashtags separated by spaces, nothing else.';

      const response = await askGroq(prompt, systemPrompt, {
        temperature: 0.7,
        maxTokens: 500,
      });

      const tags = response.split(/\s+/).filter(tag => tag.startsWith('#')).slice(0, hashtagCount);
      setHashtags(tags);

      addToHistory({
        path: '/ai-hashtag-generator',
        name: 'AI Hashtag Generator',
        result: `${tags.length} hashtags generated`,
        type: 'ai',
      });

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err: any) {
      if (err instanceof OfflineError || err.name === 'OfflineError') {
        setError('No internet connection. Please check your network.');
      } else {
        setError('Failed to generate hashtags. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(hashtags.join(' '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setTopic('');
    setPlatform('instagram');
    setCount('20');
    setHashtags([]);
    setError('');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ToolHeader title="AI Hashtag Generator" toolId="ai-hashtag-generator" onRefresh={handleReset} />

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
              <Text style={styles.label}>Topic or Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="e.g., Travel photography in Japan, sunset views..."
                placeholderTextColor={Colors.textMuted}
                value={topic}
                onChangeText={setTopic}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Platform</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.chipGrid}>
                  {PLATFORMS.map((p) => (
                    <TouchableOpacity
                      key={p.id}
                      style={[styles.chip, platform === p.id && styles.chipActive]}
                      onPress={() => setPlatform(p.id)}
                    >
                      <Text style={[styles.chipText, platform === p.id && styles.chipTextActive]}>
                        {p.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Number of Hashtags</Text>
              <View style={styles.countRow}>
                {['10', '20', '30'].map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={[styles.countChip, count === num && styles.countChipActive]}
                    onPress={() => setCount(num)}
                  >
                    <Text style={[styles.countText, count === num && styles.countTextActive]}>{num}</Text>
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
              onPress={generateHashtags}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Hash size={20} color="#fff" />
                  <Text style={styles.generateButtonText}>Generate Hashtags</Text>
                </>
              )}
            </TouchableOpacity>

            {hashtags.length > 0 ? (
              <View style={styles.resultContainer}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle}>{hashtags.length} Hashtags</Text>
                  <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
                    {copied ? (
                      <Check size={18} color={Colors.success} />
                    ) : (
                      <Copy size={18} color={Colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                </View>
                <View style={styles.hashtagContainer}>
                  {hashtags.map((tag, index) => (
                    <View key={index} style={styles.hashtagChip}>
                      <Text style={styles.hashtagText}>{tag}</Text>
                    </View>
                  ))}
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
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  chipGrid: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  chipActive: {
    backgroundColor: Colors.accentPrimary,
    borderColor: Colors.accentPrimary,
  },
  chipText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#fff',
  },
  countRow: {
    flexDirection: 'row',
    gap: 12,
  },
  countChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
    alignItems: 'center',
  },
  countChipActive: {
    backgroundColor: Colors.accentPrimary,
    borderColor: Colors.accentPrimary,
  },
  countText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  countTextActive: {
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
    padding: 8,
  },
  hashtagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hashtagChip: {
    backgroundColor: Colors.accentPrimary + '20',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  hashtagText: {
    color: Colors.accentPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
});
