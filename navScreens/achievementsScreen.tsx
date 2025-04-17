import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function AchievementsScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Pantalla de Logros</Text>
      <Button title="Volver a Inicio" onPress={() => router.back()} />
    </View>
  );
}
