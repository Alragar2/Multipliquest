import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

type MusicContextType = {
  muted: boolean;
  setMuted: (muted: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
  isAudioReady: boolean;
  setAudioReady: (ready: boolean) => void;
};

const MusicContext = createContext<MusicContextType | undefined>(undefined);

function MusicProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMutedState] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const [isAudioReady, setAudioReady] = useState(false);

  console.log('🎵 MusicProvider render, children:', React.Children.count(children));

  // Cargar preferencias guardadas
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        console.log("📝 Cargando preferencias de audio...");
        const savedVolume = await AsyncStorage.getItem('music_volume');
        const savedMuted = await AsyncStorage.getItem('music_muted');

        if (savedVolume !== null) {
          const parsedVolume = parseFloat(savedVolume);
          console.log(`📊 Volumen cargado: ${parsedVolume}`);
          setVolumeState(parsedVolume);
        }

        if (savedMuted !== null) {
          const isMuted = savedMuted === 'true';
          console.log(`🔇 Estado de mute cargado: ${isMuted}`);
          setMutedState(isMuted);
        }
      } catch (error) {
        console.error('❌ Error cargando preferencias de audio:', error);
      }
    };

    loadPreferences();
  }, []);

  // Funciones simples sin useCallback para evitar problemas de referencia
  const setMuted = (value: boolean) => {
    console.log(`🔇 MusicContext: Cambiando mute de ${muted} a ${value}`);
    setMutedState(value);
    AsyncStorage.setItem('music_muted', String(value))
      .catch(error => console.error('❌ Error guardando estado de mute:', error));
  };

  const setVolume = (value: number) => {
    const safeValue = Math.max(0, Math.min(1, value));
    console.log(`📊 MusicContext: Cambiando volumen de ${volume} a ${safeValue}`);
    setVolumeState(safeValue);
    AsyncStorage.setItem('music_volume', String(safeValue))
      .catch(error => console.error('❌ Error guardando volumen:', error));
  };



  const contextValue = {
    muted,
    setMuted,
    volume,
    setVolume,
    isAudioReady,
    setAudioReady
  };

  console.log('🎵 MusicContext render:', { muted, volume });

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  );
}

// Hook que lanza error si se usa fuera del provider
export function useMusic(): MusicContextType {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusic debe usarse dentro de MusicProvider");
  }
  return context;
}

// Exportar como default y como named export
export { MusicProvider };
export default MusicProvider;