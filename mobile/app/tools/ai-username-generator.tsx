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
import { User, Copy, Check, Sparkles, RefreshCw } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '@/constants/Colors';
import { askGroq, OfflineError } from '@/services/groqAI';
import { useStorageStore } from '@/stores/useStorageStore';
import ToolHeader from '@/components/ToolHeader';

const USERNAME_STYLES = [
  { id: 'gaming', label: '🎮 Gaming', emoji: '🎮' },
  { id: 'professional', label: '💼 Professional', emoji: '💼' },
  { id: 'creative', label: '🎨 Creative', emoji: '🎨' },
  { id: 'funny', label: '😄 Funny', emoji: '😄' },
  { id: 'aesthetic', label: '✨ Aesthetic', emoji: '✨' },
  { id: 'random', label: '🎲 Random', emoji: '🎲' },
];

export default function AIUsernameGeneratorScreen() {
  const insets = useSafeAreaInsets();
  const { addToHistory } = useStorageStore();
  const scrollRef = useRef<ScrollView>(null);

  const [name, setName] = useState('');
  const [interests, setInterests] = useState('');
  const [style, setStyle] = useState('creative');
  const [usernames, setUsernames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState('');

  const generateUsernames = async () => {
    if (!name.trim() && !interests.trim()) {
      setError('Please enter your name or interests');
      return;
    }

    setLoading(true);
    setError('');
    setUsernames([]);

    try {
      const selectedStyle = USERNAME_STYLES.find(s => s.id === style)?.label.split(' ')[1] || 'creative';
      const namePart = name.trim() ? `based on the name "${name}"` : '';
      const interestPart = interests.trim() ? ` with interests in ${interests}` : '';

      const prompt = `Generate 10 unique ${selectedStyle} usernames ${namePart}${interestPart}.

Requirements:
- Make them unique and memorable
- Between 4-16 characters when possible
- Mix of letters, numbers, and underscores allowed
- No inappropriate content
- Should be available-sounding (not generic)

Format: Return only the 10 usernames, one per line, numbered 1-10. No explanations.`;

      const systemPrompt = 'You are a creative username generator. Create unique, memorable usernames. Return only the numbered list, nothing else.';

      const response = await askGroq(prompt, systemPrompt, {
        temperature: 0.9,
        maxTokens: 300,
      });

      const lines = response.split('\n')
        .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim())
        .filter(line => line.length > 0 && line.length <= 30)
        .slice(0, 10);

      setUsernames(lines);

      addToHistory({
        path: '/ai-username-generator',
        name: 'AI Username Generator',
        result: `${lines.length} usernames generated`,
        type: 'ai',
      });

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err: any) {
      if (err instanceof OfflineError || err.name === 'OfflineError') {
        setError('No internet connection. Please check your network.');
      } else {
        setError('Failed to generate usernames. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (username: string, index: number) => {
    await Clipboard.setStringAsync(username);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleReset = () => {
    setName('');
    setInterests('');
    setStyle('creative');
    setUsernames([]);
    setError('');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ToolHeader title="AI Username Generator" toolId="ai-username-generator" onRefresh={handleReset} />

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
              <Text style={styles.label}>Your Name (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Alex, Shadow, Max..."
                placeholderTextColor={Colors.textMuted}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Interests/Keywords (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Gaming, Art, Music, Tech..."
                placeholderTextColor={Colors.textMuted}
                value={interests}
                onChangeText={setInterests}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Style</Text>
              <View style={styles.styleGrid}>
                {USERNAME_STYLES.map((s) => (
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
              onPress={generateUsernames}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <User size={20} color="#fff" />
                  <Text style={styles.generateButtonText}>Generate Usernames</Text>
                </>
              )}
            </TouchableOpacity>

            {usernames.length > 0 ? (
              <View style={styles.resultContainer}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle}>Generated Usernames</Text>
                  <TouchableOpacity onPress={generateUsernames}>
                    <RefreshCw size={18} color={Colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                <View style={styles.usernameGrid}>
                  {usernames.map((username, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.usernameCard}
                      onPress={() => handleCopy(username, index)}
                    >
                      <Text style={styles.usernameText}>{username}</Text>
                      {copiedIndex === index ? (
                        <Check size={16} color={Colors.success} />
                      ) : (
                        <Copy size={16} color={Colors.textMuted} />
                      )}
                    </TouchableOpacity>
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
  usernameGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  usernameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgPrimary,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  usernameText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
});
