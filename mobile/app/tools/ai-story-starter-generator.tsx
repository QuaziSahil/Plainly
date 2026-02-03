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
import { BookOpen, Copy, Check, Sparkles, RefreshCw } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '@/constants/Colors';
import { askGroq, OfflineError } from '@/services/groqAI';
import { useStorageStore } from '@/stores/useStorageStore';
import ToolHeader from '@/components/ToolHeader';
import AIOutputFormatter from '@/components/AIOutputFormatter';

const STORY_GENRES = [
  { id: 'fantasy', label: '🧙 Fantasy' },
  { id: 'scifi', label: '🚀 Sci-Fi' },
  { id: 'mystery', label: '🔍 Mystery' },
  { id: 'romance', label: '💕 Romance' },
  { id: 'horror', label: '👻 Horror' },
  { id: 'adventure', label: '🗺️ Adventure' },
  { id: 'comedy', label: '😄 Comedy' },
  { id: 'drama', label: '🎭 Drama' },
];

export default function AIStoryStarterScreen() {
  const insets = useSafeAreaInsets();
  const { addToHistory } = useStorageStore();
  const scrollRef = useRef<ScrollView>(null);

  const [keywords, setKeywords] = useState('');
  const [genre, setGenre] = useState('fantasy');
  const [storyStarter, setStoryStarter] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const generateStarter = async () => {
    setLoading(true);
    setError('');
    setStoryStarter('');

    try {
      const selectedGenre = STORY_GENRES.find(g => g.id === genre)?.label.split(' ')[1] || 'fantasy';
      const keywordsPart = keywords.trim() ? ` incorporating these elements: ${keywords}` : '';

      const prompt = `Write a compelling story starter (opening paragraph) for a ${selectedGenre} story${keywordsPart}.

Requirements:
- 3-4 sentences that hook the reader
- Establish mood and setting
- Introduce intrigue or conflict
- Leave the reader wanting more
- Use vivid, engaging language

Write only the story starter, no titles or explanations.`;

      const systemPrompt = 'You are a bestselling author skilled at crafting captivating story openings. Write only the story starter paragraph.';

      const response = await askGroq(prompt, systemPrompt, {
        temperature: 0.85,
        maxTokens: 400,
      });

      setStoryStarter(response.trim());

      addToHistory({
        path: '/ai-story-starter-generator',
        name: 'AI Story Starter',
        result: `${selectedGenre} story starter generated`,
        type: 'ai',
      });

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err: any) {
      if (err instanceof OfflineError || err.name === 'OfflineError') {
        setError('No internet connection. Please check your network.');
      } else {
        setError('Failed to generate story starter. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(storyStarter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setKeywords('');
    setGenre('fantasy');
    setStoryStarter('');
    setError('');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ToolHeader title="AI Story Starter" toolId="ai-story-starter-generator" onRefresh={handleReset} />

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
              <Text style={styles.label}>Genre</Text>
              <View style={styles.genreGrid}>
                {STORY_GENRES.map((g) => (
                  <TouchableOpacity
                    key={g.id}
                    style={[styles.genreChip, genre === g.id && styles.genreChipActive]}
                    onPress={() => setGenre(g.id)}
                  >
                    <Text style={[styles.genreText, genre === g.id && styles.genreTextActive]}>
                      {g.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Keywords / Elements (Optional)</Text>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                placeholder="e.g., ancient castle, lost princess, magical sword..."
                placeholderTextColor={Colors.textMuted}
                value={keywords}
                onChangeText={setKeywords}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.generateButton, loading && styles.generateButtonDisabled]}
              onPress={generateStarter}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <BookOpen size={20} color="#fff" />
                  <Text style={styles.generateButtonText}>Generate Story Starter</Text>
                </>
              )}
            </TouchableOpacity>

            {storyStarter ? (
              <View style={styles.resultContainer}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle}>Your Story Starter</Text>
                  <View style={styles.resultActions}>
                    <TouchableOpacity onPress={generateStarter} style={styles.actionButton}>
                      <RefreshCw size={18} color={Colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleCopy} style={styles.actionButton}>
                      {copied ? (
                        <Check size={18} color={Colors.success} />
                      ) : (
                        <Copy size={18} color={Colors.textSecondary} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.storyContent}>
                  <AIOutputFormatter text={storyStarter} />
                </View>
                <Text style={styles.continueHint}>Continue the story... ✍️</Text>
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
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  genreChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  genreChipActive: {
    backgroundColor: Colors.accentPrimary,
    borderColor: Colors.accentPrimary,
  },
  genreText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  genreTextActive: {
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
  resultActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  storyContent: {
    backgroundColor: Colors.bgPrimary,
    borderRadius: 10,
    padding: 16,
  },
  continueHint: {
    marginTop: 12,
    fontSize: 13,
    color: Colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
