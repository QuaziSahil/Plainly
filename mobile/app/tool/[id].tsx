import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
  Share,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  ExternalLink, 
  Sparkles,
  Calculator,
  Clock,
  Star,
  Zap,
  CheckCircle,
} from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { getToolById, Tool } from '@/constants/Tools';
import { useStorageStore } from '@/stores/useStorageStore';

// Map of tools that have native implementations
const NATIVE_TOOLS: { [key: string]: string } = {
  // Calculator Tools
  'tip': '/tools/tip-calculator',
  'bmi': '/tools/bmi-calculator',
  'percentage': '/tools/percentage-calculator',
  'compound-interest': '/tools/compound-interest-calculator',
  'loan': '/tools/loan-calculator',
  'mortgage': '/tools/mortgage-calculator',
  'calorie': '/tools/calorie-calculator',
  'age': '/tools/age-calculator',
  'discount': '/tools/discount-calculator',
  'unit-converter': '/tools/unit-converter',
  'water-intake': '/tools/water-intake-calculator',
  'gpa': '/tools/gpa-calculator',
  'random-number': '/tools/random-number-generator',
  // AI Tools - Original
  'ai-email': '/tools/ai-email-generator',
  'ai-summarizer': '/tools/ai-text-summarizer',
  'ai-translator': '/tools/ai-translator',
  'ai-paraphraser': '/tools/ai-paraphraser',
  'ai-paragraph': '/tools/ai-paragraph-generator',
  'ai-image': '/tools/ai-image-generator',
  // AI Tools - Batch 1
  'ai-code': '/tools/ai-code-generator',
  'ai-grammar': '/tools/ai-grammar-checker',
  'ai-hashtag': '/tools/ai-hashtag-generator',
  'ai-joke': '/tools/ai-joke-generator',
  'ai-quote': '/tools/ai-quote-generator',
  // AI Tools - Batch 2
  'ai-slogan': '/tools/ai-slogan-generator',
  'ai-username': '/tools/ai-username-generator',
  'ai-poem': '/tools/ai-poem-generator',
  'ai-story-starter': '/tools/ai-story-starter-generator',
  'ai-tweet': '/tools/ai-tweet-generator',
  // AI Tools - Batch 3
  'ai-linkedin': '/tools/ai-linkedin-post-generator',
  'ai-instagram': '/tools/ai-instagram-caption-generator',
  'ai-product-description': '/tools/ai-product-description-generator',
  'ai-cover-letter': '/tools/ai-cover-letter-generator',
  'ai-resume-summary': '/tools/ai-resume-summary-generator',
  // AI Tools - Batch 4
  'ai-business-name': '/tools/ai-business-name-generator',
  'ai-blog-post': '/tools/ai-blog-post-generator',
  'ai-meta-description': '/tools/ai-meta-description-generator',
  'ai-sentence-expander': '/tools/ai-sentence-expander',
  'ai-sentence-shortener': '/tools/ai-sentence-shortener',
};

