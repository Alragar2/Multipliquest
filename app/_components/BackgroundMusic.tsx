import { useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function BackgroundMusic() {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);


  useEffect(() => {
    

    const setupAudio = async () => {
      try {

        await Audio.setAudioModeAsync({
          staysActiveInBackground: true,
          allowsRecordingIOS: false,
          ...(Platform.OS === "ios" ? { playsInSilentModeIOS: true } : {}),
          ...(Platform.OS === "android"
            ? { shouldDuckAndroid: false, playThroughEarpieceAndroid: false }
            : {}),
        });


        const { sound } = await Audio.Sound.createAsync(
          require("../../assets/music/background_music.mp3"),
          {
            shouldPlay: true,
            isLooping: true,
            volume: 0.5,
          }
        );

        soundRef.current = sound;

        // Configurar verificación de cambios en AsyncStorage
        checkIntervalRef.current = setInterval(async () => {
          try {
            const savedVolume = await AsyncStorage.getItem("music_volume");
            const savedMuted = await AsyncStorage.getItem("music_muted");

            const newVolume = savedVolume ? parseFloat(savedVolume) : 0.5;
            const newMuted = savedMuted === "true";

            if (newVolume !== volume || newMuted !== muted) {
              
              setVolume(newVolume);
              setMuted(newMuted);

              if (soundRef.current) {
                await soundRef.current.setVolumeAsync(newMuted ? 0 : newVolume);
                if (newMuted) {
                  await soundRef.current.pauseAsync();
                } else {
                  const status = await soundRef.current.getStatusAsync();
                  if (
                    status.isLoaded &&
                    !("error" in status) &&
                    !status.isPlaying
                  ) {
                    await soundRef.current.playAsync();
                  }
                }
              }
            }
          } catch (error) {
            console.error("Error verificando cambios de audio:", error);
          }
        }, 1000);
      } catch (error) {
        console.error("🎵 BackgroundMusic: ❌ ERROR completo:", error);
      }
    };

    setupAudio();

    return () => {
      console.log("🎵 BackgroundMusic: CLEANUP - desmontando");
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  return null;
}