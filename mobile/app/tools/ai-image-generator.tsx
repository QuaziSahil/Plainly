import React, { useMemo, useRef, useState } from 'react';
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
  Image,
  Share,
  Linking,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Copy, Check, Sparkles, Wand2, Image as ImageIcon, Download, ExternalLink, Share2 } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '@/constants/Colors';
import { askGroq, OfflineError } from '@/services/groqAI';
import { generateImage, isConfigured } from '@/services/pollinationsAI';
import { useStorageStore } from '@/stores/useStorageStore';
import ToolHeader from '@/components/ToolHeader';

const STYLES = [
  { value: 'realistic', label: 'Realistic', prompt: 'ultra realistic, photorealistic, 8k, high detail, sharp focus' },
  { value: 'anime', label: 'Anime', prompt: 'anime style, vibrant colors, manga art, studio ghibli' },
  { value: 'digital-art', label: 'Digital Art', prompt: 'digital art, trending on artstation, vibrant, detailed' },
  { value: '3d-render', label: '3D Render', prompt: '3d render, octane render, cinema 4d, blender, realistic lighting' },
  { value: 'oil-painting', label: 'Oil Painting', prompt: 'oil painting, classical, renaissance style, detailed brushwork' },
  { value: 'watercolor', label: 'Watercolor', prompt: 'watercolor painting, soft colors, artistic, flowing' },
  { value: 'pixel-art', label: 'Pixel Art', prompt: 'pixel art, 16-bit, retro game style, detailed' },
  { value: 'cyberpunk', label: 'Cyberpunk', prompt: 'cyberpunk style, neon lights, futuristic city, dark atmosphere' },
  { value: 'fantasy', label: 'Fantasy', prompt: 'fantasy art, magical, ethereal, mystical, epic' },
  { value: 'minimalist', label: 'Minimalist', prompt: 'minimalist, clean, simple, modern design, elegant' },
  { value: 'comic', label: 'Comic Book', prompt: 'comic book style, bold lines, halftone dots, dynamic' },
  { value: 'vintage', label: 'Vintage', prompt: 'vintage style, retro, 1950s aesthetic, nostalgic' },
];

const ASPECT_RATIOS = [
  { value: '1:1', label: 'Square (1:1)', width: 1024, height: 1024, ratio: 1 },
  { value: '16:9', label: 'Landscape (16:9)', width: 1024, height: 576, ratio: 16 / 9 },
  { value: '9:16', label: 'Portrait (9:16)', width: 576, height: 1024, ratio: 9 / 16 },
  { value: '4:3', label: 'Standard (4:3)', width: 1024, height: 768, ratio: 4 / 3 },
  { value: '3:4', label: 'Portrait (3:4)', width: 768, height: 1024, ratio: 3 / 4 },
];

