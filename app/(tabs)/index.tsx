import { View, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import PredButton from "../components/PredButton";
import Background from "../components/Background";
import homeIcon from "../../assets/images/home.png";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";


export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Background />
      <View style={styles.MainButtons}>
        <PredButton onPress={() => router.push("/(tabs)/tablas")} title="Tablas" iconName="grid-outline" size="extraLarge" />
        <PredButton onPress={() => router.push("/(tabs)/dosCifras")} title="Dos cifras" iconName="calculator-outline" size="large" />
        <PredButton onPress={() => router.push("/(tabs)/cortrareloj")} title="Contrarreloj" iconName="timer-outline" size="small" />
        <PredButton onPress={() => router.push("/(tabs)/aventuraMat")} title="Aventura matemática" iconName="rocket-outline" size="small" />
      </View>
      <View style={styles.NavBar}>
        <Image source={homeIcon} style={styles.homeIcon} resizeMode="contain"/>
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
  NavBar: {
    width: "100%",
    height: "9%",
    backgroundColor: "#55B4F7",
    bottom: 0,
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: "15%",
  },
  homeIcon: {
    width: 35,
    height: undefined,
    aspectRatio: 0.83,
    marginLeft: 10
  },
});