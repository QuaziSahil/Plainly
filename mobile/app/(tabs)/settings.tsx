import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Switch,
  Linking,
} from 'react-native';
import { 
  Settings as SettingsIcon, 
  Vibrate, 
  Globe, 
  DollarSign,
  Hash,
  Info,
  FileText,
  Shield,
  Mail,
  Star,
  ExternalLink,
  ChevronRight
} from 'lucide-react-native';
import { DarkColors as Colors } from '@/constants/Colors';
import { Typography, Spacing, BorderRadius } from '@/constants/Theme';
import { useSettingsStore } from '@/stores/useSettingsStore';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen() {
  const { 
    decimalPlaces, 
    setDecimalPlaces,
    currency,
    setCurrency,
    unitSystem,
    setUnitSystem,
    hapticsEnabled,
    setHapticsEnabled,
  } = useSettingsStore();

  const currencies = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD'];

  const handleHapticToggle = (value: boolean) => {
    setHapticsEnabled(value);
    if (value) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgPrimary} />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <SettingsIcon size={24} color={Colors.accentPrimary} />
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* Calculator Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calculator</Text>
          
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Hash size={20} color={Colors.textSecondary} />
                <Text style={styles.settingLabel}>Decimal Places</Text>
              </View>
              <View style={styles.stepper}>
                <TouchableOpacity 
                  style={styles.stepperBtn}
                  onPress={() => setDecimalPlaces(Math.max(0, decimalPlaces - 1))}
                >
                  <Text style={styles.stepperBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.stepperValue}>{decimalPlaces}</Text>
                <TouchableOpacity 
                  style={styles.stepperBtn}
                  onPress={() => setDecimalPlaces(Math.min(10, decimalPlaces + 1))}
                >
                  <Text style={styles.stepperBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <DollarSign size={20} color={Colors.textSecondary} />
                <Text style={styles.settingLabel}>Currency</Text>
              </View>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.currencyScroll}
              >
                {currencies.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.currencyOption,
                      currency === c && styles.currencyOptionActive,
                    ]}
                    onPress={() => setCurrency(c)}
                  >
                    <Text style={[
                      styles.currencyOptionText,
                      currency === c && styles.currencyOptionTextActive,
                    ]}>
                      {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Globe size={20} color={Colors.textSecondary} />
                <Text style={styles.settingLabel}>Unit System</Text>
              </View>
              <View style={styles.unitToggle}>
                <TouchableOpacity
                  style={[
                    styles.unitOption,
                    unitSystem === 'metric' && styles.unitOptionActive,
                  ]}
                  onPress={() => setUnitSystem('metric')}
                >
                  <Text style={[
                    styles.unitOptionText,
                    unitSystem === 'metric' && styles.unitOptionTextActive,
                  ]}>
                    Metric
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.unitOption,
                    unitSystem === 'imperial' && styles.unitOptionActive,
                  ]}
                  onPress={() => setUnitSystem('imperial')}
                >
                  <Text style={[
                    styles.unitOptionText,
                    unitSystem === 'imperial' && styles.unitOptionTextActive,
                  ]}>
                    Imperial
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Vibrate size={20} color={Colors.textSecondary} />
                <Text style={styles.settingLabel}>Haptic Feedback</Text>
              </View>
              <Switch
                value={hapticsEnabled}
                onValueChange={handleHapticToggle}
                trackColor={{ false: Colors.bgElevated, true: Colors.accentPrimary }}
                thumbColor={Colors.textPrimary}
              />
            </View>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.linkRow}
              onPress={() => openLink('https://plainly.live')}
            >
              <View style={styles.settingInfo}>
                <Globe size={20} color={Colors.textSecondary} />
                <Text style={styles.settingLabel}>Visit Website</Text>
              </View>
              <ExternalLink size={18} color={Colors.textTertiary} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.linkRow}
              onPress={() => openLink('https://plainly.live/privacy')}
            >
              <View style={styles.settingInfo}>
                <Shield size={20} color={Colors.textSecondary} />
                <Text style={styles.settingLabel}>Privacy Policy</Text>
              </View>
              <ChevronRight size={18} color={Colors.textTertiary} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.linkRow}
              onPress={() => openLink('https://plainly.live/terms')}
            >
              <View style={styles.settingInfo}>
                <FileText size={20} color={Colors.textSecondary} />
                <Text style={styles.settingLabel}>Terms of Service</Text>
              </View>
              <ChevronRight size={18} color={Colors.textTertiary} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.linkRow}
              onPress={() => openLink('mailto:peakliterature@gmail.com')}
            >
              <View style={styles.settingInfo}>
                <Mail size={20} color={Colors.textSecondary} />
                <Text style={styles.settingLabel}>Contact Support</Text>
              </View>
              <ChevronRight size={18} color={Colors.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>Plainly - The Tool Hub</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appCopyright}>© 2025 Plainly. All rights reserved.</Text>
        </View>

        <View style={{ height: 40 }} />
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
    paddingHorizontal: Spacing.base,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize.h2,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.bodySm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    paddingLeft: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  cardLabel: {
    fontSize: Typography.fontSize.bodySm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  themeSelector: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  themeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  themeOptionActive: {
    backgroundColor: Colors.accentGlow,
    borderColor: Colors.accentPrimary,
  },
  themeOptionText: {
    fontSize: Typography.fontSize.bodySm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  themeOptionTextActive: {
    color: Colors.accentPrimary,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  settingLabel: {
    fontSize: Typography.fontSize.body,
    color: Colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderPrimary,
    marginVertical: Spacing.md,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnText: {
    fontSize: 18,
    color: Colors.textPrimary,
    fontWeight: Typography.fontWeight.bold,
  },
  stepperValue: {
    fontSize: Typography.fontSize.body,
    color: Colors.textPrimary,
    fontWeight: Typography.fontWeight.semibold,
    minWidth: 24,
    textAlign: 'center',
  },
  currencyScroll: {
    marginLeft: Spacing.sm,
  },
  currencyOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.bgElevated,
    marginRight: Spacing.xs,
  },
  currencyOptionActive: {
    backgroundColor: Colors.accentGlow,
  },
  currencyOptionText: {
    fontSize: Typography.fontSize.bodySm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  currencyOptionTextActive: {
    color: Colors.accentPrimary,
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.bgElevated,
    borderRadius: BorderRadius.lg,
    padding: 2,
  },
  unitOption: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  unitOptionActive: {
    backgroundColor: Colors.accentGlow,
  },
  unitOptionText: {
    fontSize: Typography.fontSize.bodySm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  unitOptionTextActive: {
    color: Colors.accentPrimary,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  appName: {
    fontSize: Typography.fontSize.bodyLg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  appVersion: {
    fontSize: Typography.fontSize.bodySm,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
  },
  appCopyright: {
    fontSize: Typography.fontSize.caption,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
});
