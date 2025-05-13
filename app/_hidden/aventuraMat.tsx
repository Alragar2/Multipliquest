import React from "react";
import { View, Text, StyleSheet, ImageBackground, FlatList, TouchableOpacity, Image } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import DialogBox from "../_components/DialogBox";
import { useState, useEffect, useCallback } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

type Dialog = {
  character: string;
  image: string;
  text: string;
};

type WorldDialogs = {
  worldId: number;
  dialogs: Dialog[];
};

const dialogs: WorldDialogs[] = require("../../data/dialogs.json");

const worlds = [
  { id: 1, name: "El bosque de los numeros", image: require("../../assets/images/bosque_de_los_numeros.png"), locked: false },
  { id: 2, name: "La cueva del producto", image: require("../../assets/images/cueva_del_producto.png"), locked: true },
  { id: 3, name: "El desierto de los factores", image: require("../../assets/images/desierto_de_los_factores.png"), locked: true },
  { id: 4, name: "La torre numerada", image: require("../../assets/images/torre_numerada.png"), locked: true },
];

const WorldItem = ({ item, onPress }: { item: typeof worlds[0]; onPress: (id: number) => void }) => {
  return (
    <TouchableOpacity 
      onPress={() => !item.locked && onPress(item.id)} 
      style={styles.button}
      disabled={item.locked}
    >
      <View style={[styles.button, item.locked && styles.lockedButton]}>
        <Image 
          source={item.image} 
          style={[styles.image, item.locked && styles.lockedImage]} 
        />
        <Text style={[styles.worldName, item.locked && styles.lockedText]}>
          {item.name} {item.locked && "🔒"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default function AventuraMatematicaScreen() {
  const router = useRouter();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [currentDialogIndex, setCurrentDialogIndex] = useState(0);
  const [currentDialogs, setCurrentDialogs] = useState<Dialog[]>([]);
  const [currentWorldId, setCurrentWorldId] = useState<number | null>(null);
  const [worldsState, setWorldsState] = useState(worlds);

  const handlePress = (worldId: number) => {
    const worldDialogs = dialogs.find((dialog) => dialog.worldId === worldId)?.dialogs || [];
    if (worldDialogs.length > 0) {
      setCurrentDialogs(worldDialogs);
      setCurrentDialogIndex(0);
      setDialogVisible(true);
      setCurrentWorldId(worldId);
    } else {
      router.push(`/_hidden/mundo/${worldId}`);
    }
  };

  const closeDialog = () => {
    if (currentDialogIndex < currentDialogs.length - 1) {
      setCurrentDialogIndex(currentDialogIndex + 1);
    } else {
      setDialogVisible(false);
      router.push(`/_hidden/mundo/${currentWorldId}`);
      unlockNextWorld(currentWorldId || 0); // Desbloquear el siguiente mundo
    }
  };

  // Cargar el progreso guardado
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const savedProgress = await AsyncStorage.getItem('worldsProgress');
        if (savedProgress) {
          const unlockedWorlds = JSON.parse(savedProgress);
          console.log('Cargando mundos desbloqueados:', unlockedWorlds);
          
          // Actualizar el estado de los mundos con los desbloqueados
          const updatedWorlds = worlds.map((world) => ({
            ...world,
            locked: !unlockedWorlds.includes(world.id)
          }));
          
          setWorldsState(updatedWorlds);
        }
      } catch (error) {
        console.error('Error al cargar el progreso:', error);
      }
    };

    loadProgress();
    
    // También verificamos si hay un mundo completado al cargar la pantalla
    const checkCompletedWorld = async () => {
      try {
        const completedWorldId = await AsyncStorage.getItem('completedWorldId');
        if (completedWorldId) {
          console.log('Mundo completado detectado al cargar:', completedWorldId);
          await AsyncStorage.removeItem('completedWorldId');
          setTimeout(() => unlockNextWorld(Number(completedWorldId)), 500);
        }
      } catch (error) {
        console.error('Error al verificar mundo completado:', error);
      }
    };
    
    checkCompletedWorld();
  }, []);

  // Función para desbloquear el siguiente mundo
  const unlockNextWorld = async (completedWorldId: number) => {
    console.log('Intentando desbloquear mundo después de:', completedWorldId);
    const nextWorldId = completedWorldId + 1;
    
    // Obtener el estado más reciente de los mundos desde AsyncStorage
    let currentWorlds = [...worldsState];
    try {
      const savedProgress = await AsyncStorage.getItem('worldsProgress');
      if (savedProgress) {
        const unlockedWorldIds = JSON.parse(savedProgress);
        currentWorlds = worlds.map((world) => ({
          ...world,
          locked: !unlockedWorldIds.includes(world.id)
        }));
      }
    } catch (error) {
      console.error('Error al obtener progreso actual:', error);
    }
    
    // Verificar si existe un siguiente mundo
    const nextWorld = currentWorlds.find(world => world.id === nextWorldId);
    console.log('Siguiente mundo:', nextWorld);
    
    if (nextWorld && nextWorld.locked) {
      console.log('Desbloqueando mundo:', nextWorldId);
      
      // Crear una nueva lista de mundos con el siguiente mundo desbloqueado
      const updatedWorlds = currentWorlds.map(world => 
        world.id === nextWorldId ? { ...world, locked: false } : world
      );
      
      // Guardar el progreso antes de actualizar el estado
      try {
        const unlockedWorldIds = updatedWorlds
          .filter(world => !world.locked)
          .map(world => world.id);
        
        await AsyncStorage.setItem('worldsProgress', JSON.stringify(unlockedWorldIds));
        console.log('Mundo desbloqueado:', nextWorldId);
        console.log('Progreso guardado:', unlockedWorldIds);
        
        // Actualizar el estado después de guardar
        setWorldsState(updatedWorlds);
      } catch (error) {
        console.error('Error al guardar el progreso:', error);
      }
    } else {
      if (nextWorld) {
        console.log('El mundo ya está desbloqueado:', nextWorldId);
      } else {
        console.log('No existe un siguiente mundo:', nextWorldId);
      }
    }
  };



  // Verificar si hay un mundo completado cada vez que la pantalla se enfoca
  useFocusEffect(
    useCallback(() => {
      const checkCompletedWorld = async () => {
        try {
          const completedWorldId = await AsyncStorage.getItem('completedWorldId');
          if (completedWorldId) {
            console.log('Mundo completado detectado:', completedWorldId);
            // Primero eliminar el ID para evitar procesar el mismo mundo múltiples veces
            await AsyncStorage.removeItem('completedWorldId');
            // Luego desbloquear el siguiente mundo
            unlockNextWorld(Number(completedWorldId));
          }
        } catch (error) {
          console.error('Error al verificar el mundo completado:', error);
        }
      };

      // Ejecutar inmediatamente al enfocar la pantalla
      checkCompletedWorld();
      
      // No es necesario retornar una función de limpieza
    }, []) // La dependencia vacía asegura que se ejecute solo cuando cambia el enfoque
  );

  return (
    <ImageBackground
      source={require("../../assets/images/fondo_aventura_mat.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <FlatList
          data={worldsState}
          renderItem={({ item }) => <WorldItem item={item} onPress={handlePress} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false} // Oculta la barra de desplazamiento
        />
        <DialogBox 
          visible={dialogVisible} 
          onClose={closeDialog} 
          dialogText={currentDialogs[currentDialogIndex]?.text} 
          dialogImage={currentDialogs[currentDialogIndex]?.image} 
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 1200, // Limita el ancho máximo en pantallas grandes
    width: "100%",
    alignSelf: "center", // Centra el contenido en la web
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    width: "100%", // Asegura que el contenedor ocupe todo el ancho
  },
  list: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%", // Asegura que el FlatList ocupe todo el ancho
  },
  button: {
    alignItems: "center",
    marginVertical: 10,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  worldName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
    textAlign: "center",
  },
  lockedButton: {
    opacity: 0.7,
  },
  lockedImage: {
    opacity: 0.5,
  },
  lockedText: {
    color: "#aaa",
  },
});