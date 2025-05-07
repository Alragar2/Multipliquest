import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Alert, Animated } from "react-native";

interface BlinkModifierProps {
    children: React.ReactNode; // El modo que se renderizará dentro del modificador
    blinkDuration: number; // Duración del parpadeo en milisegundos
    onBlink: () => void; // Callback que se llama cuando ocurre un parpadeo
    onLose: () => void; // Callback que se llama cuando se pierde
    onComplete: () => void; // Callback que se llama cuando se completa el nivel
    onError: () => void; // Callback que se llama cuando ocurre un error
}

export default function BlinkModifier({ 
    children, 
    blinkDuration, 
    onBlink, 
    onLose, 
    onComplete, 
    onError 
}: BlinkModifierProps) {
    const [visible, setVisible] = useState<boolean>(true);
    const [blinkCount, setBlinkCount] = useState<number>(0);
    const maxBlinks = 10; // Número máximo de parpadeos antes de perder
    const fadeAnim = useRef(new Animated.Value(1)).current; // Valor inicial de opacidad: 1

    useEffect(() => {
        // Configurar el temporizador para alternar la visibilidad con animación
        const blinkTimer = setInterval(() => {
            setVisible(prev => !prev);
            
            // Animar la opacidad
            Animated.timing(fadeAnim, {
                toValue: visible ? 0 : 1, // Alterna entre 0 y 1
                duration: blinkDuration / 2, // La mitad de la duración del parpadeo para que la transición sea suave
                useNativeDriver: true, // Mejor rendimiento en dispositivos móviles
            }).start();
            
            setBlinkCount(prev => {
                const newCount = prev + 1;
                if (newCount % 2 === 0) { // Cuenta un parpadeo completo (aparecer y desaparecer)
                    onBlink(); // Llama al callback cuando ocurre un parpadeo completo
                }
                return newCount;
            });
        }, blinkDuration);

        // Limpiar el temporizador al desmontar el componente
        return () => clearInterval(blinkTimer);
    }, [blinkDuration, onBlink, visible, fadeAnim]);

    // Verificar si se ha alcanzado el máximo de parpadeos
    useEffect(() => {
        if (blinkCount >= maxBlinks * 2) { // Multiplicamos por 2 porque contamos cada cambio de estado
            onLose();
            Alert.alert("¡Has perdido!", "Se ha agotado el tiempo de parpadeo.", [
                { text: "Reintentar", onPress: () => setBlinkCount(0) }
            ]);
        }
    }, [blinkCount, onLose]);

    // Renderizar el componente hijo con animación
    return (
        <View style={styles.container}>
            <Text style={styles.blinkText}>Parpadeos: {Math.floor(blinkCount / 2)} / {maxBlinks}</Text>
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                {React.cloneElement(children as React.ReactElement, { 
                    onComplete, 
                    onError 
                })}
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        padding: 10,
    },
    blinkText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FF6347", // Tomate
        marginBottom: 10,
    },
    content: {
        flex: 1,
        width: "100%",
        // La transición ahora se maneja con Animated en lugar de CSS
    }
});