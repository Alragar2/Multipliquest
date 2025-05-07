import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";

interface TimeModifierProps {
  children: React.ReactNode; // El modo que se renderizará dentro del modificador
  timeLimit: number; // Tiempo límite en segundos
  onTimeUp: () => void; // Callback cuando se acaba el tiempo
}

export default function TimeModifier({ children, timeLimit, onTimeUp }: TimeModifierProps) {
  const [timeLeft, setTimeLeft] = useState<number>(timeLimit);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp(); // Llama al callback cuando el tiempo se acaba
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Limpia el intervalo al desmontar el componente
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>Tiempo restante: {timeLeft}s</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  timer: {
    fontSize: 24,
    fontWeight: "bold",
    color: "red",
    marginBottom: 10,
  },
});
