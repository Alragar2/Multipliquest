import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import PredButton from '../_components/PredButton';
import Background from '../_components/Background';
import BackgroundMusic from '../_components/BackgroundMusic'; // AÑADIR TEMPORALMENTE

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <BackgroundMusic />
      

      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/images/MultipliquestMiniLogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.menuContainer}>
        <PredButton onPress={() => router.push("/_hidden/tablas")} title="Tablas" iconName="grid-outline" size="extraLarge" />
        <PredButton onPress={() => router.push("/_hidden/dosCifras")} title="Dos cifras" iconName="calculator-outline" size="large" />
        <PredButton onPress={() => router.push("/_hidden/cortrareloj")} title="Contrarreloj" iconName="timer-outline" size="small" />
        <PredButton onPress={() => router.push("/_hidden/aventuraMat")} title="Aventura matemática" iconName="rocket-outline" size="small" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#89E7FF',
    padding: 20,
  },
  logoContainer: {
    width: '60%',
    aspectRatio: 2,
    marginBottom: 20,
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  menuContainer: {
    width: '100%',
    maxWidth: 400,
  },
  menuItem: {
    backgroundColor: '#A1E3F9',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  menuText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});