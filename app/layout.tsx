import React, { useEffect, useState } from 'react';
import { Stack } from "expo-router";
import { View, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        console.log('Preparando app...');
      } catch (error) {
        console.error('Error preparando app:', error);
      } finally {
        setTimeout(() => setIsLoading(false), Platform.OS === 'android' ? 1000 : 500);
      }
    };
    prepareApp();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Cargando Multipliquest...</Text>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="_hidden" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="screens" />
    </Stack>
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