export default function ToolDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { toggleFavorite, isFavorite, addToHistory } = useStorageStore();
  const insets = useSafeAreaInsets();
  
  const tool = getToolById(id || '');
  const hasNativeImplementation = tool && NATIVE_TOOLS[tool.id];

  // If tool has native implementation, navigate directly
  useEffect(() => {
    if (hasNativeImplementation) {
      router.replace(NATIVE_TOOLS[tool.id] as any);
    }
  }, [hasNativeImplementation]);

  if (!tool) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Tool Not Found</Text>
          <Text style={styles.errorDescription}>
            This tool could not be found. It may have been moved or removed.
          </Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Show loading while redirecting to native tool
  if (hasNativeImplementation) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <Zap size={48} color={Colors.accentPrimary} />
          <Text style={styles.loadingText}>Loading {tool.name}...</Text>
        </View>
      </View>
    );
  }

  const toolIsFavorite = isFavorite(tool.path);

  const handleToggleFavorite = () => {
    toggleFavorite(tool.path);
  };

  const handleOpenWeb = () => {
    const webUrl = `https://plainly.live${tool.path}`;
    Linking.openURL(webUrl);
    addToHistory({ 
      path: tool.path, 
      name: tool.name,
      result: 'Opened in browser',
      type: tool.isAI ? 'ai' : 'calculator',
    });
  };

  const handleShare = async () => {
    try {
      const webUrl = `https://plainly.live${tool.path}`;
      await Share.share({
        message: `Check out ${tool.name} on Plainly Tools!\n\n${tool.description}\n\n${webUrl}`,
        title: tool.name,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: false,
        }} 
      />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.bgPrimary} translucent />
        
        {/* Custom Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleToggleFavorite}
            >
              <Heart 
                size={24} 
                color={toolIsFavorite ? Colors.error : Colors.textPrimary} 
                fill={toolIsFavorite ? Colors.error : 'transparent'}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleShare}
            >
              <Share2 size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Tool Icon & Title */}
          <View style={styles.toolHeader}>
            <View style={[
              styles.toolIcon, 
              { backgroundColor: tool.isAI ? Colors.accentGlow : Colors.bgElevated }
            ]}>
              {tool.isAI ? (
                <Sparkles size={48} color={Colors.accentPrimary} />
              ) : (
                <Calculator size={48} color={Colors.accentPrimary} />
              )}
            </View>
            <Text style={styles.toolName}>{tool.name}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{tool.category}</Text>
            </View>
            {tool.isAI && (
              <View style={styles.aiBadge}>
                <Sparkles size={14} color={Colors.accentPrimary} />
                <Text style={styles.aiBadgeText}>AI Powered</Text>
              </View>
            )}
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this tool</Text>
            <Text style={styles.description}>{tool.description}</Text>
          </View>

          {/* Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <CheckCircle size={18} color={Colors.success} />
                <Text style={styles.featureText}>100% Free to use</Text>
              </View>
              <View style={styles.featureItem}>
                <Clock size={18} color={Colors.accentPrimary} />
                <Text style={styles.featureText}>Instant results</Text>
              </View>
              <View style={styles.featureItem}>
                <Star size={18} color={Colors.warning} />
                <Text style={styles.featureText}>No account required</Text>
              </View>
              {tool.isAI && (
                <View style={styles.featureItem}>
                  <Sparkles size={18} color={Colors.accentPrimary} />
                  <Text style={styles.featureText}>AI-powered intelligence</Text>
                </View>
              )}
            </View>
          </View>

          {/* Web Notice */}
          <View style={styles.noteContainer}>
            <ExternalLink size={24} color={Colors.textTertiary} />
            <Text style={styles.noteTitle}>Opens in Browser</Text>
            <Text style={styles.noteText}>
              This tool will open in your web browser for the best experience.
            </Text>
          </View>
        </ScrollView>

        {/* Open Button */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
          <TouchableOpacity 
            style={styles.openButton}
            onPress={handleOpenWeb}
            activeOpacity={0.8}
          >
            <ExternalLink size={20} color="#000" />
            <Text style={styles.openButtonText}>Open Tool</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderPrimary,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 120,
  },
  toolHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  toolIcon: {
    width: 100,
    height: 100,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: Colors.accentPrimary,
  },
  toolName: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: Colors.accentGlow,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.accentPrimary,
  },
  categoryText: {
    color: Colors.accentPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.accentGlow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 12,
  },
  aiBadgeText: {
    color: Colors.accentPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.accentPrimary,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  featuresList: {
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.bgCard,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderAccent,
  },
  featureText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  noteContainer: {
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
    gap: 8,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  noteText: {
    fontSize: 14,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 34,
    backgroundColor: Colors.bgPrimary,
    borderTopWidth: 1,
    borderTopColor: Colors.borderPrimary,
  },
  openButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.accentPrimary,
    paddingVertical: 16,
    borderRadius: 14,
  },
  openButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  errorDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: Colors.accentPrimary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});
