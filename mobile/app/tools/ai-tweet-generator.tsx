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
import { Twitter, Copy, Check, Sparkles, RefreshCw } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '@/constants/Colors';
import { askGroq, OfflineError } from '@/services/groqAI';
import { useStorageStore } from '@/stores/useStorageStore';
import ToolHeader from '@/components/ToolHeader';

const TWEET_STYLES = [
  { id: 'informative', label: '📚 Informative' },
  { id: 'funny', label: '😄 Funny' },
  { id: 'motivational', label: '💪 Motivational' },
  { id: 'controversial', label: '🔥 Hot Take' },
  { id: 'thread-starter', label: '🧵 Thread Starter' },
  { id: 'engagement', label: '💬 Engagement' },
];

export default function AITweetGeneratorScreen() {
  const insets = useSafeAreaInsets();
  const { addToHistory } = useStorageStore();
  const scrollRef = useRef<ScrollView>(null);

  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('informative');
  const [tweets, setTweets] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState('');

  const generateTweets = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic for your tweet');
      return;
    }

    setLoading(true);
    setError('');
    setTweets([]);

    try {
      const selectedStyle = TWEET_STYLES.find(s => s.id === style)?.label.split(' ')[1] || 'informative';

      const prompt = `Generate 5 ${selectedStyle} tweets about "${topic}".

Requirements:
- Each tweet must be under 280 characters
- Include relevant hashtags (2-3 per tweet)
- Make them engaging and shareable
- ${style === 'engagement' ? 'Include a question or call-to-action' : ''}
- ${style === 'thread-starter' ? 'Make it intriguing enough to start a thread' : ''}
- ${style === 'controversial' ? 'Be bold but not offensive' : ''}
- Use emojis appropriately

Format: Return only the 5 tweets, numbered 1-5. Include hashtags.`;

      const systemPrompt = 'You are a social media expert who creates viral tweets. Return only the numbered tweets with hashtags.';

      const response = await askGroq(prompt, systemPrompt, {
        temperature: 0.85,
        maxTokens: 600,
      });

      const lines = response.split('\n')
        .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim())
        .filter(line => line.length > 0 && line.length <= 300)
        .slice(0, 5);

      setTweets(lines);

      addToHistory({
        path: '/ai-tweet-generator',
        name: 'AI Tweet Generator',
        result: `${lines.length} tweets generated`,
        type: 'ai',
      });

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err: any) {
      if (err instanceof OfflineError || err.name === 'OfflineError') {
        setError('No internet connection. Please check your network.');
      } else {
        setError('Failed to generate tweets. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (tweet: string, index: number) => {
    await Clipboard.setStringAsync(tweet);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleReset = () => {
    setTopic('');
    setStyle('informative');
    setTweets([]);
    setError('');
  };

  const getCharCount = (tweet: string) => {
    return tweet.length;
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ToolHeader title="AI Tweet Generator" toolId="ai-tweet-generator" onRefresh={handleReset} />

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
              <Text style={styles.label}>Topic / Idea *</Text>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                placeholder="e.g., AI in healthcare, Remote work tips, New product launch..."
                placeholderTextColor={Colors.textMuted}
                value={topic}
                onChangeText={setTopic}
                multiline
                numberOfLines={2}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tweet Style</Text>
              <View style={styles.styleGrid}>
                {TWEET_STYLES.map((s) => (
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
              onPress={generateTweets}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Twitter size={20} color="#fff" />
                  <Text style={styles.generateButtonText}>Generate Tweets</Text>
                </>
              )}
            </TouchableOpacity>

            {tweets.length > 0 ? (
              <View style={styles.resultContainer}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle}>Generated Tweets</Text>
                  <TouchableOpacity onPress={generateTweets}>
                    <RefreshCw size={18} color={Colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                {tweets.map((tweet, index) => (
                  <View key={index} style={styles.tweetCard}>
                    <Text style={styles.tweetText}>{tweet}</Text>
                    <View style={styles.tweetFooter}>
                      <Text style={[
                        styles.charCount,
                        getCharCount(tweet) > 280 && styles.charCountOver
                      ]}>
                        {getCharCount(tweet)}/280
                      </Text>
                      <TouchableOpacity
                        style={styles.copyButton}
                        onPress={() => handleCopy(tweet, index)}
                      >
                        {copiedIndex === index ? (
                          <Check size={18} color={Colors.success} />
                        ) : (
                          <Copy size={18} color={Colors.textSecondary} />
                        )}
                      </TouchableOpacity>
                    </View>
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
    minHeight: 80,
    paddingTop: 14,
  },
  styleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  styleChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  styleChipActive: {
    backgroundColor: '#1DA1F2',
    borderColor: '#1DA1F2',
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
    backgroundColor: '#1DA1F2',
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
  tweetCard: {
    backgroundColor: Colors.bgPrimary,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#1DA1F2',
  },
  tweetText: {
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 22,
    marginBottom: 10,
  },
  tweetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  charCount: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  charCountOver: {
    color: Colors.error,
  },
  copyButton: {
    padding: 4,
  },
});
