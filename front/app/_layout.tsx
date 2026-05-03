import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="producto/[id]" />
        <Stack.Screen name="experiencia/[id]" />
        <Stack.Screen name="contacto" />
        <Stack.Screen name="Perfil" />
        <Stack.Screen name="productos" />
        <Stack.Screen name="servicio" />
        <Stack.Screen name="reserva" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}