import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Heart, Share2, RotateCcw } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { getToolById, getToolByPath } from '@/constants/Tools';
import { useStorageStore } from '@/stores/useStorageStore';

interface ToolHeaderProps {
  title: string;
  toolId?: string;
  toolPath?: string;
  onRefresh?: () => void;
}

export default function ToolHeader({ title, toolId, toolPath, onRefresh }: ToolHeaderProps) {
  const router = useRouter();
  const { toggleFavorite, isFavorite } = useStorageStore();

  const tool = useMemo(() => {
    if (toolId) {
      const found = getToolById(toolId);
      if (found) {
        return found;
      }
    }
    if (toolPath) {
      return getToolByPath(toolPath);
    }
    return undefined;
  }, [toolId, toolPath]);

  const resolvedPath = tool?.path || toolPath || `/${toolId || ''}`;
  const resolvedTitle = tool?.name || title;
  const resolvedDescription = tool?.description || 'Check out this Plainly tool.';

  const favorite = resolvedPath ? isFavorite(resolvedPath) : false;

  const handleToggleFavorite = () => {
    if (resolvedPath) {
      toggleFavorite(resolvedPath);
    }
  };

  const handleShare = async () => {
    if (!resolvedPath) return;
    try {
      const webUrl = `https://plainly.live${resolvedPath}`;
      await Share.share({
        title: resolvedTitle,
        message: `Check out ${resolvedTitle} on Plainly Tools!\n\n${resolvedDescription}\n\n${webUrl}`,
      });
    } catch (error) {
      console.error('Error sharing tool:', error);
    }
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft size={22} color={Colors.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.headerTitle} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.headerActions}>
        {onRefresh && (
          <TouchableOpacity style={styles.actionButton} onPress={onRefresh}>
            <RotateCcw size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.actionButton} onPress={handleToggleFavorite}>
          <Heart
            size={20}
            color={favorite ? Colors.error : Colors.textPrimary}
            fill={favorite ? Colors.error : 'transparent'}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Share2 size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderPrimary,
    minHeight: 56,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginHorizontal: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
});
