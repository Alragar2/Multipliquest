import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ImageBackground, Button, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import worldsData from "../../../data/worlds.json";
import FourOptionsMode from "../../_components/modes/FourOptionsMode"; // Importa el componente del modo
import TimeModifier from "../../_components/modifiers/TimeModifier"; // Importa el modificador de tiempo
import Classic from "../../_components/modes/Classic"; // Importa el componente del modo clásico
import TrueFalseMode from "../../_components/modes/TrueFalseMode"; // Importa el componente del modo verdadero/falso
import GuessNextMode from "../../_components/modes/GuessNextMode"; // Importa el componente del modo "Adivina el siguiente"
import GuessFactorMode from "../../_components/modes/GuessFactorMode"; // Importa el componente del modo "Adivina el factor"
import MatchingMode from "../../_components/modes/MatchingMode"; // Importa el componente del modo "Emparejamiento"
import TwoDigitMultiplicationMode from "../../_components/modes/TwoDigitMultiplicationMode"; // Importa el componente del modo de multiplicación de dos dígitos
import ErrorLimitModifier from "../../_components/modifiers/ErrorLimitModifier"; // Importa el modificador de límite de errores
import BlinkModifier from "../../_components/modifiers/BlinkModifier"; // Importa el modificador de parpadeo

// Mapeo estático de imágenes
const worldImages: Record<number, any> = {
  1: require("../../../assets/images/background_bosque.png"),
  2: require("../../../assets/images/background_cueva.png"),
  3: require("../../../assets/images/background_desierto.png"),
  4: require("../../../assets/images/background_torre.png"),
};

