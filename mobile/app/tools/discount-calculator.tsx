import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Stack } from 'expo-router';
import { Tag, Percent, DollarSign, ShoppingBag } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { calculateDiscount } from '@/services/calculations';
import { useStorageStore } from '@/stores/useStorageStore';
import ToolHeader from '@/components/ToolHeader';

const DISCOUNT_PRESETS = [10, 20, 25, 30, 50, 70];

export default function DiscountCalculatorScreen() {
  const { addToHistory } = useStorageStore();
  
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calculateDiscount> | null>(null);

  const handleCalculate = () => {
    const price = parseFloat(originalPrice);
    const discount = parseFloat(discountPercent);
    if (isNaN(price) || isNaN(discount) || price <= 0 || discount < 0) return;

    const calcResult = calculateDiscount(price, discount);
    setResult(calcResult);
    
    addToHistory({
      path: '/discount-calculator',
      name: 'Discount Calculator',
      result: `$${calcResult.finalPrice} (${discount}% off)`,
      type: 'calculator',
    });
  };

  const handleReset = () => {
    setOriginalPrice('');
    setDiscountPercent('');
    setResult(null);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.bgPrimary} />
        
        <ToolHeader title="Discount Calculator" toolId="discount" onRefresh={handleReset} />

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView 
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Original Price */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Original Price</Text>
              <View style={styles.inputWrapper}>
                <DollarSign size={20} color={Colors.textTertiary} />
                <TextInput
                  style={styles.input}
                  placeholder="99.99"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="decimal-pad"
                  value={originalPrice}
                  onChangeText={setOriginalPrice}
                />
              </View>
            </View>

            {/* Discount Presets */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Discount Percentage</Text>
              <View style={styles.presetGrid}>
                {DISCOUNT_PRESETS.map((preset) => (
                  <TouchableOpacity
                    key={preset}
                    style={[
                      styles.presetButton,
                      parseFloat(discountPercent) === preset && styles.presetButtonActive,
                    ]}
                    onPress={() => setDiscountPercent(preset.toString())}
                  >
                    <Text
                      style={[
                        styles.presetButtonText,
                        parseFloat(discountPercent) === preset && styles.presetButtonTextActive,
                      ]}
                    >
                      {preset}%
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.inputWrapper}>
                <Percent size={20} color={Colors.textTertiary} />
                <TextInput
                  style={styles.input}
                  placeholder="20"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="decimal-pad"
                  value={discountPercent}
                  onChangeText={setDiscountPercent}
                />
              </View>
            </View>

            {/* Calculate Button */}
            <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
              <Tag size={20} color="#000" />
              <Text style={styles.calculateButtonText}>Calculate Discount</Text>
            </TouchableOpacity>

            {/* Results */}
            {result && (
              <View style={styles.resultsCard}>
                {/* Price Comparison */}
                <View style={styles.priceComparison}>
                  <View style={styles.priceOld}>
                    <Text style={styles.priceOldLabel}>Original</Text>
                    <Text style={styles.priceOldValue}>${parseFloat(originalPrice).toFixed(2)}</Text>
                  </View>
                  <View style={styles.priceArrow}>
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountBadgeText}>{discountPercent}% OFF</Text>
                    </View>
                  </View>
                  <View style={styles.priceNew}>
                    <Text style={styles.priceNewLabel}>Final Price</Text>
                    <Text style={styles.priceNewValue}>${result.finalPrice.toFixed(2)}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                {/* Savings */}
                <View style={styles.savingsCard}>
                  <ShoppingBag size={24} color={Colors.success} />
                  <View style={styles.savingsInfo}>
                    <Text style={styles.savingsLabel}>You Save</Text>
                    <Text style={styles.savingsValue}>${result.savings.toFixed(2)}</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                  <Text style={styles.resetButtonText}>Reset</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={{ height: 100 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderPrimary,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  presetButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  presetButtonActive: {
    backgroundColor: Colors.accentPrimary,
    borderColor: Colors.accentPrimary,
  },
  presetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  presetButtonTextActive: {
    color: '#000',
  },
  calculateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.accentPrimary,
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 24,
  },
  calculateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  resultsCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.borderSecondary,
  },
  priceComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceOld: {
    alignItems: 'center',
  },
  priceOldLabel: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginBottom: 4,
  },
  priceOldValue: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  priceArrow: {
    alignItems: 'center',
  },
  discountBadge: {
    backgroundColor: Colors.error,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  discountBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  priceNew: {
    alignItems: 'center',
  },
  priceNewLabel: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginBottom: 4,
  },
  priceNewValue: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.success,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderPrimary,
    marginVertical: 20,
  },
  savingsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: Colors.successBg,
    borderRadius: 14,
    padding: 16,
  },
  savingsInfo: {
    flex: 1,
  },
  savingsLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  savingsValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.success,
  },
  resetButton: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderSecondary,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});
