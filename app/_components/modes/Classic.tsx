import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import NumberKeyboard from "../NumberKeyboard";
import InputBox from "../InputBox";

interface ClassicProps {
  onComplete: () => void; // Callback para indicar que se completó el nivel
  onError: () => void; // Callback para manejar errores (opcional)
}

export default function Classic({ onComplete, onError }: ClassicProps) {
  const [inputValue, setInputValue] = useState<string>(""); // Valor ingresado por el usuario
  const [num1, setNum1] = useState<number>(Math.floor(Math.random() * 10) + 1); // Número aleatorio 1
  const [num2, setNum2] = useState<number>(Math.floor(Math.random() * 10) + 1); // Número aleatorio 2

  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const colorAnimation = useRef(new Animated.Value(0)).current;

  const handleNumberPress = (number: string) => {
    setInputValue((prev) => prev + number);
  };

  const handleAccept = () => {
    const correctAnswer = num1 * num2;
    if (parseInt(inputValue) === correctAnswer) {
      setNum1(Math.floor(Math.random() * 10) + 1); // Genera un nuevo número aleatorio
      setNum2(Math.floor(Math.random() * 10) + 1); // Genera un nuevo número aleatorio
      setInputValue(""); // Reinicia el valor ingresado
      onComplete(); // Llama al callback para indicar que se completó el nivel
    } else {
      triggerErrorAnimation();
      setInputValue(""); // Reinicia el valor ingresado
      onError(); // Llama al callback de error
    }
  };

  const handleDelete = () => {
    setInputValue((prev) => prev.slice(0, -1));
  };

  const triggerErrorAnimation = () => {
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
    ]).start();

    Animated.sequence([
      Animated.timing(colorAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(colorAnimation, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const animatedColor = colorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#000", "#FF0000"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.operationView}>
        <Animated.View
          style={[
            styles.operationContainer,
            {
              transform: [{ translateX: shakeAnimation }],
            },
          ]}
        >
          <View style={styles.row}>
            <Animated.Text
              style={[
                styles.operation,
                {
                  color: animatedColor,
                },
              ]}
            >
              {num1} x {num2}
            </Animated.Text>
            <Text style={styles.equals}>=</Text>
            <InputBox
              value={inputValue}
              placeholder=""
              borderColor="#1E90FF"
              backgroundColor="#F0F8FF"
              fontSize={24}
              editable={true}
              onPress={() => console.log("Abre el teclado personalizado")}
            />
          </View>
        </Animated.View>
      </View>
      <View style={styles.keyboardContainer}>
        <NumberKeyboard
          onNumberPress={handleNumberPress}
          onAccept={handleAccept}
          onDelete={handleDelete}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  operationView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  operationContainer: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  operation: {
    fontSize: 36,
    fontWeight: "bold",
  },
  equals: {
    fontSize: 36,
    fontWeight: "bold",
    marginHorizontal: 15,
    color: "#000",
  },
  keyboardContainer: {
    flex: 1, // Asegura que el teclado ocupe más espacio vertical
    justifyContent: "center", // Centra el teclado verticalmente
    alignItems: "center", // Centra el teclado horizontalmente
    width: "100%", // Asegura que ocupe todo el ancho
    padding: 10, // Espaciado interno
  },
});
