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
import { FileEdit, Copy, Check, Sparkles, RefreshCw } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '@/constants/Colors';
import { askGroq, OfflineError } from '@/services/groqAI';
import { useStorageStore } from '@/stores/useStorageStore';
import ToolHeader from '@/components/ToolHeader';
import AIOutputFormatter from '@/components/AIOutputFormatter';

const BLOG_TYPES = [
  { id: 'how-to', label: '📋 How-To' },
  { id: 'listicle', label: '📝 Listicle' },
  { id: 'opinion', label: '💭 Opinion' },
  { id: 'news', label: '📰 News' },
  { id: 'review', label: '⭐ Review' },
  { id: 'story', label: '📖 Story' },
];

const BLOG_LENGTHS = [
  { id: 'short', label: 'Short (~300 words)' },
  { id: 'medium', label: 'Medium (~500 words)' },
  { id: 'long', label: 'Long (~800 words)' },
];

export default function AIBlogPostScreen() {
  const insets = useSafeAreaInsets();
  const { addToHistory } = useStorageStore();
  const scrollRef = useRef<ScrollView>(null);

  const [topic, setTopic] = useState('');
  const [blogType, setBlogType] = useState('how-to');
  const [length, setLength] = useState('medium');
  const [blogPost, setBlogPost] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const generateBlogPost = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic for your blog post');
      return;
    }

    setLoading(true);
    setError('');
    setBlogPost('');

    try {
      const selectedType = BLOG_TYPES.find(t => t.id === blogType)?.label.split(' ')[1] || 'how-to';
      const selectedLength = BLOG_LENGTHS.find(l => l.id === length);
      const wordCount = length === 'short' ? '300' : length === 'medium' ? '500' : '800';

      const prompt = `Write a ${selectedType} blog post about "${topic}".

Requirements:
- Length: approximately ${wordCount} words
- Engaging headline/title
- Clear introduction that hooks the reader
- Well-structured body with subheadings
- ${blogType === 'listicle' ? 'Use numbered or bullet points' : ''}
- ${blogType === 'how-to' ? 'Include step-by-step instructions' : ''}
- Strong conclusion with call-to-action
- SEO-friendly (include relevant keywords naturally)
- Conversational but professional tone

Format with proper headings using markdown (# for title, ## for sections).`;

      const systemPrompt = 'You are an expert content writer who creates engaging, SEO-optimized blog posts. Write in a conversational yet professional tone.';

      const response = await askGroq(prompt, systemPrompt, {
        temperature: 0.75,
        maxTokens: length === 'short' ? 800 : length === 'medium' ? 1200 : 1800,
      });

      setBlogPost(response.trim());

      addToHistory({
        path: '/ai-blog-post-generator',
        name: 'AI Blog Post',
        result: `${selectedType} post about ${topic}`,
        type: 'ai',
      });

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err: any) {
      if (err instanceof OfflineError || err.name === 'OfflineError') {
        setError('No internet connection. Please check your network.');
      } else {
        setError('Failed to generate blog post. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(blogPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setTopic('');
    setBlogType('how-to');
    setLength('medium');
    setBlogPost('');
    setError('');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ToolHeader title="AI Blog Post" toolId="ai-blog-post-generator" onRefresh={handleReset} />

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
              <Text style={styles.label}>Topic *</Text>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                placeholder="e.g., 10 Ways to Improve Productivity, How to Start a Podcast..."
                placeholderTextColor={Colors.textMuted}
                value={topic}
                onChangeText={setTopic}
                multiline
                numberOfLines={2}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Post Type</Text>
              <View style={styles.typeGrid}>
                {BLOG_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[styles.typeChip, blogType === type.id && styles.typeChipActive]}
                    onPress={() => setBlogType(type.id)}
                  >
                    <Text style={[styles.typeText, blogType === type.id && styles.typeTextActive]}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Length</Text>
              <View style={styles.lengthRow}>
                {BLOG_LENGTHS.map((l) => (
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
              onPress={generateBlogPost}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <FileEdit size={20} color="#fff" />
                  <Text style={styles.generateButtonText}>Generate Blog Post</Text>
                </>
              )}
            </TouchableOpacity>

            {blogPost ? (
              <View style={styles.resultContainer}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle}>Your Blog Post</Text>
                  <View style={styles.resultActions}>
                    <TouchableOpacity onPress={generateBlogPost} style={styles.actionButton}>
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
                  <AIOutputFormatter text={blogPost} />
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
    minHeight: 80,
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
    backgroundColor: Colors.accentPrimary,
    borderColor: Colors.accentPrimary,
  },
  typeText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  typeTextActive: {
    color: '#fff',
  },
  lengthRow: {
    gap: 10,
  },
  lengthChip: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
    marginBottom: 8,
  },
  lengthChipActive: {
    backgroundColor: Colors.accentPrimary,
    borderColor: Colors.accentPrimary,
  },
  lengthText: {
    fontSize: 14,
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
  postContent: {
    backgroundColor: Colors.bgPrimary,
    borderRadius: 10,
    padding: 16,
  },
});
