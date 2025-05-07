import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";

interface TrueFalseModeProps {
  onComplete: () => void; // Callback para indicar que se completó el nivel
  onError: () => void; // Callback para manejar errores (opcional)
}

export default function TrueFalseMode({ onComplete, onError }: TrueFalseModeProps) {
  const [num1, setNum1] = useState<number>(Math.floor(Math.random() * 10) + 1); // Número aleatorio 1
  const [num2, setNum2] = useState<number>(Math.floor(Math.random() * 10) + 1); // Número aleatorio 2
  const [isCorrect, setIsCorrect] = useState<boolean>(Math.random() < 0.5); // Determina si el resultado es correcto
  const [fakeResult, setFakeResult] = useState<number>(
    Math.floor(Math.random() * 100) + 1
  ); // Resultado falso aleatorio

  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const colorAnimation = useRef(new Animated.Value(0)).current;

  const correctAnswer = num1 * num2;
  const displayedResult = isCorrect ? correctAnswer : fakeResult;

  const handleAnswer = (answer: boolean) => {
    if (answer === isCorrect) {
      generateNewQuestion(); // Genera una nueva pregunta
      onComplete(); // Llama al callback para indicar que se completó el nivel
    } else {
      triggerErrorAnimation(); // Activa la animación de error
      onError(); // Llama al callback de error
    }
  };

  const generateNewQuestion = () => {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
    setIsCorrect(Math.random() < 0.5);
    setFakeResult(Math.floor(Math.random() * 100) + 1);
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
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
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
          styles.question,
          {
            color: animatedColor, // Aplica el color animado
            transform: [{ translateX: shakeAnimation }], // Aplica la animación de sacudida
          },
        ]}
      >
        {num1} x {num2} = {displayedResult}
      </Animated.Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.trueButton]}
          onPress={() => handleAnswer(true)}
        >
          <Text style={styles.buttonText}>Verdadero</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.falseButton]}
          onPress={() => handleAnswer(false)}
        >
          <Text style={styles.buttonText}>Falso</Text>
        </TouchableOpacity>
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
  question: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  button: {
    padding: 15,
    borderRadius: 10,
    width: "40%",
    alignItems: "center",
    height: 150,
    justifyContent: "center",
    marginHorizontal: 10,
  },
  trueButton: {
    backgroundColor: "#4CAF50", // Verde para "Verdadero"
  },
  falseButton: {
    backgroundColor: "#F44336", // Rojo para "Falso"
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
