import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Search, X, Sparkles, Calculator, ChevronRight } from 'lucide-react-native';
import { DarkColors as Colors } from '@/constants/Colors';
import { allTools, categories, Tool } from '@/constants/Tools';
import { useStorageStore } from '@/stores/useStorageStore';

export default function ExploreScreen() {
  const { category: categoryParam } = useLocalSearchParams<{ category?: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const router = useRouter();

  // Set category from navigation params
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);
  const { addToFavorites, removeFromFavorites, favorites, addToHistory } = useStorageStore();

  // Find category name from ID for filtering
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    // Special case: 'ai' category id maps to 'AI' category in tools
    if (categoryId === 'ai') return 'AI';
    if (categoryId === 'real-estate') return 'Real Estate';
    return category?.name || categoryId;
  };

  // Get filtered tools
  const filteredTools = useMemo(() => {
    let tools = allTools;
    
    if (selectedCategory) {
      const categoryName = getCategoryName(selectedCategory);
      tools = tools.filter(tool => tool.category === categoryName);
    }
    
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      tools = tools.filter(tool => 
        tool.name.toLowerCase().includes(lowerQuery) ||
        tool.description.toLowerCase().includes(lowerQuery) ||
        tool.category.toLowerCase().includes(lowerQuery)
      );
    }
    
    return tools;
  }, [searchQuery, selectedCategory]);

  const isFavorite = (path: string) => favorites.includes(path);

  const handleToolPress = (tool: Tool) => {
    addToHistory({ path: tool.path, name: tool.name, result: 'Viewed', type: tool.isAI ? 'ai' : 'calculator' });
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
        <ChevronRight size={18} color={Colors.textTertiary} />
      </View>
      <Text style={styles.toolDescription} numberOfLines={2}>{tool.description}</Text>
      {tool.isAI && (
        <View style={styles.aiIndicator}>
          <Text style={styles.aiIndicatorText}>AI Powered</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgPrimary} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors.textPrimary }]}>Explore</Text>
        <Text style={[styles.subtitle, { color: Colors.textSecondary }]}>{allTools.length} tools available</Text>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: Colors.bgCard, borderColor: Colors.borderPrimary }]}>
        <Search size={20} color={Colors.textTertiary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: Colors.textPrimary }]}
          placeholder="Search tools..."
          placeholderTextColor={Colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <X size={18} color={Colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Pills */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}
      >
        <TouchableOpacity
          style={[styles.categoryPill, !selectedCategory && styles.categoryPillActive]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={styles.categoryPillText}>All</Text>
        </TouchableOpacity>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryPill, 
              selectedCategory === category.id && styles.categoryPillActive,
              selectedCategory === category.id && { borderColor: category.color }
            ]}
            onPress={() => setSelectedCategory(
              selectedCategory === category.id ? null : category.id
            )}
          >
            <Text style={styles.categoryPillText}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'} found
        </Text>
      </View>

      {/* Tools List */}
      <FlatList
        data={filteredTools}
        keyExtractor={(item) => item.id}
        renderItem={renderToolCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No tools found</Text>
            <Text style={styles.emptySubtitle}>Try a different search term</Text>
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
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textTertiary,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  categoryScroll: {
    minHeight: 56,
    maxHeight: 56,
    marginBottom: 16,
  },
  categoryContent: {
    paddingHorizontal: 20,
    paddingVertical: 0,
    alignItems: 'center',
  },
  categoryPill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: '#1a1a28',
    borderWidth: 1,
    borderColor: '#2a2a3a',
    marginRight: 10,
    height: 42,
    justifyContent: 'center',
  },
  categoryPillActive: {
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    borderColor: '#a855f7',
  },
  categoryPillText: {
    fontSize: 14,
    color: '#e0e0e0',
    fontWeight: '600',
  },
  categoryPillTextActive: {
    color: '#a855f7',
  },
  resultsHeader: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  resultsCount: {
    fontSize: 13,
    color: Colors.textTertiary,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  toolCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  toolCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  toolIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  toolInfo: {
    flex: 1,
  },
  toolName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  toolCategory: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  toolDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  aiIndicator: {
    alignSelf: 'flex-start',
    marginTop: 10,
    backgroundColor: Colors.accentGlow,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  aiIndicatorText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accentPrimary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textTertiary,
  },
});