export default function MundoScreen() {
  const { id } = useLocalSearchParams(); // Obtiene el id del mundo seleccionado
  const router = useRouter();
  const [currentLevel, setCurrentLevel] = useState<number>(0); // Nivel actual
  const [world, setWorld] = useState<any>(null); // Datos del mundo actual
  const [subLevel, setSubLevel] = useState<number>(0); // Subnivel dentro del nivel actual

  useEffect(() => {
    const selectedWorld = worldsData.find((world) => world.id === Number(id));
    if (selectedWorld) {
      if (!selectedWorld.unlocked) {
        const previousWorld = worldsData.find((world) => world.id === selectedWorld.id - 1); // Encuentra el mundo anterior
        if (!previousWorld || !previousWorld.completed) {
          Alert.alert(
            "Acceso denegado",
            "Debes completar todos los niveles del bioma anterior para desbloquear este bioma.",
            [{ text: "Volver", onPress: () => router.back() }]
          );
          return;
        }
      }
      setWorld(selectedWorld);
    }
  }, [id]);

  const handleSubLevelComplete = () => {
    const totalSubLevels = world.levels[currentLevel].subLevels || 1; // Usa 1 como valor predeterminado si no está definido
    if (subLevel < totalSubLevels - 1) {
      setSubLevel((prev) => prev + 1); // Avanza al siguiente subnivel
    } else {
      handleLevelComplete(); // Completa el nivel actual si se completaron los subniveles
    }
  };

  const handleLevelComplete = () => {
    const updatedWorlds = [...worldsData];
    const currentWorld = updatedWorlds.find((w) => w.id === Number(id));
    
    // Verificar que currentWorld existe
    if (!currentWorld) {
      console.error("No se encontró el mundo actual");
      return;
    }
    
    const currentLevelData = currentWorld.levels[currentLevel];
    if (!currentLevelData) {
      console.error("No se encontró el nivel actual");
      return;
    }
  
    currentLevelData.completed = true; // Marca el nivel como completado
  
    // Verifica si todos los niveles del bioma están completados
    const allLevelsCompleted = currentWorld.levels.every((level) => level.completed);
    if (allLevelsCompleted) {
      currentWorld.completed = true; // Marca el bioma como completado
      
      // Notificar a la pantalla de aventura matemática que se completó el mundo
      try {
        if (typeof world.onComplete === 'function') {
          world.onComplete();
        }
      } catch (error) {
        console.error("Error al ejecutar el callback onComplete:", error);
      }
  
      // Desbloquea el siguiente bioma en el contexto local
      const nextWorld = updatedWorlds.find((w) => w.id === currentWorld.id + 1);
      if (nextWorld) {
        nextWorld.unlocked = true;
      }
    }
  
    if (currentLevel < currentWorld.levels.length - 1) {
      setCurrentLevel((prev) => prev + 1); // Avanza al siguiente nivel
      setSubLevel(0); // Reinicia los subniveles
    } else {
      // Notificar que se ha completado el bioma para desbloquear el siguiente
      const worldId = Number(id);
      // Guardar el ID del mundo completado en AsyncStorage
      AsyncStorage.setItem('completedWorldId', worldId.toString())
        .then(() => {
          console.log('ID de mundo completado guardado:', worldId);
          Alert.alert("¡Felicidades!", "Has completado todos los niveles de este bioma.", [
            { 
              text: "Aceptar", 
              onPress: () => {
                // Regresar a la pantalla anterior
                router.back();
              }
            },
          ]);
        })
        .catch((error: Error) => {
          console.error('Error al guardar el mundo completado:', error);
          Alert.alert("¡Felicidades!", "Has completado todos los niveles de este bioma.", [
            { text: "Aceptar", onPress: () => router.back() },
          ]);
        });
    }
  };

  const handleTimeUp = () => {
    Alert.alert("¡Tiempo agotado!", "Has perdido el nivel.", [
      { text: "Volver", onPress: () => router.back() },
    ]);
  };

  const handleError = () => {
  };

  const renderMode = (onError: () => void) => {
    const currentChallenge = world.levels[currentLevel];
    switch (currentChallenge.mode) {
      case "four_options":
        return <FourOptionsMode biome={world.id} onComplete={handleSubLevelComplete}  onError={onError}/>;
      case "classic":
        return <Classic onComplete={handleSubLevelComplete} onError={onError}/>;
      case "true_false":
        return <TrueFalseMode onComplete={handleSubLevelComplete} onError={onError}/>;
      case "guess_next":
        return <GuessNextMode onComplete={handleSubLevelComplete} onError={onError}/>;
      case "guess_factor":
        return <GuessFactorMode onComplete={handleSubLevelComplete} onError={onError}/>;
      case "matching":
        return <MatchingMode onComplete={handleSubLevelComplete} onError={onError}/>;
      case "two_digit_multiplication":
        return <TwoDigitMultiplicationMode onComplete={handleSubLevelComplete} onError={onError}/>;
      default:
        return <Text style={styles.challenge}>Modo no implementado: {currentChallenge.mode}</Text>;
    }
  };

  const renderWithModifiers = () => {
    const currentChallenge = world.levels[currentLevel];
    switch (currentChallenge.modifyer) {
      case "timer":
        return (
          <TimeModifier
            timeLimit={currentChallenge.timeLimit || 20}
            onTimeUp={handleTimeUp}
          >
            {renderMode(() => {})}
          </TimeModifier>
        );
      case "error_limit":
        return (
          <ErrorLimitModifier
            maxErrors={currentChallenge.maxErrors || 3}
            onError={handleError}
            onLose={() => router.back()}
          >
            {renderMode(handleError)}
          </ErrorLimitModifier>
        );
      case "blink":
        return (
          <BlinkModifier
            blinkDuration={currentChallenge.blinkDuration || 1000}
            onBlink={() => {}}
            onLose={() => router.back()}
            onComplete={handleSubLevelComplete}
            onError={handleError}
          >
            {renderMode(handleError)}
          </BlinkModifier>
        );
      default:
        return renderMode(() => {});
    }
  };

  if (!world) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Mundo no encontrado</Text>
        <Button title="Volver" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <ImageBackground source={worldImages[world.id as number]} style={styles.background} resizeMode="cover">
      <View style={styles.container}>
        <Text style={styles.title}>{world.name}</Text>
        <Text style={styles.levelTitle}>Nivel {currentLevel + 1} - Subnivel {subLevel + 1}</Text>
        {renderWithModifiers()}
        <Button title="Volver" onPress={() => router.back()} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  levelTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 10,
    textAlign: "center",
  },
  challenge: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  errorText: {
    fontSize: 20,
    color: "red",
    textAlign: "center",
    marginBottom: 20,
  },
});
