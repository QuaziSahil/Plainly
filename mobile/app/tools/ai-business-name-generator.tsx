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
import { Building2, Copy, Check, Sparkles, RefreshCw } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '@/constants/Colors';
import { askGroq, OfflineError } from '@/services/groqAI';
import { useStorageStore } from '@/stores/useStorageStore';
import ToolHeader from '@/components/ToolHeader';

const BUSINESS_TYPES = [
  { id: 'tech', label: '💻 Tech' },
  { id: 'food', label: '🍔 Food' },
  { id: 'fashion', label: '👗 Fashion' },
  { id: 'health', label: '🏥 Health' },
  { id: 'finance', label: '💰 Finance' },
  { id: 'creative', label: '🎨 Creative' },
  { id: 'retail', label: '🛒 Retail' },
  { id: 'service', label: '🛠️ Service' },
];

const NAME_STYLES = [
  { id: 'modern', label: 'Modern' },
  { id: 'classic', label: 'Classic' },
  { id: 'playful', label: 'Playful' },
  { id: 'abstract', label: 'Abstract' },
];

export default function AIBusinessNameScreen() {
  const insets = useSafeAreaInsets();
  const { addToHistory } = useStorageStore();
  const scrollRef = useRef<ScrollView>(null);

  const [keywords, setKeywords] = useState('');
  const [businessType, setBusinessType] = useState('tech');
  const [nameStyle, setNameStyle] = useState('modern');
  const [names, setNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState('');

  const generateNames = async () => {
    setLoading(true);
    setError('');
    setNames([]);

    try {
      const selectedType = BUSINESS_TYPES.find(t => t.id === businessType)?.label.split(' ')[1] || 'tech';
      const selectedStyle = NAME_STYLES.find(s => s.id === nameStyle)?.label || 'modern';
      const keywordsPart = keywords.trim() ? ` incorporating these concepts: ${keywords}` : '';

      const prompt = `Generate 10 creative ${selectedStyle} business name ideas for a ${selectedType} company${keywordsPart}.

Requirements:
- Short and memorable (1-3 words max)
- Easy to pronounce and spell
- Domain-friendly (check if it could work as .com)
- Unique and brandable
- Mix of different approaches (compound words, invented words, real words)
- No generic or overused terms
- Avoid names that are too similar to existing big brands

Format: Return only the 10 names, numbered 1-10. No explanations.`;

      const systemPrompt = 'You are a branding expert who creates memorable business names. Generate unique, brandable names only.';

      const response = await askGroq(prompt, systemPrompt, {
        temperature: 0.9,
        maxTokens: 400,
      });

      const lines = response.split('\n')
        .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim())
        .filter(line => line.length > 0 && line.length <= 30)
        .slice(0, 10);

      setNames(lines);

      addToHistory({
        path: '/ai-business-name-generator',
        name: 'AI Business Name',
        result: `${lines.length} names generated`,
        type: 'ai',
      });

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err: any) {
      if (err instanceof OfflineError || err.name === 'OfflineError') {
        setError('No internet connection. Please check your network.');
      } else {
        setError('Failed to generate names. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (name: string, index: number) => {
    await Clipboard.setStringAsync(name);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleReset = () => {
    setKeywords('');
    setBusinessType('tech');
    setNameStyle('modern');
    setNames([]);
    setError('');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ToolHeader title="AI Business Name" toolId="ai-business-name-generator" onRefresh={handleReset} />

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
              <Text style={styles.label}>Business Type</Text>
              <View style={styles.typeGrid}>
                {BUSINESS_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[styles.typeChip, businessType === type.id && styles.typeChipActive]}
                    onPress={() => setBusinessType(type.id)}
                  >
                    <Text style={[styles.typeText, businessType === type.id && styles.typeTextActive]}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name Style</Text>
              <View style={styles.styleRow}>
                {NAME_STYLES.map((style) => (
                  <TouchableOpacity
                    key={style.id}
                    style={[styles.styleChip, nameStyle === style.id && styles.styleChipActive]}
                    onPress={() => setNameStyle(style.id)}
                  >
                    <Text style={[styles.styleText, nameStyle === style.id && styles.styleTextActive]}>
                      {style.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Keywords / Concepts (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., speed, innovation, cloud, eco-friendly..."
                placeholderTextColor={Colors.textMuted}
                value={keywords}
                onChangeText={setKeywords}
              />
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.generateButton, loading && styles.generateButtonDisabled]}
              onPress={generateNames}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Building2 size={20} color="#fff" />
                  <Text style={styles.generateButtonText}>Generate Names</Text>
                </>
              )}
            </TouchableOpacity>

            {names.length > 0 ? (
              <View style={styles.resultContainer}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle}>Business Name Ideas</Text>
                  <TouchableOpacity onPress={generateNames}>
                    <RefreshCw size={18} color={Colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                <View style={styles.nameGrid}>
                  {names.map((name, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.nameCard}
                      onPress={() => handleCopy(name, index)}
                    >
                      <Text style={styles.nameText}>{name}</Text>
                      {copiedIndex === index ? (
                        <Check size={16} color={Colors.success} />
                      ) : (
                        <Copy size={16} color={Colors.textMuted} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.tipText}>
                  💡 Tap a name to copy it
                </Text>
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
  styleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  styleChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
    alignItems: 'center',
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
  nameGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  nameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgPrimary,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
  },
  nameText: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  tipText: {
    marginTop: 12,
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
