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
import { Megaphone, Copy, Check, Sparkles, RefreshCw } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '@/constants/Colors';
import { askGroq, OfflineError } from '@/services/groqAI';
import { useStorageStore } from '@/stores/useStorageStore';
import ToolHeader from '@/components/ToolHeader';

const SLOGAN_STYLES = [
  { id: 'catchy', label: 'Catchy' },
  { id: 'professional', label: 'Professional' },
  { id: 'funny', label: 'Funny' },
  { id: 'inspirational', label: 'Inspirational' },
  { id: 'minimalist', label: 'Minimalist' },
  { id: 'bold', label: 'Bold' },
];

export default function AISloganGeneratorScreen() {
  const insets = useSafeAreaInsets();
  const { addToHistory } = useStorageStore();
  const scrollRef = useRef<ScrollView>(null);

  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [style, setStyle] = useState('catchy');
  const [slogans, setSlogans] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState('');

  const generateSlogans = async () => {
    if (!businessName.trim()) {
      setError('Please enter your business name');
      return;
    }

    setLoading(true);
    setError('');
    setSlogans([]);

    try {
      const selectedStyle = SLOGAN_STYLES.find(s => s.id === style)?.label || 'catchy';
      const industryPart = industry.trim() ? ` in the ${industry} industry` : '';

      const prompt = `Generate 5 ${selectedStyle} slogans for "${businessName}"${industryPart}.

Requirements:
- Make them memorable and unique
- Keep them short (5-10 words max)
- Capture the brand essence
- Be creative and original

Format: Return only the 5 slogans, one per line, numbered 1-5.`;

      const systemPrompt = 'You are an expert brand strategist and copywriter. Generate memorable slogans. Return only the numbered slogans, nothing else.';

      const response = await askGroq(prompt, systemPrompt, {
        temperature: 0.8,
        maxTokens: 300,
      });

      const lines = response.split('\n')
        .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim())
        .filter(line => line.length > 0)
        .slice(0, 5);

      setSlogans(lines);

      addToHistory({
        path: '/ai-slogan-generator',
        name: 'AI Slogan Generator',
        result: `${lines.length} slogans generated`,
        type: 'ai',
      });

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err: any) {
      if (err instanceof OfflineError || err.name === 'OfflineError') {
        setError('No internet connection. Please check your network.');
      } else {
        setError('Failed to generate slogans. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (slogan: string, index: number) => {
    await Clipboard.setStringAsync(slogan);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleReset = () => {
    setBusinessName('');
    setIndustry('');
    setStyle('catchy');
    setSlogans([]);
    setError('');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ToolHeader title="AI Slogan Generator" toolId="ai-slogan-generator" onRefresh={handleReset} />

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
              <Text style={styles.label}>Business/Brand Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., TechFlow, Green Eats..."
                placeholderTextColor={Colors.textMuted}
                value={businessName}
                onChangeText={setBusinessName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Industry (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Technology, Food, Fashion..."
                placeholderTextColor={Colors.textMuted}
                value={industry}
                onChangeText={setIndustry}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Style</Text>
              <View style={styles.styleGrid}>
                {SLOGAN_STYLES.map((s) => (
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
              onPress={generateSlogans}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Megaphone size={20} color="#fff" />
                  <Text style={styles.generateButtonText}>Generate Slogans</Text>
                </>
              )}
            </TouchableOpacity>

            {slogans.length > 0 ? (
              <View style={styles.resultContainer}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle}>Generated Slogans</Text>
                  <TouchableOpacity onPress={generateSlogans}>
                    <RefreshCw size={18} color={Colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                {slogans.map((slogan, index) => (
                  <View key={index} style={styles.sloganCard}>
                    <Text style={styles.sloganText}>{slogan}</Text>
                    <TouchableOpacity
                      style={styles.copyButton}
                      onPress={() => handleCopy(slogan, index)}
                    >
                      {copiedIndex === index ? (
                        <Check size={18} color={Colors.success} />
                      ) : (
                        <Copy size={18} color={Colors.textSecondary} />
                      )}
                    </TouchableOpacity>
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
  styleGrid: {
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
  sloganCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgPrimary,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  sloganText: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  copyButton: {
    padding: 8,
    marginLeft: 8,
  },
});
