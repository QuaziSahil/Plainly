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
import { Globe, Copy, Check, Sparkles, RefreshCw } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '@/constants/Colors';
import { askGroq, OfflineError } from '@/services/groqAI';
import { useStorageStore } from '@/stores/useStorageStore';
import ToolHeader from '@/components/ToolHeader';

const META_TYPES = [
  { id: 'homepage', label: '🏠 Homepage' },
  { id: 'product', label: '🛒 Product Page' },
  { id: 'blog', label: '📝 Blog Post' },
  { id: 'service', label: '🛠️ Service Page' },
  { id: 'landing', label: '🎯 Landing Page' },
  { id: 'about', label: '👤 About Page' },
];

export default function AIMetaDescriptionScreen() {
  const insets = useSafeAreaInsets();
  const { addToHistory } = useStorageStore();
  const scrollRef = useRef<ScrollView>(null);

  const [pageTitle, setPageTitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [pageType, setPageType] = useState('homepage');
  const [descriptions, setDescriptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState('');

  const generateDescriptions = async () => {
    if (!pageTitle.trim()) {
      setError('Please enter your page title or topic');
      return;
    }

    setLoading(true);
    setError('');
    setDescriptions([]);

    try {
      const selectedType = META_TYPES.find(t => t.id === pageType)?.label.split(' ')[1] || 'page';
      const keywordsPart = keywords.trim() ? `\nTarget keywords: ${keywords}` : '';

      const prompt = `Write 3 SEO-optimized meta descriptions for a ${selectedType} about "${pageTitle}".${keywordsPart}

Requirements:
- 150-160 characters each (this is critical for SEO)
- Include primary keyword naturally
- Compelling and action-oriented
- Include a call-to-action
- Unique selling proposition where relevant
- No keyword stuffing

Format: Return only the 3 descriptions, numbered 1-3. Include character count for each.`;

      const systemPrompt = 'You are an SEO expert who writes compelling meta descriptions that improve click-through rates. Focus on being concise (150-160 chars) and compelling.';

      const response = await askGroq(prompt, systemPrompt, {
        temperature: 0.7,
        maxTokens: 500,
      });

      const lines = response.split('\n')
        .map(line => line.replace(/^\d+[\.\)]\s*/, '').replace(/\(\d+ characters?\)/gi, '').trim())
        .filter(line => line.length > 30)
        .slice(0, 3);

      setDescriptions(lines);

      addToHistory({
        path: '/ai-meta-description-generator',
        name: 'AI Meta Description',
        result: `${lines.length} descriptions generated`,
        type: 'ai',
      });

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err: any) {
      if (err instanceof OfflineError || err.name === 'OfflineError') {
        setError('No internet connection. Please check your network.');
      } else {
        setError('Failed to generate descriptions. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (description: string, index: number) => {
    await Clipboard.setStringAsync(description);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleReset = () => {
    setPageTitle('');
    setKeywords('');
    setPageType('homepage');
    setDescriptions([]);
    setError('');
  };

  const getCharCount = (text: string) => text.length;
  const getCharColor = (count: number) => {
    if (count < 150) return Colors.warning;
    if (count > 160) return Colors.error;
    return Colors.success;
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ToolHeader title="AI Meta Description" toolId="ai-meta-description-generator" onRefresh={handleReset} />

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
              <Text style={styles.label}>Page Title / Topic *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Best Running Shoes 2024, Web Design Services..."
                placeholderTextColor={Colors.textMuted}
                value={pageTitle}
                onChangeText={setPageTitle}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Target Keywords (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., running shoes, comfortable, lightweight..."
                placeholderTextColor={Colors.textMuted}
                value={keywords}
                onChangeText={setKeywords}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Page Type</Text>
              <View style={styles.typeGrid}>
                {META_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[styles.typeChip, pageType === type.id && styles.typeChipActive]}
                    onPress={() => setPageType(type.id)}
                  >
                    <Text style={[styles.typeText, pageType === type.id && styles.typeTextActive]}>
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
              onPress={generateDescriptions}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Globe size={20} color="#fff" />
                  <Text style={styles.generateButtonText}>Generate Descriptions</Text>
                </>
              )}
            </TouchableOpacity>

            {descriptions.length > 0 ? (
              <View style={styles.resultContainer}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle}>Meta Descriptions</Text>
                  <TouchableOpacity onPress={generateDescriptions}>
                    <RefreshCw size={18} color={Colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                <View style={styles.charGuide}>
                  <Text style={styles.charGuideText}>
                    Optimal: 150-160 characters • 🟢 Good • 🟡 Short • 🔴 Long
                  </Text>
                </View>
                {descriptions.map((desc, index) => (
                  <View key={index} style={styles.descCard}>
                    <Text style={styles.descText}>{desc}</Text>
                    <View style={styles.descFooter}>
                      <Text style={[styles.charCount, { color: getCharColor(getCharCount(desc)) }]}>
                        {getCharCount(desc)} characters
                      </Text>
                      <TouchableOpacity
                        style={styles.copyButton}
                        onPress={() => handleCopy(desc, index)}
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
    marginBottom: 8,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  charGuide: {
    marginBottom: 12,
  },
  charGuideText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  descCard: {
    backgroundColor: Colors.bgPrimary,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  descText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 22,
    marginBottom: 10,
  },
  descFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  charCount: {
    fontSize: 12,
    fontWeight: '500',
  },
  copyButton: {
    padding: 4,
  },
});
