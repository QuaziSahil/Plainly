import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Clock, Sparkles, Calculator, ChevronRight, Trash2 } from 'lucide-react-native';
import { DarkColors as Colors } from '@/constants/Colors';
import { Typography, Spacing, BorderRadius } from '@/constants/Theme';
import { allTools, Tool } from '@/constants/Tools';
import { useStorageStore } from '@/stores/useStorageStore';

// History item type (matching store)
interface HistoryItemType {
  path: string;
  name: string;
  result: string;
  resultUnit?: string;
  type: 'calculator' | 'ai' | 'converter';
  timestamp: number;
}

// Format relative time
const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
};

export default function HistoryScreen() {
  const router = useRouter();
  const { history, clearHistory, addToHistory } = useStorageStore();

  // Enhance history with tool data
  const historyWithTools = useMemo(() => {
    return history
      .map(h => {
        const tool = allTools.find(t => t.path === h.path);
        return tool ? { ...h, tool } : null;
      })
      .filter((item): item is HistoryItemType & { tool: Tool } => item !== null);
  }, [history]);

  const handleToolPress = (tool: Tool) => {
    addToHistory({ 
      path: tool.path, 
      name: tool.name,
      result: 'Viewed',
      type: tool.isAI ? 'ai' : 'calculator',
    });
    router.push({ pathname: '/tool/[id]', params: { id: tool.id } });
  };

  const renderHistoryItem = ({ item }: { item: HistoryItemType & { tool: Tool } }) => (
    <TouchableOpacity 
      style={styles.toolCard}
      onPress={() => handleToolPress(item.tool)}
      activeOpacity={0.7}
    >
      <View style={styles.toolCardHeader}>
        <View style={[styles.toolIcon, { backgroundColor: item.tool.isAI ? Colors.accentGlow : Colors.bgElevated }]}>
          {item.tool.isAI ? (
            <Sparkles size={20} color={Colors.accentPrimary} />
          ) : (
            <Calculator size={20} color={Colors.textSecondary} />
          )}
        </View>
        <View style={styles.toolInfo}>
          <Text style={styles.toolName} numberOfLines={1}>{item.tool.name}</Text>
          <Text style={styles.toolTime}>{formatRelativeTime(item.timestamp)}</Text>
        </View>
        <ChevronRight size={18} color={Colors.textTertiary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgPrimary} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Clock size={24} color={Colors.accentPrimary} />
          <Text style={[styles.title, { color: Colors.textPrimary }]}>History</Text>
        </View>
        {history.length > 0 && (
          <TouchableOpacity onPress={clearHistory}>
            <Text style={[styles.clearBtn, { color: Colors.error }]}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={[styles.subtitle, { color: Colors.textSecondary }]}>
        {history.length} {history.length === 1 ? 'item' : 'items'}
      </Text>

      {/* History List */}
      <FlatList
        data={historyWithTools}
        keyExtractor={(item, index) => `${item.path}-${index}`}
        renderItem={renderHistoryItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Clock size={64} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No history yet</Text>
            <Text style={styles.emptySubtitle}>
              Tools you use will appear here for quick access
            </Text>
            <TouchableOpacity 
              style={styles.exploreBtn}
              onPress={() => router.push('/explore')}
            >
              <Text style={styles.exploreBtnText}>Start Exploring</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    fontSize: Typography.fontSize.h2,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  clearBtn: {
    fontSize: Typography.fontSize.bodySm,
    color: Colors.error,
    fontWeight: Typography.fontWeight.medium,
  },
  subtitle: {
    fontSize: Typography.fontSize.bodySm,
    color: Colors.textTertiary,
    paddingHorizontal: Spacing.base,
    marginTop: 2,
    marginBottom: Spacing.lg,
  },
  listContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: 100,
    flexGrow: 1,
  },
  toolCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  toolCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  toolInfo: {
    flex: 1,
  },
  toolName: {
    fontSize: Typography.fontSize.body,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
  },
  toolTime: {
    fontSize: Typography.fontSize.caption,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['2xl'],
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontSize: Typography.fontSize.h3,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: Typography.fontSize.bodySm,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  exploreBtn: {
    backgroundColor: Colors.accentPrimary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  exploreBtnText: {
    color: Colors.bgPrimary,
    fontWeight: Typography.fontWeight.semibold,
    fontSize: Typography.fontSize.body,
  },
});