export default function AIImageGeneratorScreen() {
  const insets = useSafeAreaInsets();
  const { addToHistory } = useStorageStore();
  const scrollRef = useRef<ScrollView>(null);

  const [prompt, setPrompt] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const selectedRatio = useMemo(
    () => ASPECT_RATIOS.find(r => r.value === aspectRatio) || ASPECT_RATIOS[0],
    [aspectRatio]
  );

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt first');
      return;
    }

    setEnhancing(true);
    setError('');

    const selectedStyle = STYLES.find(s => s.value === style);
    const styleName = selectedStyle?.label || 'Realistic';

    const systemPrompt = `You are an expert AI image prompt engineer. Enhance the user's prompt to create better AI-generated images in the ${styleName} style.

Rules:
- The image MUST be in ${styleName} style
- Add style-specific details for ${styleName} (lighting, composition, mood, textures)
- Include quality boosters (8k, high detail, sharp focus)
- Keep the original intent but amplify it for ${styleName} aesthetic
- Return ONLY the enhanced prompt, no explanations
- Keep under 150 words
- Include ${styleName}-specific keywords and descriptors`;

    try {
      const enhanced = await askGroq(
        `Enhance this image prompt for ${styleName} style AI generation: "${prompt}"`,
        systemPrompt,
        { temperature: 0.7, maxTokens: 250 }
      );

      const enhancedText = enhanced.trim();
      setEnhancedPrompt(enhancedText);
      setPrompt(enhancedText);
      await Clipboard.setStringAsync(enhancedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err: any) {
      if (err instanceof OfflineError || err.name === 'OfflineError') {
        setError('No internet connection. Please check your network and try again.');
      } else {
        setError('Failed to enhance prompt. Please try again.');
      }
    } finally {
      setEnhancing(false);
    }
  };

  const handleGenerate = async () => {
    const finalPrompt = enhancedPrompt || prompt;
    if (!finalPrompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    if (!isConfigured()) {
      setError('Image generation service not configured');
      return;
    }

    setLoading(true);
    setError('');
    setImageUrl('');

    const selectedStyle = STYLES.find(s => s.value === style);

    const fullPrompt = `${finalPrompt}, ${selectedStyle?.prompt || ''}, masterpiece, best quality`;

    try {
      const url = await generateImage(fullPrompt, {
        width: selectedRatio.width,
        height: selectedRatio.height,
      });

      setImageUrl(url);

      addToHistory({
        path: '/ai-image-generator',
        name: 'AI Image Generator',
        result: 'Image generated',
        type: 'ai',
      });

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPrompt = async () => {
    const finalPrompt = enhancedPrompt || prompt;
    await Clipboard.setStringAsync(finalPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveImage = async () => {
    if (!imageUrl) return;

    try {
      // Open the image in browser so user can save it
      Alert.alert(
        'Save Image',
        'The image will open in your browser. Long-press on the image to save it to your device.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Open Image', 
            onPress: () => Linking.openURL(imageUrl)
          },
        ]
      );
    } catch (err: any) {
      setError('Failed to save image. Please try again.');
    }
  };

  const handleShareImage = async () => {
    if (!imageUrl) return;

    try {
      await Share.share({
        message: `Check out this image generated on Plainly Tools!`,
        url: imageUrl,
      });
    } catch (_error) {
      setError('Failed to share image. Please try again.');
    }
  };

  const handleOpenImage = () => {
    if (!imageUrl) return;
    Linking.openURL(imageUrl);
  };

  const handleReset = () => {
    setPrompt('');
    setEnhancedPrompt('');
    setStyle('realistic');
    setAspectRatio('1:1');
    setImageUrl('');
    setError('');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ToolHeader title="AI Image Generator" toolId="ai-image" onRefresh={handleReset} />

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
              <Text style={styles.label}>Describe Your Image *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="e.g., A majestic lion sitting on a throne in a grand palace..."
                placeholderTextColor={Colors.textMuted}
                value={prompt}
                onChangeText={setPrompt}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <TouchableOpacity
                style={[styles.enhanceButton, (enhancing || !prompt.trim()) && styles.enhanceButtonDisabled]}
                onPress={handleEnhancePrompt}
                disabled={enhancing || !prompt.trim()}
              >
                {enhancing ? (
                  <ActivityIndicator color={Colors.textPrimary} />
                ) : (
                  <Wand2 size={16} color={Colors.textPrimary} />
                )}
                <Text style={styles.enhanceButtonText}>
                  {enhancing ? 'Enhancing...' : 'Enhance Prompt with AI'}
                </Text>
              </TouchableOpacity>
            </View>

            {enhancedPrompt ? (
              <View style={styles.enhancedBox}>
                <View style={styles.enhancedHeader}>
                  <Text style={styles.enhancedTitle}>✨ Enhanced Prompt</Text>
                  <TouchableOpacity style={styles.copyButton} onPress={handleCopyPrompt}>
                    {copied ? (
                      <Check size={16} color={Colors.success} />
                    ) : (
                      <Copy size={16} color={Colors.textPrimary} />
                    )}
                  </TouchableOpacity>
                </View>
                <Text style={styles.enhancedText}>{enhancedPrompt}</Text>
              </View>
            ) : null}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Style</Text>
              <View style={styles.optionsRow}>
                {STYLES.map((s) => (
                  <TouchableOpacity
                    key={s.value}
                    style={[styles.optionButton, style === s.value && styles.optionButtonActive]}
                    onPress={() => setStyle(s.value)}
                  >
                    <Text style={[styles.optionText, style === s.value && styles.optionTextActive]}>
                      {s.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Aspect Ratio</Text>
              <View style={styles.optionsRow}>
                {ASPECT_RATIOS.map((r) => (
                  <TouchableOpacity
                    key={r.value}
                    style={[styles.optionButton, aspectRatio === r.value && styles.optionButtonActive]}
                    onPress={() => setAspectRatio(r.value)}
                  >
                    <Text style={[styles.optionText, aspectRatio === r.value && styles.optionTextActive]}>
                      {r.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.generateButton}
                onPress={handleGenerate}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={Colors.textPrimary} />
                ) : (
                  <Sparkles size={18} color={Colors.textPrimary} />
                )}
                <Text style={styles.generateButtonText}>
                  {loading ? 'Generating...' : 'Generate Image'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
            </View>

            {imageUrl ? (
              <View style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <View style={styles.resultTitleRow}>
                    <ImageIcon size={18} color={Colors.accentPrimary} />
                    <Text style={styles.resultTitle}>Generated Image</Text>
                  </View>
                  <View style={styles.resultActions}>
                    <TouchableOpacity style={styles.smallButton} onPress={handleSaveImage}>
                      <Download size={16} color={Colors.textPrimary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.smallButton} onPress={handleShareImage}>
                      <Share2 size={16} color={Colors.textPrimary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.smallButton} onPress={handleOpenImage}>
                      <ExternalLink size={16} color={Colors.textPrimary} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={[styles.imageWrapper, { aspectRatio: selectedRatio.ratio }]}>
                  <Image source={{ uri: imageUrl }} style={styles.image} />
                </View>
              </View>
            ) : null}

            <View style={styles.tipBox}>
              <Text style={styles.tipIcon}>💡</Text>
              <Text style={styles.tipText}>
                If the tool doesn’t respond after generation, try again or refresh the prompt.
              </Text>
            </View>
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
    paddingBottom: 48,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: Colors.accentGlow,
    borderColor: Colors.borderAccent,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    marginBottom: 16,
  },
  aiBadgeText: {
    fontSize: 12,
    color: Colors.accentPrimary,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: Colors.bgCard,
    borderColor: Colors.borderPrimary,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.textPrimary,
    minHeight: 44,
  },
  textArea: {
    minHeight: 100,
  },
  enhanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.accentPrimary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  enhanceButtonDisabled: {
    opacity: 0.6,
  },
  enhanceButtonText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  enhancedBox: {
    backgroundColor: 'rgba(168, 85, 247, 0.12)',
    borderColor: Colors.borderAccent,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  enhancedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  enhancedTitle: {
    fontSize: 12,
    color: Colors.accentPrimary,
    fontWeight: '700',
  },
  enhancedText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  copyButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    backgroundColor: Colors.bgCard,
    borderColor: Colors.borderPrimary,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  optionButtonActive: {
    backgroundColor: Colors.accentPrimary,
    borderColor: Colors.accentPrimary,
  },
  optionText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  optionTextActive: {
    color: Colors.textPrimary,
  },
  errorBox: {
    backgroundColor: Colors.errorBg,
    borderColor: Colors.error,
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    color: Colors.error,
    fontSize: 13,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  generateButton: {
    flex: 1,
    backgroundColor: Colors.accentPrimary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 48,
  },
  generateButtonText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  resetButton: {
    backgroundColor: Colors.bgCard,
    borderColor: Colors.borderPrimary,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  resetButtonText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: Colors.bgCard,
    borderColor: Colors.borderPrimary,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  resultTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  resultTitle: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  resultActions: {
    flexDirection: 'row',
    gap: 8,
  },
  smallButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  imageWrapper: {
    width: '100%',
    backgroundColor: Colors.bgElevated,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  tipBox: {
    marginTop: 8,
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.25)',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  tipIcon: {
    fontSize: 16,
  },
  tipText: {
    color: Colors.info,
    fontSize: 12,
    flex: 1,
  },
});
