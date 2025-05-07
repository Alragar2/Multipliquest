import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import NumberKeyboard from "../_components/NumberKeyboard";
import InputBox from "../_components/InputBox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addAchievement } from "../_utils/achievements";

export default function CalcTablasScreen() {
  const { tableNumber } = useLocalSearchParams();
  const router = useRouter();
  const [inputValue, setInputValue] = useState<string>("");
  const [multiplier, setMultiplier] = useState<number>(1);

  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const colorAnimation = useRef(new Animated.Value(0)).current;

  const handleNumberPress = (number: string) => {
    setInputValue((prev) => prev + number);
  };

  const handleAccept = async () => {
    const correctAnswer = Number(tableNumber) * multiplier;
    if (parseInt(inputValue) === correctAnswer) {
      if (multiplier === 10) {
        if (tableNumber === "1") {
          await addAchievement("¡Logro desbloqueado! Completaste la tabla del 1.");
        }
        if (tableNumber === "5") {
          await addAchievement("¡Logro desbloqueado! Completaste la tabla del 5.");
        }
        if (tableNumber === "10") {
          await addAchievement("¡Logro desbloqueado! Completaste la tabla del 10.");
        }
        await addAchievement(`¡Logro desbloqueado! Completaste la tabla del ${tableNumber}.`);
        await checkAllTablesCompleted(); // Verifica si se completaron todas las tablas
        alert("¡Felicidades! Has completado la tabla.");
        router.replace("/");
      } else {
        setMultiplier((prev) => prev + 1);
        setInputValue("");
      }
    } else {
      triggerErrorAnimation();
      setInputValue("");
    }
  };

  const checkAllTablesCompleted = async () => {
    try {
      const storedAchievements = await AsyncStorage.getItem("achievements");
      const achievements = storedAchievements ? JSON.parse(storedAchievements) : [];
      const allTablesCompleted = Array.from({ length: 10 }, (_, i) => `¡Logro desbloqueado! Completaste la tabla del ${i + 1}.`);
      const hasCompletedAllTables = allTablesCompleted.every((table) => achievements.includes(table));

      if (hasCompletedAllTables && !achievements.includes("¡Logro desbloqueado! Completaste todas las tablas.")) {
        await addAchievement("¡Logro desbloqueado! Completaste todas las tablas.");
      }
    } catch (error) {
      console.error("Error al verificar si se completaron todas las tablas:", error);
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
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Tabla del {tableNumber}</Text>
      </View>
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
              {tableNumber} x {multiplier}
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
    backgroundColor: "#89E7FF",
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flex: 2,
    justifyContent: "flex-start",
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  operationView: {
    flex: 3,
    justifyContent: "flex-start",
    alignItems: "center",
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
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    width: Platform.OS === "web" ? "30%" : "100%",
    minWidth: Platform.OS === "web" ? 300 : "100%",
    paddingBottom: 20,
  },
});
