import { View, Text, StyleSheet, Image, FlatList, Platform } from "react-native";
import { useRouter } from "expo-router";
import TablButton from "../_components/TablButton";
import Background from "../_components/Background";

export default function DetailsScreen() {
  const router = useRouter();

  const renderItem = ({ item, index }: { item: number; index: number }) => (
    <TablButton
      key={item}
      onPress={() => router.push(`/_hidden/${item}`)} // Actualiza la ruta dinámica
      title={`Tabla del ${item}`}
      tablenumber={item}
      index={index} // Pasa el índice al componente TablButton
    />
  );

  return (
    <View style={styles.container}>
      <Background />
      <View style={styles.logoContainer}>
        <Image source={require("../../assets/images/MultipliquestMiniLogo.png")} style={styles.logo} />
      </View>
      <FlatList
        data={Array.from({ length: 10 }, (_, i) => i + 1)}
        renderItem={renderItem}
        keyExtractor={(item) => item.toString()}
        contentContainerStyle={[styles.ContainerButtons, { backgroundColor: "transparent" }]} // Fondo transparente
        showsVerticalScrollIndicator={false} // Oculta la barra de desplazamiento
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#89E7FF",
    justifyContent: "flex-start",
    width: "100%",
  },
  logoContainer: {
    alignItems: "flex-start",
    width: "140%",
    padding: 2,
    paddingStart: 100,
    paddingTop: 30,
  },
  ContainerButtons: {
    justifyContent: "center",
    alignItems: "center",
    flexWrap: Platform.OS === "web" ? "wrap" : "nowrap",
    backgroundColor: "#89E7FF",
    paddingTop: 30,
  },
  MainTableButtons: {
    alignItems: "center",
    width: "100%",
    padding: 10,
  },
  logo: {
    width: "40%",
    height: undefined,
    aspectRatio: 4,
    resizeMode: "contain",
  },
});