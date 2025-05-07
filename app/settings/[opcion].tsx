import { Text, View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";



export default function Rute() {
    const params = useLocalSearchParams();

    return (
        <View style={styles.container}>
            <Text>Esta es la pantalla de ajustes</Text>
            <Text>La opción seleccionada es: {params.opcion}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});