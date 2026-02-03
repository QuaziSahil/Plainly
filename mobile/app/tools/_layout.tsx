import { Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function ToolsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.bgPrimary },
        animation: 'slide_from_right',
      }}
    />
  );
}
