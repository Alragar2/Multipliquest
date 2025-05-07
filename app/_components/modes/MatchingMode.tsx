import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";

interface MatchingModeProps {
  onComplete: () => void; // Callback para indicar que se completó el nivel
  onError: () => void; // Callback para manejar errores
}

export default function MatchingMode({ onComplete, onError }: MatchingModeProps) {
  const [pairs, setPairs] = useState(generatePairs()); // Genera las multiplicaciones y sus resultados
  const [shuffledAnswers, setShuffledAnswers] = useState(() =>
    pairs.map((pair) => pair.answer).sort(() => Math.random() - 0.5)
  ); // Estado para las respuestas mezcladas
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null); // Multiplicación seleccionada
  const [selectedRight, setSelectedRight] = useState<number | null>(null); // Resultado seleccionado
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set()); // Pares ya emparejados

  function generatePairs() {
    const pairs = [];
    const usedAnswers = new Set<number>(); // Almacena los resultados ya generados

    while (pairs.length < 4) {
      const num1 = Math.floor(Math.random() * 10) + 1;
      const num2 = Math.floor(Math.random() * 10) + 1;
      const answer = num1 * num2;

      if (!usedAnswers.has(answer)) { // Asegura que el resultado sea único
        pairs.push({ id: pairs.length, question: `${num1} x ${num2}`, answer });
        usedAnswers.add(answer); // Marca el resultado como usado
      }
    }

    return pairs;
  }

  const generateNewQuestion = () => {
    const newPairs = generatePairs(); // Genera nuevos pares
    setPairs(newPairs);
    setMatchedPairs(new Set()); // Reinicia los pares emparejados
    setSelectedLeft(null); // Reinicia la selección izquierda
    setSelectedRight(null); // Reinicia la selección derecha

    // Genera una nueva mezcla de respuestas
    const newShuffledAnswers = newPairs.map((pair) => pair.answer).sort(() => Math.random() - 0.5);
    setShuffledAnswers(newShuffledAnswers); // Actualiza las respuestas mezcladas
  };

  const handleLeftPress = (id: number) => {
    setSelectedLeft(id);
    if (selectedRight !== null) {
      checkMatch(id, selectedRight);
    }
  };

  const handleRightPress = (answer: number) => {
    setSelectedRight(answer);
    if (selectedLeft !== null) {
      checkMatch(selectedLeft, answer);
    }
  };

  const checkMatch = (leftId: number, rightAnswer: number) => {
    const leftPair = pairs.find((pair) => pair.id === leftId); // Busca la pregunta seleccionada en la lista de pares

    if (leftPair && leftPair.answer === rightAnswer) { // Verifica si la respuesta coincide con la pregunta
        setMatchedPairs((prev) => {
            const updatedPairs = new Set(prev);
            const pairKey = `${leftId}-${rightAnswer}`; // Crea una clave única para el par
            if (typeof pairKey === "string" && !updatedPairs.has(pairKey)) {
                updatedPairs.add(pairKey); // Agrega el par único al conjunto
            }
            return updatedPairs;
        });

        if (matchedPairs.size + 1 === pairs.length) { 
            // Comprueba si todos los pares han sido emparejados
            setTimeout(() => {
                generateNewQuestion(); // Genera nuevos pares si se completaron todos
                onComplete(); // Llama al callback para indicar que el nivel se completó
            }, 200); // Agrega un retraso para evitar conflictos visuales
        }
    } else {
        onError(); // Llama a la función onError cuando hay un error
    }

    setSelectedLeft(null); // Reinicia la selección de la pregunta
    setSelectedRight(null); // Reinicia la selección de la respuesta
};

  return (
    <View style={styles.container}>
      <View style={styles.column}>
        {pairs.map((pair) => (
          <TouchableOpacity
            key={pair.id}
            style={[
              styles.item,
              selectedLeft === pair.id && styles.selectedItem,
              Array.from(matchedPairs).some((key) => typeof key === "string" && key.startsWith(`${pair.id}-`)) && styles.matchedItem,
            ]}
            onPress={() => handleLeftPress(pair.id)}
            disabled={Array.from(matchedPairs).some((key) => typeof key === "string" && key.startsWith(`${pair.id}-`))} // Deshabilita si ya está emparejado
          >
            <Text style={styles.text}>{pair.question}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.column}>
        {shuffledAnswers.map((answer, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.item,
              selectedRight === answer && styles.selectedItem,
              Array.from(matchedPairs).some((key) => typeof key === "string" && key.endsWith(`-${answer}`)) && styles.matchedItem,
            ]}
            onPress={() => handleRightPress(answer)}
            disabled={Array.from(matchedPairs).some((key) => typeof key === "string" && key.endsWith(`-${answer}`))} // Deshabilita si ya está emparejado
          >
            <Text style={styles.text}>{answer}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  column: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    backgroundColor: "#F0F8FF",
    padding: 15,
    margin: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1E90FF",
    width: "80%",
    alignItems: "center",
  },
  selectedItem: {
    backgroundColor: "#FFD700", // Amarillo para el elemento seleccionado
  },
  matchedItem: {
    backgroundColor: "#4CAF50", // Verde para los elementos emparejados
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});
