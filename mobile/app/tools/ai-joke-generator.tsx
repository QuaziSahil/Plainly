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
import { Laugh, Copy, Check, Sparkles, RefreshCw } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '@/constants/Colors';
import { askGroq, OfflineError } from '@/services/groqAI';
import { useStorageStore } from '@/stores/useStorageStore';
import ToolHeader from '@/components/ToolHeader';

const JOKE_TYPES = [
  { id: 'general', label: 'General', emoji: '😄' },
  { id: 'pun', label: 'Puns', emoji: '🤣' },
  { id: 'dad', label: 'Dad Jokes', emoji: '👨' },
  { id: 'tech', label: 'Tech/Programming', emoji: '💻' },
  { id: 'dark', label: 'Dark Humor', emoji: '🌑' },
  { id: 'oneliners', label: 'One-Liners', emoji: '☝️' },
];

export default function AIJokeGeneratorScreen() {
  const insets = useSafeAreaInsets();
  const { addToHistory } = useStorageStore();
  const scrollRef = useRef<ScrollView>(null);

  const [topic, setTopic] = useState('');
  const [jokeType, setJokeType] = useState('general');
  const [joke, setJoke] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const generateJoke = async () => {
    setLoading(true);
    setError('');
    setJoke('');

    try {
      const selectedType = JOKE_TYPES.find(t => t.id === jokeType)?.label || 'general';
      const topicPart = topic.trim() ? ` about "${topic}"` : '';

      const prompt = `Generate a funny ${selectedType} joke${topicPart}.

Requirements:
- Make it genuinely funny and clever
- Keep it appropriate
- Be original and creative
- For puns, make the wordplay clear
- For dad jokes, make them groan-worthy`;

      const systemPrompt = 'You are a professional comedian. Generate one funny joke. Return only the joke, nothing else.';

      const response = await askGroq(prompt, systemPrompt, {
        temperature: 0.9,
        maxTokens: 300,
      });

      setJoke(response.trim());

      addToHistory({
        path: '/ai-joke-generator',
        name: 'AI Joke Generator',
        result: `${selectedType} joke generated`,
        type: 'ai',
      });

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err: any) {
      if (err instanceof OfflineError || err.name === 'OfflineError') {
        setError('No internet connection. Please check your network.');
      } else {
        setError('Failed to generate joke. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(joke);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setTopic('');
    setJokeType('general');
    setJoke('');
    setError('');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ToolHeader title="AI Joke Generator" toolId="ai-joke-generator" onRefresh={handleReset} />

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
              <Text style={styles.label}>Topic (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., cats, programming, coffee..."
                placeholderTextColor={Colors.textMuted}
                value={topic}
                onChangeText={setTopic}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Joke Type</Text>
              <View style={styles.typeGrid}>
                {JOKE_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[styles.typeChip, jokeType === type.id && styles.typeChipActive]}
                    onPress={() => setJokeType(type.id)}
                  >
                    <Text style={styles.typeEmoji}>{type.emoji}</Text>
                    <Text style={[styles.typeText, jokeType === type.id && styles.typeTextActive]}>
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
              onPress={generateJoke}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Laugh size={20} color="#fff" />
                  <Text style={styles.generateButtonText}>Generate Joke</Text>
                </>
              )}
            </TouchableOpacity>

            {joke ? (
              <View style={styles.resultContainer}>
                <View style={styles.jokeCard}>
                  <Text style={styles.jokeText}>{joke}</Text>
                </View>
                <View style={styles.resultActions}>
                  <TouchableOpacity style={styles.actionButton} onPress={handleCopy}>
                    {copied ? (
                      <Check size={20} color={Colors.success} />
                    ) : (
                      <Copy size={20} color={Colors.textSecondary} />
                    )}
                    <Text style={styles.actionText}>{copied ? 'Copied!' : 'Copy'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton} onPress={generateJoke}>
                    <RefreshCw size={20} color={Colors.textSecondary} />
                    <Text style={styles.actionText}>New Joke</Text>
                  </TouchableOpacity>
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
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
    gap: 6,
  },
  typeChipActive: {
    backgroundColor: Colors.accentPrimary,
    borderColor: Colors.accentPrimary,
  },
  typeEmoji: {
    fontSize: 16,
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
  jokeCard: {
    backgroundColor: Colors.bgPrimary,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  jokeText: {
    fontSize: 18,
    color: Colors.textPrimary,
    lineHeight: 28,
    textAlign: 'center',
  },
  resultActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
  },
  actionText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
