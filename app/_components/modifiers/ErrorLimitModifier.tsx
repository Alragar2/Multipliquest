import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";

interface ErrorLimitModifierProps {
  maxErrors: number; // Límite máximo de errores permitidos
  onError: () => void; // Callback que se llama cuando ocurre un error
  onLose: () => void; // Callback que se llama cuando se alcanzan los errores máximos
  children: React.ReactNode; // Contenido del modificador
}

export default function ErrorLimitModifier({ maxErrors, onError, onLose, children }: ErrorLimitModifierProps) {
  const [errorCount, setErrorCount] = useState<number>(0); // Contador de errores

  const handleError = () => {
    setErrorCount((prev) => {
      const newCount = prev + 1;
      if (newCount >= maxErrors) {
        Alert.alert("¡Has perdido!", "Has alcanzado el límite de errores.", [
          { text: "Aceptar", onPress: onLose },
        ]);
      } else {
        onError(); // Llama al callback de error solo si no se ha alcanzado el límite
      }
      console.log(`Error count: ${newCount}`); // Muestra el conteo de errores en la consola
      return newCount;
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>Errores: {errorCount} / {maxErrors}</Text>
      <View style={styles.content}>
        {React.cloneElement(children as React.ReactElement, { onError: handleError })}
      </View>
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
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red",
    marginBottom: 10,
  },
  content: {
    flex: 1,
    width: "100%",
  },
});
