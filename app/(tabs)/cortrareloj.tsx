import { View, Text, Button, Platform } from "react-native";
import { StyleSheet } from "react-native";
import NumberKeyboard from "../components/NumberKeyboard";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function CortrarelojScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Pantalla de Contrarreloj</Text>
                <Button title="Volver a Inicio" onPress={() => router.back()} />
            </View>
            <View style={styles.keyboardContainer}>
                <NumberKeyboard
                    onNumberPress={(value) => console.log(value)}
                    onAccept={() => console.log("accept")}
                    onDelete={() => console.log("delete")}
                />
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
    keyboardContainer: {
        flex: 1, // Ocupa la parte inferior
        justifyContent: "flex-end", // Alinea el teclado en la parte inferior
        alignItems: "center",
        width: Platform.OS === "web" ? "30%" : "100%",
        minWidth: Platform.OS === "web" ? 300 : "100%",
        paddingBottom: 20,
    },
});
