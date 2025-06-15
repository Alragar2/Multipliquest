import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function ContraRelojScreen() {
  const [factor1, setFactor1] = useState(getRandomInt(10, 99));
  const [factor2, setFactor2] = useState(getRandomInt(10, 99));
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(40);
  const [totalTime, setTotalTime] = useState(0);
  const [finished, setFinished] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (finished) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setFinished(true);
          setTotalTime((t) => t + prev);
          return 0;
        }
        setTotalTime((t) => t + 1);
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [finished]);

  const nextMultiplication = () => {
    setFactor1(getRandomInt(10, 99));
    setFactor2(getRandomInt(10, 99));
    setInput("");
  };

  const handleSubmit = () => {
    if (finished) return;
    if (parseInt(input) === factor1 * factor2) {
      setScore(score + 1);
      setTimeLeft((t) => t + 10);
      nextMultiplication();
    } else {
      setInput("");
    }
  };

  if (finished) {
    return (
      <View style={styles.centered}>
        <Text style={styles.resultTitle}>¡Tiempo terminado!</Text>
        <Text style={styles.resultText}>
          Tiempo total jugado: {totalTime} segundos
        </Text>
        <Text style={styles.resultText}>
          Multiplicaciones resueltas: {score}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setScore(0);
            setTimeLeft(40);
            setTotalTime(0);
            setFinished(false);
            nextMultiplication();
          }}
        >
          <Text style={styles.buttonText}>Jugar de nuevo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>⏰ Tiempo: {timeLeft}s</Text>
      <Text style={styles.score}>Multiplicaciones resueltas: {score}</Text>
      <Text style={styles.multiplication}>
        {factor1} × {factor2} = ?
      </Text>
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        keyboardType="numeric"
        onSubmitEditing={handleSubmit}
        editable={!finished}
        autoFocus
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={finished}
      >
        <Text style={styles.buttonText}>Comprobar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#89E7FF",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#89E7FF",
  },
  timer: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  score: {
    fontSize: 20,
    marginBottom: 20,
    color: "#333",
  },
  multiplication: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#222",
  },
  input: {
    fontSize: 28,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    width: 120,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#1E90FF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#222",
  },
  resultText: {
    fontSize: 22,
    marginBottom: 10,
    color: "#333",
  },
});
