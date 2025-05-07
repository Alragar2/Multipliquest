import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";

interface GuessNextModeProps {
  onComplete: () => void; // Callback para indicar que se completó el nivel
  onError: () => void; // Callback para manejar errores (opcional)
}

export default function GuessNextMode({ onComplete, onError }: GuessNextModeProps) {
  const [sequence, setSequence] = useState<number[]>(generateSequence()); // Secuencia de números
  const [correctAnswer, setCorrectAnswer] = useState<number>(sequence[sequence.length - 1] + (sequence[1] - sequence[0])); // Respuesta correcta
  const [options, setOptions] = useState<number[]>(generateOptions(sequence[sequence.length - 1] + (sequence[1] - sequence[0]))); // Opciones de respuesta
  const [disabledOptions, setDisabledOptions] = useState<Set<number>>(new Set()); // Opciones deshabilitadas

  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const colorAnimation = useRef(new Animated.Value(0)).current;

  function generateSequence(): number[] {
    const table = Math.floor(Math.random() * 10) + 1; // Selecciona una tabla de multiplicar del 1 al 10
    const start = Math.floor(Math.random() * 5) + 1; // Selecciona un punto de inicio aleatorio en la tabla (1 a 5)
    return Array.from({ length: 5 }, (_, i) => table * (start + i)); // Genera una secuencia de 5 números desde el punto de inicio
  }

  function generateOptions(correct: number): number[] {
    const incorrectOptions = new Set<number>();
    while (incorrectOptions.size < 5) {
      const randomOption = Math.floor(Math.random() * 100) + 1; // Genera opciones aleatorias
      if (randomOption !== correct) {
        incorrectOptions.add(randomOption);
      }
    }
    return [...Array.from(incorrectOptions), correct].sort(() => Math.random() - 0.5); // Mezcla las opciones
  }

  const handleOptionPress = (option: number) => {
    if (option === correctAnswer) {
      generateNewQuestion(); // Genera una nueva pregunta
      onComplete(); // Llama al callback para indicar que se completó el nivel
    } else {
      triggerErrorAnimation(); // Activa la animación de error
      setDisabledOptions((prev) => new Set(prev).add(option)); // Deshabilita el botón presionado
      onError(); // Llama al callback de error
    }
  };

  const generateNewQuestion = () => {
    const newSequence = generateSequence();
    setSequence(newSequence);
    const newCorrectAnswer = newSequence[newSequence.length - 1] + (newSequence[1] - newSequence[0]); // Calcula el siguiente número en la tabla
    setCorrectAnswer(newCorrectAnswer);
    setOptions(generateOptions(newCorrectAnswer));
    setDisabledOptions(new Set()); // Reinicia las opciones deshabilitadas
  };

  const triggerErrorAnimation = () => {
    // Reinicia los valores animados antes de iniciar una nueva animación
    shakeAnimation.setValue(0);
    colorAnimation.setValue(0);

    // Ejecuta las animaciones de sacudida y color en paralelo
    Animated.parallel([
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true, // Asegura que use el native driver
        }),
        Animated.timing(shakeAnimation, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true, // Asegura que use el native driver
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true, // Asegura que use el native driver
        }),
      ]),
      Animated.timing(colorAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true, // Cambiado a true para evitar conflictos
      }),
    ]).start(() => {
      // Reinicia el color después de la animación
      colorAnimation.setValue(0);
    });
  };

  const animatedColor = colorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#000", "#FF0000"], // Cambia el color de negro a rojo
  });

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.sequence,
          {
            color: animatedColor, // Aplica el color animado
            transform: [{ translateX: shakeAnimation }], // Aplica la animación de sacudida
          },
        ]}
      >
        {sequence.join(", ")} , ?
      </Animated.Text>
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
