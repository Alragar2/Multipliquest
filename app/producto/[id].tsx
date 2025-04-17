import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Button } from 'react-native';

export default function DetailsScreen() {
    const { id, nombre, precio } = useLocalSearchParams();
    const router = useRouter();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Detalles del producto</Text>
            <Text>ID: {id}</Text>
            <Text>Nombre: {nombre}</Text>
            <Text>Precio: {precio}</Text>
            <Button title="Volver a Inicio" onPress={() => router.back()} />
        </View>
    );
}