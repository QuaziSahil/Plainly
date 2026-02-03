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
import { Linkedin, Copy, Check, Sparkles, RefreshCw } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '@/constants/Colors';
import { askGroq, OfflineError } from '@/services/groqAI';
import { useStorageStore } from '@/stores/useStorageStore';
import ToolHeader from '@/components/ToolHeader';
import AIOutputFormatter from '@/components/AIOutputFormatter';

const POST_TYPES = [
  { id: 'thought-leadership', label: '💡 Thought Leadership' },
  { id: 'career-advice', label: '🎯 Career Advice' },
  { id: 'industry-news', label: '📰 Industry News' },
  { id: 'personal-story', label: '📖 Personal Story' },
  { id: 'celebration', label: '🎉 Celebration' },
  { id: 'how-to', label: '📋 How-To' },
];

export default function AILinkedInPostScreen() {
  const insets = useSafeAreaInsets();
  const { addToHistory } = useStorageStore();
  const scrollRef = useRef<ScrollView>(null);

  const [topic, setTopic] = useState('');
  const [postType, setPostType] = useState('thought-leadership');
  const [post, setPost] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const generatePost = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic for your post');
      return;
    }

    setLoading(true);
    setError('');
    setPost('');

    try {
      const selectedType = POST_TYPES.find(t => t.id === postType)?.label.split(' ').slice(1).join(' ') || 'thought leadership';

      const prompt = `Write a LinkedIn ${selectedType} post about "${topic}".

Requirements:
- Start with a hook that grabs attention
- Use short paragraphs (1-2 sentences each)
- Include line breaks for readability
- Add 3-5 relevant hashtags at the end
- Include a call-to-action (question or invite to comment)
- Professional but personable tone
- 150-300 words

Format the post for LinkedIn with proper spacing and line breaks.`;

      const systemPrompt = 'You are a LinkedIn content strategist who creates viral, engaging posts. Write only the post content with hashtags.';

      const response = await askGroq(prompt, systemPrompt, {
        temperature: 0.8,
        maxTokens: 600,
      });

      setPost(response.trim());

      addToHistory({
        path: '/ai-linkedin-post-generator',
        name: 'AI LinkedIn Post',
        result: `${selectedType} post generated`,
        type: 'ai',
      });

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err: any) {
      if (err instanceof OfflineError || err.name === 'OfflineError') {
        setError('No internet connection. Please check your network.');
      } else {
        setError('Failed to generate post. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(post);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setTopic('');
    setPostType('thought-leadership');
    setPost('');
    setError('');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ToolHeader title="AI LinkedIn Post" toolId="ai-linkedin-post-generator" onRefresh={handleReset} />

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
                placeholder="e.g., Leadership lessons, Career pivot, Industry trend..."
                placeholderTextColor={Colors.textMuted}
                value={topic}
                onChangeText={setTopic}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Post Type</Text>
              <View style={styles.typeGrid}>
                {POST_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[styles.typeChip, postType === type.id && styles.typeChipActive]}
                    onPress={() => setPostType(type.id)}
                  >
                    <Text style={[styles.typeText, postType === type.id && styles.typeTextActive]}>
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
              onPress={generatePost}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Linkedin size={20} color="#fff" />
                  <Text style={styles.generateButtonText}>Generate Post</Text>
                </>
              )}
            </TouchableOpacity>

            {post ? (
              <View style={styles.resultContainer}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle}>Your LinkedIn Post</Text>
                  <View style={styles.resultActions}>
                    <TouchableOpacity onPress={generatePost} style={styles.actionButton}>
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
                <View style={styles.postContent}>
                  <AIOutputFormatter text={post} />
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
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  typeChipActive: {
    backgroundColor: '#0A66C2',
    borderColor: '#0A66C2',
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
    backgroundColor: '#0A66C2',
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
  postContent: {
    backgroundColor: Colors.bgPrimary,
    borderRadius: 10,
    padding: 16,
  },
});
