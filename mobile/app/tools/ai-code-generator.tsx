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
import { Code, Copy, Check, Sparkles, Wand2 } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '@/constants/Colors';
import { askGroq, OfflineError } from '@/services/groqAI';
import { useStorageStore } from '@/stores/useStorageStore';
import AIOutputFormatter from '@/components/AIOutputFormatter';
import ToolHeader from '@/components/ToolHeader';

const LANGUAGES = [
  { id: 'auto', label: '✨ Auto (AI Decides)' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'html', label: 'HTML (with CSS & JS)' },
  { id: 'python', label: 'Python' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'java', label: 'Java' },
  { id: 'css', label: 'CSS' },
  { id: 'csharp', label: 'C#' },
  { id: 'cpp', label: 'C++' },
  { id: 'go', label: 'Go' },
  { id: 'rust', label: 'Rust' },
  { id: 'php', label: 'PHP' },
  { id: 'ruby', label: 'Ruby' },
  { id: 'swift', label: 'Swift' },
  { id: 'kotlin', label: 'Kotlin' },
];

const COMPLEXITY_OPTIONS = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
];

export default function AICodeGeneratorScreen() {
  const insets = useSafeAreaInsets();
  const { addToHistory } = useStorageStore();
  const scrollRef = useRef<ScrollView>(null);

  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('auto');
  const [complexity, setComplexity] = useState('intermediate');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const generateCode = async () => {
    if (!description.trim()) {
      setError('Please describe what code you need');
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      const isAuto = language === 'auto';
      const isHTML = language === 'html';
      const selectedLang = LANGUAGES.find(l => l.id === language)?.label || language;

      let systemPrompt: string;
      let prompt: string;

      if (isAuto) {
        // Auto mode - AI decides the language
        systemPrompt = `You are an expert programmer. Analyze the user's request and determine the BEST programming language for the task, then generate COMPLETE, PRODUCTION-READY code.

CRITICAL REQUIREMENTS:
- First, determine the most appropriate language for the task
- Write COMPLETE code that works immediately - no placeholders, no TODOs
- Include ALL necessary functions, classes, and logic
- Add proper error handling and edge cases
- Include helpful comments explaining complex parts
- Follow best practices and conventions for the chosen language
- If it's a web project, create complete HTML with embedded CSS & JavaScript
- Complexity level: ${complexity === 'beginner' ? 'Simple with detailed comments' : complexity === 'advanced' ? 'Optimized, scalable, with design patterns' : 'Production-ready with proper structure'}

Start your response with a brief note about which language you chose and why, then provide the complete code.`;

        prompt = `Create COMPLETE, WORKING code for: ${description}

Analyze the request and choose the most appropriate programming language. If it involves a web interface or visual elements, create complete HTML with embedded CSS and JavaScript.

The code must be complete and work immediately.`;

      } else if (isHTML) {
        // HTML mode - Generate complete beautiful pages
        systemPrompt = `You are an expert web developer. Generate COMPLETE, FULLY FUNCTIONAL HTML pages with embedded CSS and JavaScript.

CRITICAL REQUIREMENTS:
- Create a COMPLETE HTML5 document with <!DOCTYPE html>
- ALWAYS include embedded <style> in <head> for ALL CSS styling
- ALWAYS include embedded <script> at end of <body> for ALL JavaScript
- Make it VISUALLY BEAUTIFUL with modern CSS (gradients, shadows, animations, good colors)
- Make it FULLY FUNCTIONAL - all buttons, inputs, and interactions must work
- Include ALL necessary code - no external files, no placeholders, no TODOs
- The code must work immediately when opened in a browser
- Use modern CSS: flexbox, grid, CSS variables, smooth transitions
- Make it responsive for mobile
- Add hover effects and interactive feedback
- Use a professional color scheme (dark theme preferred)

Example structure:
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Title</title>
    <style>
        /* ALL CSS HERE - make it beautiful */
    </style>
</head>
<body>
    <!-- ALL HTML HERE -->
    <script>
        // ALL JAVASCRIPT HERE - make it functional
    </script>
</body>
</html>

Return ONLY the complete HTML code. No explanations.`;

        prompt = `Create a COMPLETE, BEAUTIFUL, FULLY FUNCTIONAL HTML page for: ${description}

The page must:
1. Have a stunning visual design (modern CSS, shadows, gradients, animations)
2. Be 100% functional with all features working
3. Include ALL code embedded (CSS in <style>, JS in <script>)
4. Work immediately when opened in any browser

Return ONLY the complete HTML code.`;

      } else {
        // Specific language mode
        systemPrompt = `You are an expert ${selectedLang} programmer. Generate COMPLETE, PRODUCTION-READY code.

CRITICAL REQUIREMENTS:
- Write COMPLETE code that works immediately - no placeholders, no TODOs, no "implement this"
- Include ALL necessary functions, classes, and logic
- Add proper error handling and edge cases
- Include helpful comments explaining complex parts
- Follow ${selectedLang} best practices and conventions
- Make the code clean, efficient, and maintainable
- Complexity level: ${complexity === 'beginner' ? 'Simple with detailed comments' : complexity === 'advanced' ? 'Optimized, scalable, with design patterns' : 'Production-ready with proper structure'}

Return ONLY the code in a markdown code block. No explanations outside the code block.`;

        prompt = `Generate COMPLETE, WORKING ${selectedLang} code for: ${description}

Language: ${selectedLang}
Complexity: ${complexity}

The code must be complete and work immediately - include all functions, classes, and logic needed.

Return ONLY the code in a markdown code block.`;
      }

      const response = await askGroq(prompt, systemPrompt, {
        temperature: 0.3,
        maxTokens: 4096,
      });

      setResult(response);

      addToHistory({
        path: '/ai-code-generator',
        name: 'AI Code Generator',
        result: `${isAuto ? 'Auto-detected' : selectedLang} code generated`,
        type: 'ai',
      });

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err: any) {
      if (err instanceof OfflineError || err.name === 'OfflineError') {
        setError('No internet connection. Please check your network.');
      } else {
        setError('Failed to generate code. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Extract only clean code from markdown response
  const extractCleanCode = (text: string): string => {
    if (!text) return '';

    // Find code blocks with triple backticks
    const codeBlockRegex = /```[\w]*\n?([\s\S]*?)```/g;
    const codeBlocks: string[] = [];
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Get the code content (group 1), trim whitespace
      const code = match[1].trim();
      if (code) {
        codeBlocks.push(code);
      }
    }

    // If we found code blocks, join them
    if (codeBlocks.length > 0) {
      return codeBlocks.join('\n\n');
    }

    // If no code blocks found, try to extract code by removing common explanatory patterns
    let cleanText = text;

    // Remove "Language Choice:" or "Language:" sections
    cleanText = cleanText.replace(/^Language Choice:[\s\S]*?(?=<!DOCTYPE|import|function|class|const|let|var|def |#include|package |using |public class)/im, '');
    cleanText = cleanText.replace(/^Language:[\s\S]*?(?=<!DOCTYPE|import|function|class|const|let|var|def |#include|package |using |public class)/im, '');

    // Remove lines that start with explanatory text patterns
    const lines = cleanText.split('\n');
    const codeLines = lines.filter(line => {
      const trimmed = line.trim();
      // Skip empty lines at the start
      if (!trimmed) return true;
      // Skip common explanatory phrases
      if (/^(Based on|I (have |will |would |chose|recommend)|This|Here|Let me|The|For|To |Note:|Code:)/i.test(trimmed)) {
        return false;
      }
      return true;
    });

    return codeLines.join('\n').trim();
  };

  const handleCopy = async () => {
    const cleanCode = extractCleanCode(result);
    await Clipboard.setStringAsync(cleanCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setDescription('');
    setLanguage('auto');
    setComplexity('intermediate');
    setResult('');
    setError('');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ToolHeader title="AI Code Generator" toolId="ai-code-generator" onRefresh={handleReset} />

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
              <Text style={styles.label}>What do you want to build? *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Be specific! e.g., 'A fully functional calculator with buttons for +, -, ×, ÷, clear, and equals. Dark theme with purple accent color.'"
                placeholderTextColor={Colors.textMuted}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Programming Language</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.langGrid}>
                  {LANGUAGES.map((lang) => (
                    <TouchableOpacity
                      key={lang.id}
                      style={[
                        styles.langChip,
                        language === lang.id && styles.langChipActive,
                        lang.id === 'auto' && styles.autoChip,
                        lang.id === 'auto' && language === lang.id && styles.autoChipActive,
                      ]}
                      onPress={() => setLanguage(lang.id)}
                    >
                      {lang.id === 'auto' && <Wand2 size={14} color={language === lang.id ? '#fff' : Colors.accentPrimary} />}
                      <Text style={[
                        styles.langChipText,
                        language === lang.id && styles.langChipTextActive,
                        lang.id === 'auto' && styles.autoChipText,
                      ]}>
                        {lang.id === 'auto' ? 'Auto' : lang.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Complexity Level</Text>
              <View style={styles.complexityRow}>
                {COMPLEXITY_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.id}
                    style={[styles.complexityChip, complexity === opt.id && styles.complexityChipActive]}
                    onPress={() => setComplexity(opt.id)}
                  >
                    <Text style={[styles.complexityChipText, complexity === opt.id && styles.complexityChipTextActive]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Tip for Auto mode */}
            {language === 'auto' && (
              <View style={styles.tipContainer}>
                <Text style={styles.tipText}>
                  💡 <Text style={styles.tipBold}>Auto Mode:</Text> AI will analyze your request and choose the best language automatically!
                </Text>
              </View>
            )}

            {/* Tip for HTML mode */}
            {language === 'html' && (
              <View style={styles.tipContainer}>
                <Text style={styles.tipText}>
                  💡 <Text style={styles.tipBold}>HTML Mode:</Text> We'll generate a complete page with embedded CSS & JavaScript that works immediately!
                </Text>
              </View>
            )}

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.generateButton, loading && styles.generateButtonDisabled]}
              onPress={generateCode}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Code size={20} color="#fff" />
                  <Text style={styles.generateButtonText}>
                    {result ? 'Regenerate Code' : 'Generate Code'}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {result ? (
              <View style={styles.resultContainer}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle}>Generated Code</Text>
                  <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
                    {copied ? (
                      <Check size={18} color={Colors.success} />
                    ) : (
                      <Copy size={18} color={Colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                </View>
                <AIOutputFormatter text={result} />
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
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  langGrid: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  langChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
    gap: 6,
  },
  langChipActive: {
    backgroundColor: Colors.accentPrimary,
    borderColor: Colors.accentPrimary,
  },
  autoChip: {
    borderColor: Colors.accentPrimary,
    backgroundColor: Colors.accentPrimary + '15',
  },
  autoChipActive: {
    backgroundColor: Colors.accentPrimary,
  },
  autoChipText: {
    color: Colors.accentPrimary,
  },
  langChipText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  langChipTextActive: {
    color: '#fff',
  },
  complexityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  complexityChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
    alignItems: 'center',
  },
  complexityChipActive: {
    backgroundColor: Colors.accentPrimary + '20',
    borderColor: Colors.accentPrimary,
  },
  complexityChipText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  complexityChipTextActive: {
    color: Colors.accentPrimary,
  },
  tipContainer: {
    backgroundColor: Colors.success + '15',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.success + '30',
  },
  tipText: {
    fontSize: 13,
    color: Colors.success,
    lineHeight: 18,
  },
  tipBold: {
    fontWeight: '700',
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
  copyButton: {
    padding: 8,
  },
});
