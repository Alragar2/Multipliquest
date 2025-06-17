import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import PredButton from "../_components/PredButton";
import Background from "../_components/Background";
import BackgroundMusic from "../_components/BackgroundMusic";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <BackgroundMusic />
      <Background />
      <View style={styles.MainButtons}>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#89E7FF",
  },
  MainButtons: {
    alignItems: "center",
    width: "100%",
    padding: 10,
  },
});