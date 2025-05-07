import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";

interface GuessFactorModeProps {
  onComplete: () => void; // Callback para indicar que se completó el nivel
  onError: () => void; // Callback para manejar errores (opcional)
}

export default function GuessFactorMode({ onComplete, onError }: GuessFactorModeProps) {
  const [factor, setFactor] = useState<number>(generateFactor()); // Factor aleatorio entre 2 y 10
  const [sequence, setSequence] = useState<number[]>(generateSequence(factor)); // Secuencia de números
  const [options, setOptions] = useState<number[]>(generateOptions(factor)); // Opciones de respuesta
  const [disabledOptions, setDisabledOptions] = useState<Set<number>>(new Set()); // Opciones deshabilitadas

  function generateFactor(): number {
    return Math.floor(Math.random() * 9) + 2; // Genera un factor aleatorio entre 2 y 10
  }

  function generateSequence(factor: number): number[] {
    const start = Math.floor(Math.random() * 4) + 1; // Punto de inicio aleatorio en la tabla (1 a 4)
    return Array.from({ length: 6 }, (_, i) => factor * (start + i)); // Genera una secuencia de 6 números desde el punto de inicio
  }

  function generateOptions(correct: number): number[] {
    const incorrectOptions = new Set<number>();
    while (incorrectOptions.size < 5) {
      const randomOption = Math.floor(Math.random() * 10) + 2; // Genera factores aleatorios entre 2 y 10
      if (randomOption !== correct) {
        incorrectOptions.add(randomOption);
      }
    }
    return [...Array.from(incorrectOptions), correct].sort(() => Math.random() - 0.5); // Mezcla las opciones
  }

  const handleOptionPress = (option: number) => {
    if (option === factor) {
      Alert.alert("¡Correcto!", "Has acertado.", [
        { text: "Continuar", onPress: () => generateNewQuestion() },
      ]);
      onComplete(); // Llama al callback para indicar que se completó el nivel
    } else {
      setDisabledOptions((prev) => new Set(prev).add(option)); // Deshabilita el botón presionado
      onError(); // Llama al callback de error
    }
  };

  const generateNewQuestion = () => {
    const newFactor = generateFactor();
    setFactor(newFactor);
    setSequence(generateSequence(newFactor));
    setOptions(generateOptions(newFactor));
    setDisabledOptions(new Set()); // Reinicia las opciones deshabilitadas
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sequence}>
        {sequence.join(", ")}
      </Text>
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.option,
              disabledOptions.has(option) && styles.disabledOption, // Aplica estilo si está deshabilitado
            ]}
            onPress={() => handleOptionPress(option)}
            disabled={disabledOptions.has(option)} // Deshabilita el botón si ya fue presionado
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  sequence: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  option: {
    backgroundColor: "#F0F8FF",
    padding: 15,
    margin: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1E90FF",
    width: 100,
    alignItems: "center",
  },
  disabledOption: {
    backgroundColor: "#D3D3D3", // Gris para opciones deshabilitadas
    borderColor: "red", // Rojo para indicar error
  },
  optionText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});
