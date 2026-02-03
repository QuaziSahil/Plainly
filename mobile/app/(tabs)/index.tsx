import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Search, 
  ChevronRight, 
  Sparkles, 
  Calculator, 
  Heart, 
  Brain, 
  ArrowLeftRight, 
  TrendingUp, 
  Zap, 
  DollarSign, 
  Gamepad2,
  Home as HomeIcon,
  Leaf,
  Type,
  Cpu,
  Star,
} from 'lucide-react-native';
import { DarkColors as Colors } from '@/constants/Colors';
import { allTools, categories, getTrendingTools, getLatestTools, searchTools, TOTAL_TOOLS_COUNT } from '@/constants/Tools';
import { useStorageStore } from '@/stores/useStorageStore';

const { width } = Dimensions.get('window');

// Icon mapping for categories
const getCategoryIcon = (iconName: string, color: string, size = 32) => {
  const icons: { [key: string]: React.ReactNode } = {
    'DollarSign': <DollarSign size={size} color={color} />,
    'Heart': <Heart size={size} color={color} />,
    'Calculator': <Calculator size={size} color={color} />,
    'ArrowLeftRight': <ArrowLeftRight size={size} color={color} />,
    'Sparkles': <Sparkles size={size} color={color} />,
    'Gamepad2': <Gamepad2 size={size} color={color} />,
    'Grid3x3': <Brain size={size} color={color} />,
    'TrendingUp': <TrendingUp size={size} color={color} />,
    'Zap': <Zap size={size} color={color} />,
    'Home': <HomeIcon size={size} color={color} />,
    'Leaf': <Leaf size={size} color={color} />,
    'Type': <Type size={size} color={color} />,
    'Cpu': <Cpu size={size} color={color} />,
  };
  return icons[iconName] || <Calculator size={size} color={color} />;
};

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { favorites, history } = useStorageStore();

  // Get search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchTools(searchQuery).slice(0, 5);
  }, [searchQuery]);

  // Get favorite tools
  const favoriteTools = useMemo(() => {
    return allTools.filter(tool => favorites.includes(tool.path)).slice(0, 4);
  }, [favorites]);

  // Get recent tools from history
  const recentTools = useMemo(() => {
    return history
      .map(h => allTools.find(t => t.path === h.path))
      .filter(Boolean)
      .slice(0, 4);
  }, [history]);

  const trendingTools = getTrendingTools();
  const latestTools = getLatestTools();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgPrimary} />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Header - Stylish Plainly Title */}
        <View style={styles.heroSection}>
          <Text style={[styles.heroTitle, { color: Colors.textPrimary }]}>Plainly</Text>
          <Text style={[styles.heroTagline, { color: Colors.accentPrimary }]}>The Tool Hub</Text>
          <Text style={[styles.heroSubtitle, { color: Colors.textSecondary }]}>
            {TOTAL_TOOLS_COUNT}+ free tools at your fingertips
          </Text>
        </View>

        {/* Search Bar - Glassmorphism */}
        <View style={[styles.searchContainer, { backgroundColor: Colors.bgCard, borderColor: Colors.borderPrimary }]}>
          <Search size={20} color={Colors.textTertiary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: Colors.textPrimary }]}
            placeholder="Search tools..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <View style={styles.searchResults}>
            {searchResults.map((tool) => (
              <TouchableOpacity 
                key={tool.id} 
                style={styles.searchResultItem}
                onPress={() => {
                  setSearchQuery('');
                  router.push({ pathname: '/tool/[id]', params: { id: tool.id } });
                }}
              >
                <View style={styles.searchResultLeft}>
                  {tool.isAI ? (
                    <Sparkles size={18} color={Colors.accentPrimary} />
                  ) : (
                    <Calculator size={18} color={Colors.textTertiary} />
                  )}
                  <Text style={styles.searchResultName}>{tool.name}</Text>
                </View>
                <Text style={styles.searchResultCategory}>{tool.category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Recent - if user has history */}
        {recentTools.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Zap size={20} color={Colors.accentPrimary} />
                <Text style={styles.sectionTitle}>Recent</Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/history')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.quickAccessGrid}>
              {recentTools.slice(0, 4).map((tool, index) => (
                <TouchableOpacity 
                  key={`${tool?.id}-${index}`} 
                  style={styles.quickAccessCard}
                  onPress={() => tool && router.push({ pathname: '/tool/[id]', params: { id: tool.id } })}
                  activeOpacity={0.7}
                >
                  <View style={styles.quickAccessIcon}>
                    {tool?.isAI ? (
                      <Sparkles size={20} color={Colors.accentPrimary} />
                    ) : (
                      <Calculator size={20} color={Colors.textSecondary} />
                    )}
                  </View>
                  <Text style={styles.quickAccessName} numberOfLines={1}>{tool?.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Categories Section - Matching Stitch Design */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity 
                key={category.id} 
                style={styles.categoryCard}
                onPress={() => router.push({ pathname: '/explore', params: { category: category.id } })}
                activeOpacity={0.7}
              >
                <View style={[styles.categoryIconContainer, { backgroundColor: `${category.color}15` }]}>
                  {getCategoryIcon(category.icon, category.color, 24)}
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryCount}>{category.count}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Trending Now Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <TrendingUp size={20} color={Colors.accentPrimary} />
              <Text style={styles.sectionTitle}>Trending Now</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/explore')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {trendingTools.map((tool) => (
              <TouchableOpacity 
                key={tool.id} 
                style={styles.toolCard}
                onPress={() => router.push({ pathname: '/tool/[id]', params: { id: tool.id } })}
                activeOpacity={0.8}
              >
                <View style={styles.toolCardGlow} />
                <View style={styles.toolCardContent}>
                  <View style={styles.toolCardIconWrapper}>
                    <Calculator size={24} color={Colors.accentPrimary} />
                  </View>
                  <Text style={styles.toolCardName} numberOfLines={2}>{tool.name}</Text>
                  <Text style={styles.toolCardCategory}>{tool.category}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* AI Tools Section - Premium styled */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Sparkles size={20} color={Colors.accentPrimary} />
              <Text style={styles.sectionTitle}>AI Powered</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/explore')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {latestTools.map((tool) => (
              <TouchableOpacity 
                key={tool.id} 
                style={[styles.toolCard, styles.aiToolCard]}
                onPress={() => router.push({ pathname: '/tool/[id]', params: { id: tool.id } })}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['rgba(168, 85, 247, 0.15)', 'rgba(99, 102, 241, 0.05)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.aiToolGradient}
                />
                <View style={styles.toolCardContent}>
                  <View style={[styles.toolCardIconWrapper, styles.aiIconWrapper]}>
                    <Sparkles size={24} color={Colors.accentPrimary} />
                  </View>
                  <Text style={styles.toolCardName} numberOfLines={2}>{tool.name}</Text>
                  <View style={styles.aiTag}>
                    <Star size={10} color={Colors.accentPrimary} />
                    <Text style={styles.aiTagText}>AI</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Bottom Padding */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  
  // Hero Section - Stylish Plainly Title
  heroSection: {
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 52,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -2,
    fontStyle: 'italic',
  },
  heroTagline: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.accentPrimary,
    letterSpacing: 6,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 16,
  },

  // Search Bar - Glassmorphism
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  searchResults: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.borderSecondary,
    overflow: 'hidden',
  },
  searchResultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderPrimary,
  },
  searchResultLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchResultName: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  searchResultCategory: {
    fontSize: 12,
    color: Colors.textTertiary,
    backgroundColor: Colors.bgElevated,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  // Section Styles
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    color: Colors.accentPrimary,
    fontWeight: '500',
  },

  // Categories Grid - Larger cards
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: (width - 52) / 2,
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  categoryIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 13,
    color: Colors.textTertiary,
  },

  // Tool Cards
  horizontalScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  toolCard: {
    width: 150,
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    padding: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
    overflow: 'hidden',
    position: 'relative',
  },
  toolCardGlow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.accentGlow,
  },
  toolCardContent: {
    position: 'relative',
    zIndex: 1,
  },
  toolCardIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  aiToolCard: {
    borderColor: Colors.borderAccent,
  },
  aiToolGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
  aiIconWrapper: {
    backgroundColor: Colors.accentGlow,
  },
  toolCardName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 6,
    lineHeight: 18,
  },
  toolCardCategory: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  aiTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.accentGlow,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  aiTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.accentPrimary,
  },

  // Quick Access Grid
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAccessCard: {
    width: (width - 52) / 2,
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  quickAccessIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickAccessName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
});
