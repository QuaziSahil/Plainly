import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { StatusBar, View, BackHandler } from 'react-native';
import { DarkColors as Colors } from '@/constants/Colors';
import AIFloatingButton from '@/components/AIFloatingButton';
import AIChat from '@/components/AIChat';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const router = useRouter();
  const segments = useSegments();
  
  // Build dark theme for navigation
  const navigationTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: Colors.accentPrimary,
      background: Colors.bgPrimary,
      card: Colors.bgCard,
      text: Colors.textPrimary,
      border: Colors.borderPrimary,
      notification: Colors.accentPrimary,
    },
  };

  // Handle Android hardware back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // If AI chat is open, close it first
      if (isChatOpen) {
        setIsChatOpen(false);
        return true; // Prevent default behavior
      }
      
      // Check if we're on a nested screen (not on tabs root)
      // segments looks like: ['(tabs)'] for home, ['tool', '[id]'] for tool detail, ['tools', 'tip-calculator'] for native tools
      if (segments.length > 1 || (segments.length === 1 && segments[0] !== '(tabs)')) {
        // We're on a nested screen, let router handle back
        if (router.canGoBack()) {
          router.back();
          return true; // Prevent default behavior
        }
      }
      
      // On home tab, allow default behavior (exit app)
      return false;
    });

    return () => backHandler.remove();
  }, [isChatOpen, segments, router]);

  return (
    <ThemeProvider value={navigationTheme}>
      <StatusBar 
        barStyle="light-content"
        backgroundColor={Colors.bgPrimary} 
      />
      <View style={{ flex: 1, backgroundColor: Colors.bgPrimary }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="modal" 
            options={{ 
              presentation: 'modal',
              headerStyle: { backgroundColor: Colors.bgCard },
              headerTintColor: Colors.textPrimary,
            }} 
          />
        </Stack>
        
        {/* AI Floating Button */}
        {!isChatOpen && (
          <AIFloatingButton onPress={() => setIsChatOpen(true)} />
        )}
        
        {/* AI Chat Modal */}
        <AIChat 
          visible={isChatOpen} 
          onClose={() => setIsChatOpen(false)} 
        />
      </View>
    </ThemeProvider>
  );
}
