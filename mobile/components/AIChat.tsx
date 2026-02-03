import React, { useState, useRef, useEffect } from 'react';
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
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Sparkles, Send, X, User, Bot, Trash2, ArrowRight, Calculator } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { chatWithGroq, AI_ASSISTANT_PROMPT, Message, extractToolPath, getToolFromPath, TOOL_DATABASE } from '@/services/groqAI';
import { useRouter } from 'expo-router';
import { allTools } from '@/constants/Tools';

interface ChatMessage extends Message {
  id: string;
  timestamp: Date;
  toolSuggestion?: { name: string; description: string; path: string } | null;
}

interface AIChatProps {
  visible: boolean;
  onClose: () => void;
}

export default function AIChat({ visible, onClose }: AIChatProps) {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const slideAnim = useRef(new Animated.Value(1000)).current;
  const router = useRouter();

  // Parse tool suggestion from response text
  const parseToolSuggestion = (text: string) => {
    const pathMatch = text.match(/\/[\w-]+/);
    if (pathMatch) {
      const path = pathMatch[0];
      // First check our database
      const dbTool = getToolFromPath(path);
      if (dbTool) return dbTool;

      // Then check allTools
      const tool = allTools.find(t => t.path === path);
      if (tool) {
        return { name: tool.name, description: tool.description, path: tool.path };
      }
    }
    return null;
  };

  // Format message text - convert markdown to clean display text
  const formatMessageText = (text: string) => {
    let formatted = text;

    // Step 1: Handle bold text (**text** or __text__) - extract content
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '$1');
    formatted = formatted.replace(/__(.*?)__/g, '$1');

    // Step 2: Handle code blocks (`text`) - extract content
    formatted = formatted.replace(/`([^`]+)`/g, '$1');

    // Step 3: Convert markdown bullets (*, -, •) to clean bullet points
    // Handle lines starting with * (followed by space or bold text)
    formatted = formatted.replace(/^\*\s+/gm, '• ');
    formatted = formatted.replace(/^-\s+/gm, '• ');

    // Step 4: Handle bold text that starts a bullet line like "* **Bold:** text"
    formatted = formatted.replace(/^\•\s*\*\*(.*?)\*\*:/gm, '• $1:');

    // Step 5: Clean up any remaining asterisks used for emphasis mid-text
    // Replace *text* with just text (but be careful not to break bullets)
    formatted = formatted.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '$1');

    // Step 6: Clean up any remaining double asterisks
    formatted = formatted.replace(/\*\*/g, '');

    // Step 7: Clean up extra whitespace and newlines
    formatted = formatted.replace(/\n{3,}/g, '\n\n');

    return formatted.trim();
  };

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 1000,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      // Build conversation history
      const conversationHistory: Message[] = messages.map(m => ({
        role: m.role,
        content: m.content,
      }));
      conversationHistory.push({ role: 'user', content: userMessage.content });

      const response = await chatWithGroq(conversationHistory, {
        systemPrompt: AI_ASSISTANT_PROMPT,
        maxTokens: 500,
        temperature: 0.7,
      });

      // Parse tool suggestion from response
      const toolSuggestion = parseToolSuggestion(response);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        toolSuggestion,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please check your internet connection and try again! 🔄",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }] }
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.aiIcon}>
            <Sparkles size={20} color={Colors.accentPrimary} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Plainly AI Assistant</Text>
            <Text style={styles.headerSubtitle}>Powered by AI • 309+ tools</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={clearChat} style={styles.headerBtn}>
            <Trash2 size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.headerBtn}>
            <X size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 && (
            <View style={styles.welcomeContainer}>
              <View style={styles.welcomeIcon}>
                <Sparkles size={32} color={Colors.accentPrimary} />
              </View>
              <Text style={styles.welcomeTitle}>Hi! I'm Plainly AI</Text>
              <Text style={styles.welcomeText}>
                Your smart assistant for 309+ calculators and AI tools. Ask me anything!
              </Text>
              <View style={styles.suggestionsContainer}>
                <Text style={styles.suggestionsTitle}>Try asking:</Text>
                {[
                  { label: '💰 "What\'s 20% of 150?"', query: 'What is 20% of 150?' },
                  { label: '🏋️ "Calculate my BMI"', query: 'Help me calculate my BMI, I am 175cm and 70kg' },
                  { label: '🤖 "Generate a code snippet"', query: 'I need to generate some code' },
                  { label: '📝 "Summarize text for me"', query: 'I want to summarize some text' },
                  { label: '💵 "Convert currency"', query: 'How do I convert USD to EUR?' },
                  { label: '🔢 "Solve a math problem"', query: 'What tools do you have for math calculations?' },
                ].map((action, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionChip}
                    onPress={() => setInputText(action.query)}
                  >
                    <Text style={styles.suggestionText}>{action.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {messages.map((message) => (
            <View key={message.id}>
              <View
                style={[
                  styles.messageBubble,
                  message.role === 'user' ? styles.userBubble : styles.assistantBubble,
                ]}
              >
                <View style={styles.messageHeader}>
                  {message.role === 'user' ? (
                    <User size={14} color="#a78bfa" />
                  ) : (
                    <Bot size={14} color="#a78bfa" />
                  )}
                  <Text style={styles.messageRole}>
                    {message.role === 'user' ? 'You' : 'Plainly AI'}
                  </Text>
                </View>
                <Text style={styles.messageText}>{formatMessageText(message.content)}</Text>
              </View>

              {/* Tool Recommendation Card - like website */}
              {message.role === 'assistant' && message.toolSuggestion && (
                <View style={styles.toolCardContainer}>
                  <Text style={styles.toolCardLabel}>Recommended Tool</Text>
                  <TouchableOpacity
                    style={styles.toolCard}
                    onPress={() => {
                      // Find the tool in allTools to get its ID
                      const tool = allTools.find(t => t.path === message.toolSuggestion?.path);
                      if (tool) {
                        onClose();
                        router.push({ pathname: '/tool/[id]', params: { id: tool.id } });
                      }
                    }}
                  >
                    <View style={styles.toolCardIcon}>
                      <Calculator size={20} color={Colors.accentPrimary} />
                    </View>
                    <View style={styles.toolCardInfo}>
                      <Text style={styles.toolCardName}>{message.toolSuggestion.name}</Text>
                      <Text style={styles.toolCardDesc} numberOfLines={1}>
                        {message.toolSuggestion.description}
                      </Text>
                    </View>
                    <ArrowRight size={20} color="#666" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}

          {isLoading && (
            <View style={[styles.messageBubble, styles.assistantBubble]}>
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={Colors.accentPrimary} />
                <Text style={styles.loadingText}>Thinking...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 12) + 12 }]}>
          <TextInput
            style={styles.input}
            placeholder="Ask me anything..."
            placeholderTextColor="#666"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <Send size={20} color={inputText.trim() && !isLoading ? '#fff' : '#666'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#0a0a0a',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(167, 139, 250, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerBtn: {
    padding: 8,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 20,
  },
  welcomeContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  welcomeIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(167, 139, 250, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  suggestionsContainer: {
    width: '100%',
  },
  suggestionsTitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  suggestionChip: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  suggestionText: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(167, 139, 250, 0.2)',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#1a1a1a',
    borderBottomLeftRadius: 4,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  messageRole: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
  },
  messageText: {
    fontSize: 15,
    color: '#e0e0e0',
    lineHeight: 22,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
    color: '#888',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#0a0a0a',
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 12,
    paddingTop: 12,
    fontSize: 15,
    color: '#fff',
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.accentPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#2a2a2a',
  },
  // Tool recommendation card styles
  toolCardContainer: {
    marginLeft: 0,
    marginBottom: 12,
    maxWidth: '85%',
  },
  toolCardLabel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    gap: 12,
  },
  toolCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(167, 139, 250, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolCardInfo: {
    flex: 1,
  },
  toolCardName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  toolCardDesc: {
    fontSize: 13,
    color: '#888',
  },
});
