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
import { Star, Sparkles, Calculator, ChevronRight, Trash2 } from 'lucide-react-native';
import { DarkColors as Colors } from '@/constants/Colors';
import { Typography, Spacing, BorderRadius } from '@/constants/Theme';
import { allTools, Tool } from '@/constants/Tools';
import { useStorageStore } from '@/stores/useStorageStore';

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites, toggleFavorite, addToHistory } = useStorageStore();

  // Get favorite tools
  const favoriteTools = useMemo(() => {
    return favorites
      .map(path => allTools.find(t => t.path === path))
      .filter((tool): tool is Tool => tool !== undefined);
  }, [favorites]);

  const handleToolPress = (tool: Tool) => {
    addToHistory({ 
      path: tool.path, 
      name: tool.name,
      result: 'Viewed',
      type: tool.isAI ? 'ai' : 'calculator',
    });
    router.push({ pathname: '/tool/[id]', params: { id: tool.id } });
  };

  const renderToolCard = ({ item: tool }: { item: Tool }) => (
    <TouchableOpacity 
      style={styles.toolCard}
      onPress={() => handleToolPress(tool)}
      activeOpacity={0.7}
    >
      <View style={styles.toolCardHeader}>
        <View style={[styles.toolIcon, { backgroundColor: tool.isAI ? Colors.accentGlow : Colors.bgElevated }]}>
          {tool.isAI ? (
            <Sparkles size={20} color={Colors.accentPrimary} />
          ) : (
            <Calculator size={20} color={Colors.textSecondary} />
          )}
        </View>
        <View style={styles.toolInfo}>
          <Text style={styles.toolName} numberOfLines={1}>{tool.name}</Text>
          <Text style={styles.toolCategory}>{tool.category}</Text>
        </View>
        <TouchableOpacity 
          onPress={() => toggleFavorite(tool.path)}
          style={styles.removeBtn}
        >
          <Trash2 size={18} color={Colors.error} />
        </TouchableOpacity>
      </View>
      <Text style={styles.toolDescription} numberOfLines={2}>{tool.description}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgPrimary} />
      
      {/* Header */}
      <View style={styles.header}>
        <Star size={24} color={Colors.accentPrimary} fill={Colors.accentPrimary} />
        <Text style={[styles.title, { color: Colors.textPrimary }]}>Favorites</Text>
      </View>
      <Text style={[styles.subtitle, { color: Colors.textSecondary }]}>
        {favoriteTools.length} {favoriteTools.length === 1 ? 'tool' : 'tools'} saved
      </Text>

      {/* Favorites List */}
      <FlatList
        data={favoriteTools}
        keyExtractor={(item) => item.id}
        renderItem={renderToolCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Star size={64} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the star icon on any tool to add it to your favorites
            </Text>
            <TouchableOpacity 
              style={styles.exploreBtn}
              onPress={() => router.push('/explore')}
            >
              <Text style={styles.exploreBtnText}>Explore Tools</Text>
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
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize.h2,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
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
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  toolCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
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
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
  },
  toolCategory: {
    fontSize: Typography.fontSize.caption,
    color: Colors.textTertiary,
  },
  toolDescription: {
    fontSize: Typography.fontSize.bodySm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  removeBtn: {
    padding: Spacing.sm,
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
