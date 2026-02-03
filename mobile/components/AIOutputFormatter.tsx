import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

/**
 * AIOutputFormatter - Formats AI-generated markdown into beautiful, styled output for React Native
 * Matches the website's AIOutputFormatter component styling
 * Handles: headers, bullets, numbered lists, bold, italic, code, dividers
 */

interface AIOutputFormatterProps {
  text: string;
}

// Clean markdown and extract styled segments
function cleanMarkdown(text: string): string {
  if (!text) return '';
  
  // Remove ** markers (bold) - we'll handle styling separately
  text = text.replace(/\*\*(.+?)\*\*/g, '$1');
  text = text.replace(/__(.+?)__/g, '$1');
  
  // Remove single * or _ (italic)
  text = text.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '$1');
  text = text.replace(/(?<!_)_([^_]+)_(?!_)/g, '$1');
  
  // Remove inline code backticks
  text = text.replace(/`([^`]+)`/g, '$1');
  
  return text.trim();
}

// Parse text into structured elements
interface ParsedElement {
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'divider' | 'bullet' | 'numbered' | 'paragraph' | 'subject';
  content?: string;
  number?: string;
  key: number;
}

function parseText(text: string): ParsedElement[] {
  if (!text) return [];

  const lines = text.split('\n');
  const elements: ParsedElement[] = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) return;

    // Dividers (=== or ---)
    if (/^[=]{3,}$/.test(trimmed) || /^[-]{3,}$/.test(trimmed)) {
      elements.push({ type: 'divider', key: index });
      return;
    }

    // Subject line (common in emails)
    if (/^(\*\*)?Subject:/i.test(trimmed)) {
      elements.push({ 
        type: 'subject', 
        content: cleanMarkdown(trimmed.replace(/^(\*\*)?Subject:\s*/i, '').replace(/\*\*$/, '')), 
        key: index 
      });
      return;
    }

    // Headers: # ## ### ####
    const h1Match = trimmed.match(/^#\s+(.+)$/);
    const h2Match = trimmed.match(/^##\s+(.+)$/);
    const h3Match = trimmed.match(/^###\s+(.+)$/);
    const h4Match = trimmed.match(/^####\s+(.+)$/);

    if (h1Match) {
      elements.push({ type: 'h1', content: cleanMarkdown(h1Match[1]), key: index });
      return;
    }
    if (h2Match) {
      elements.push({ type: 'h2', content: cleanMarkdown(h2Match[1]), key: index });
      return;
    }
    if (h3Match) {
      elements.push({ type: 'h3', content: cleanMarkdown(h3Match[1]), key: index });
      return;
    }
    if (h4Match) {
      elements.push({ type: 'h4', content: cleanMarkdown(h4Match[1]), key: index });
      return;
    }

    // Numbered lists: "1. item" or "1) item"
    const numberedMatch = trimmed.match(/^(\d+)[.)]\s+(.+)$/);
    if (numberedMatch) {
      elements.push({
        type: 'numbered',
        number: numberedMatch[1],
        content: cleanMarkdown(numberedMatch[2]),
        key: index,
      });
      return;
    }

    // Bullet points: "* item", "- item", "• item"
    const bulletMatch = trimmed.match(/^[\*\-•]\s+(.+)$/);
    if (bulletMatch) {
      elements.push({
        type: 'bullet',
        content: cleanMarkdown(bulletMatch[1]),
        key: index,
      });
      return;
    }

    // Regular paragraph
    elements.push({
      type: 'paragraph',
      content: cleanMarkdown(trimmed),
      key: index,
    });
  });

  return elements;
}

export default function AIOutputFormatter({ text }: AIOutputFormatterProps) {
  if (!text) return null;

  const elements = parseText(text);

  return (
    <View style={styles.container}>
      {elements.map((element) => {
        switch (element.type) {
          case 'subject':
            return (
              <View key={element.key} style={styles.subjectContainer}>
                <Text style={styles.subjectLabel}>Subject:</Text>
                <Text style={styles.subjectText}>{element.content}</Text>
              </View>
            );

          case 'h1':
            return (
              <Text key={element.key} style={styles.h1}>
                {element.content}
              </Text>
            );

          case 'h2':
            return (
              <Text key={element.key} style={styles.h2}>
                {element.content}
              </Text>
            );

          case 'h3':
            return (
              <Text key={element.key} style={styles.h3}>
                {element.content}
              </Text>
            );

          case 'h4':
            return (
              <Text key={element.key} style={styles.h4}>
                {element.content}
              </Text>
            );

          case 'divider':
            return <View key={element.key} style={styles.divider} />;

          case 'numbered':
            return (
              <View key={element.key} style={styles.listItem}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>{element.number}</Text>
                </View>
                <Text style={styles.listText}>{element.content}</Text>
              </View>
            );

          case 'bullet':
            return (
              <View key={element.key} style={styles.listItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.listText}>{element.content}</Text>
              </View>
            );

          case 'paragraph':
          default:
            return (
              <Text key={element.key} style={styles.paragraph}>
                {element.content}
              </Text>
            );
        }
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  subjectContainer: {
    backgroundColor: Colors.accentGlow,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.accentPrimary,
  },
  subjectLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.accentPrimary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  subjectText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  h1: {
    fontSize: 22,
    fontWeight: '700',
    color: '#e9d5ff',
    marginTop: 16,
    marginBottom: 8,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(167, 139, 250, 0.4)',
  },
  h2: {
    fontSize: 18,
    fontWeight: '600',
    color: '#c4b5fd',
    marginTop: 16,
    marginBottom: 8,
  },
  h3: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.accentPrimary,
    marginTop: 12,
    marginBottom: 4,
  },
  h4: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8b5cf6',
    marginTop: 8,
    marginBottom: 4,
    opacity: 0.9,
  },
  divider: {
    height: 2,
    backgroundColor: 'rgba(167, 139, 250, 0.3)',
    marginVertical: 16,
    borderRadius: 1,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: Colors.textSecondary,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingLeft: 4,
  },
  numberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.accentGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  numberText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.accentPrimary,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accentPrimary,
    marginTop: 9,
  },
  listText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
    color: Colors.textSecondary,
  },
});
