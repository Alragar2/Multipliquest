import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SimpleMusicControl() {
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);

  // Cargar preferencias al montar
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const savedVolume = await AsyncStorage.getItem('music_volume');
        const savedMuted = await AsyncStorage.getItem('music_muted');
        
        if (savedVolume !== null) setVolume(parseFloat(savedVolume));
        if (savedMuted !== null) setMuted(savedMuted === 'true');
      } catch (error) {
        console.error('Error cargando preferencias:', error);
      }
    };
    loadPreferences();
  }, []);

  const handleMutePress = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    AsyncStorage.setItem('music_muted', String(newMuted));
  };

  const handleVolumeChange = (newVolume: number) => {
    const safeVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(safeVolume);
    AsyncStorage.setItem('music_volume', String(safeVolume));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Música</Text>
      
      <View style={styles.row}>
        <Text>Silenciar</Text>
        <TouchableOpacity
          style={[styles.muteButton, muted && styles.muteButtonActive]}
          onPress={handleMutePress}
          activeOpacity={0.7}
        >
          <Text style={{ color: '#fff' }}>{muted ? 'Sí' : 'No'}</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.row}>
        <Text>Volumen</Text>
        <TouchableOpacity
          style={styles.volButton}
          onPress={() => handleVolumeChange(volume - 0.1)}
          activeOpacity={0.7}
        >
          <Text>-</Text>
        </TouchableOpacity>
        <View style={styles.sliderTrack}>
          <View style={[styles.sliderThumb, { width: `${volume * 100}%` }]} />
        </View>
        <TouchableOpacity
          style={styles.volButton}
          onPress={() => handleVolumeChange(volume + 0.1)}
          activeOpacity={0.7}
        >
          <Text>+</Text>
        </TouchableOpacity>
        <Text style={{ marginLeft: 8 }}>{Math.round(volume * 100)}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    marginVertical: 10,
  },
  muteButton: {
    marginLeft: 10,
    backgroundColor: '#888',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  muteButtonActive: {
    backgroundColor: '#d33',
  },
  volButton: {
    marginHorizontal: 8,
    backgroundColor: '#eee',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sliderTrack: {
    width: 100,
    height: 8,
    backgroundColor: '#ccc',
    borderRadius: 4,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  sliderThumb: {
    height: 8,
    backgroundColor: '#4caf50',
  },
  debug: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
});
