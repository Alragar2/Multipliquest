import React from "react";
import { View, Text, StyleSheet, ImageBackground, FlatList, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";

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

  const handlePress = (worldId: number) => {
    router.push(`/_hidden/mundo/${worldId}`); // Navega a la ruta dinámica con el id del mundo
  };

  return (
    <ImageBackground
      source={require("../../assets/images/fondo_aventura_mat.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <FlatList
          data={worlds}
          renderItem={({ item }) => <WorldItem item={item} onPress={handlePress} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false} // Oculta la barra de desplazamiento
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