import React, { useEffect, useState } from 'react';
import { Stack } from "expo-router";
import { MusicProvider } from "./_components/MusicContext"; // Usar named import
import { View, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { Audio } from 'expo-av';

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const prepareAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          staysActiveInBackground: true,
          allowsRecordingIOS: false,
          ...(Platform.OS === "ios" ? { playsInSilentModeIOS: true } : {}),
          ...(Platform.OS === "android" ? { shouldDuckAndroid: false, playThroughEarpieceAndroid: false } : {}),
        });
      } catch (error) {
        // No bloqueamos la app si falla la configuración
      } finally {
        setTimeout(() => setIsLoading(false), Platform.OS === 'android' ? 1000 : 500);
      }
    };
    prepareAudio();
  }, []);

  console.log('🏗️ RootLayout render, isLoading:', isLoading);

  if (isLoading) {
    console.log('🏗️ RootLayout: Mostrando pantalla de carga');
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Cargando Multipliquest...</Text>
      </View>
    );
  }

  console.log('🏗️ RootLayout: Montando app principal');

  return (
    <MusicProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="_hidden" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="screens" />
      </Stack>
    </MusicProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#89E7FF',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  }
});
