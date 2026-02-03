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
import { Package, Copy, Check, Sparkles, RefreshCw } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '@/constants/Colors';
import { askGroq, OfflineError } from '@/services/groqAI';
import { useStorageStore } from '@/stores/useStorageStore';
import ToolHeader from '@/components/ToolHeader';
import AIOutputFormatter from '@/components/AIOutputFormatter';

const DESCRIPTION_TONES = [
  { id: 'professional', label: '💼 Professional' },
  { id: 'friendly', label: '😊 Friendly' },
  { id: 'luxury', label: '✨ Luxury' },
  { id: 'playful', label: '🎉 Playful' },
  { id: 'technical', label: '🔧 Technical' },
  { id: 'minimal', label: '📝 Minimal' },
];

const PLATFORMS = [
  { id: 'amazon', label: 'Amazon' },
  { id: 'shopify', label: 'Shopify' },
  { id: 'etsy', label: 'Etsy' },
  { id: 'general', label: 'General' },
];

export default function AIProductDescriptionScreen() {
  const insets = useSafeAreaInsets();
  const { addToHistory } = useStorageStore();
  const scrollRef = useRef<ScrollView>(null);

  const [productName, setProductName] = useState('');
  const [features, setFeatures] = useState('');
  const [tone, setTone] = useState('professional');
  const [platform, setPlatform] = useState('general');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const generateDescription = async () => {
    if (!productName.trim()) {
      setError('Please enter the product name');
      return;
    }

    setLoading(true);
    setError('');
    setDescription('');

    try {
      const selectedTone = DESCRIPTION_TONES.find(t => t.id === tone)?.label.split(' ')[1] || 'professional';
      const featuresPart = features.trim() ? `\nKey features: ${features}` : '';

      const prompt = `Write a compelling product description for "${productName}".${featuresPart}

Requirements:
- Tone: ${selectedTone}
- Platform: ${platform === 'amazon' ? 'Amazon listing (with bullet points)' : platform === 'etsy' ? 'Etsy (creative and artisan-focused)' : platform === 'shopify' ? 'Shopify store (conversion-focused)' : 'General e-commerce'}
- Include a catchy headline
- Highlight benefits, not just features
- ${platform === 'amazon' ? 'Include 5 bullet points for key features' : ''}
- Add a brief call-to-action
- SEO-friendly keywords naturally integrated
- 150-250 words

Format appropriately for ${platform} listings.`;

      const systemPrompt = 'You are an expert e-commerce copywriter who writes high-converting product descriptions. Create compelling, benefit-focused descriptions.';

      const response = await askGroq(prompt, systemPrompt, {
        temperature: 0.75,
        maxTokens: 600,
      });

      setDescription(response.trim());

      addToHistory({
        path: '/ai-product-description-generator',
        name: 'AI Product Description',
        result: `Description for ${productName}`,
        type: 'ai',
      });

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err: any) {
      if (err instanceof OfflineError || err.name === 'OfflineError') {
        setError('No internet connection. Please check your network.');
      } else {
        setError('Failed to generate description. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(description);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setProductName('');
    setFeatures('');
    setTone('professional');
    setPlatform('general');
    setDescription('');
    setError('');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ToolHeader title="AI Product Description" toolId="ai-product-description-generator" onRefresh={handleReset} />

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
              <Text style={styles.label}>Product Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Wireless Bluetooth Headphones"
                placeholderTextColor={Colors.textMuted}
                value={productName}
                onChangeText={setProductName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Key Features (Optional)</Text>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                placeholder="e.g., 40hr battery, noise cancelling, leather cushions..."
                placeholderTextColor={Colors.textMuted}
                value={features}
                onChangeText={setFeatures}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tone</Text>
              <View style={styles.optionGrid}>
                {DESCRIPTION_TONES.map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    style={[styles.optionChip, tone === t.id && styles.optionChipActive]}
                    onPress={() => setTone(t.id)}
                  >
                    <Text style={[styles.optionText, tone === t.id && styles.optionTextActive]}>
                      {t.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Platform</Text>
              <View style={styles.platformRow}>
                {PLATFORMS.map((p) => (
                  <TouchableOpacity
                    key={p.id}
                    style={[styles.platformChip, platform === p.id && styles.platformChipActive]}
                    onPress={() => setPlatform(p.id)}
                  >
                    <Text style={[styles.platformText, platform === p.id && styles.platformTextActive]}>
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
              onPress={generateDescription}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Package size={20} color="#fff" />
                  <Text style={styles.generateButtonText}>Generate Description</Text>
                </>
              )}
            </TouchableOpacity>

            {description ? (
              <View style={styles.resultContainer}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle}>Product Description</Text>
                  <View style={styles.resultActions}>
                    <TouchableOpacity onPress={generateDescription} style={styles.actionButton}>
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
                <View style={styles.descriptionContent}>
                  <AIOutputFormatter text={description} />
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
  platformRow: {
    flexDirection: 'row',
    gap: 10,
  },
  platformChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
    alignItems: 'center',
  },
  platformChipActive: {
    backgroundColor: Colors.accentPrimary,
    borderColor: Colors.accentPrimary,
  },
  platformText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  platformTextActive: {
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
  descriptionContent: {
    backgroundColor: Colors.bgPrimary,
    borderRadius: 10,
    padding: 16,
  },
});
