import { View, Text, Button, TextInput, Platform } from "react-native";
import { StyleSheet } from "react-native";
import NumberKeyboard from "../_components/NumberKeyboard";
import { useRouter } from "expo-router";
import InputBox from "../_components/InputBox";
import React, { useEffect } from "react";
import { useState } from "react";
import { generateRandomNumbers } from "../utils/generateRandomNumbers"; // Importa la función
import PredButton from "../_components/PredButton";
import { addAchievement } from "../_utils/achievements";

export default function DosCifrasScreen() {
  const router = useRouter();

  // Estado para almacenar los números generados
  const [randomNumbers, setRandomNumbers] = useState<{ twoDigitNumber: number; oneOrTwoDigitNumber: number } | null>(null);

  // Estado para las filas de inputs
  const [inputRows, setInputRows] = useState<string[][]>([
    ["", ""], // Primera fila: Inicialmente vacía
    ["x", "", ""], // Segunda fila
    ["line"], // Línea divisoria
    ["", "", ""], // Tercera fila
    ["", "", "", "special"], // Cuarta fila
    ["line"], // Línea divisoria
    ["", "", "", ""], // Quinta fila
  ]);

  // Estado para almacenar los valores calculados
  const [calculatedValues, setCalculatedValues] = useState<string[][]>([["", "", ""], ["", "", ""]]); // Centenas, decenas, unidades para filas 3 y 4

  // Estado para controlar la visibilidad del botón de refrescar
  const [showRefreshButton, setShowRefreshButton] = useState(false);

  // Estado para contar las multiplicaciones completadas
  const [multiplicationsCompleted, setMultiplicationsCompleted] = useState<number>(0);

  // Genera los números aleatorios solo al entrar a la pantalla o al refrescar
  const generateNewNumbers = () => {
    const numbers = generateRandomNumbers();
    setRandomNumbers(numbers);
    setShowRefreshButton(false); // Oculta el botón de refrescar al generar nuevos números
  };

  useEffect(() => {
    generateNewNumbers();
  }, []);

  // Actualiza las filas de inputs y los valores calculados cuando randomNumbers cambia
  useEffect(() => {
    if (randomNumbers) {
      const tens = Math.floor(randomNumbers.twoDigitNumber / 10).toString(); // Decenas
      const units = (randomNumbers.twoDigitNumber % 10).toString(); // Unidades
      const tensTwo = randomNumbers.oneOrTwoDigitNumber >= 10 ? Math.floor(randomNumbers.oneOrTwoDigitNumber / 10).toString() : ""; // Decenas
      const unitsTwo = (randomNumbers.oneOrTwoDigitNumber % 10).toString(); // Unidades

      // Calcula la multiplicación de unitsTwo por twoDigitNumber
      const multiplicationResultRow3 = parseInt(unitsTwo) * randomNumbers.twoDigitNumber;

      // Calcula la multiplicación de tensTwo por twoDigitNumber
      const multiplicationResultRow4 = parseInt(tensTwo || "0") * randomNumbers.twoDigitNumber;

      // Descompone el resultado en centenas, decenas y unidades para la fila 3
      const hundredsRow3 = Math.floor(multiplicationResultRow3 / 100).toString(); // Centenas
      const tensResultRow3 = Math.floor((multiplicationResultRow3 % 100) / 10).toString(); // Decenas
      const unitsResultRow3 = (multiplicationResultRow3 % 10).toString(); // Unidades

      // Descompone el resultado en centenas, decenas y unidades para la fila 4
      const hundredsRow4 = Math.floor(multiplicationResultRow4 / 100).toString(); // Centenas
      const tensResultRow4 = Math.floor((multiplicationResultRow4 % 100) / 10).toString(); // Decenas
      const unitsResultRow4 = (multiplicationResultRow4 % 10).toString(); // Unidades

      // Suma los resultados de las filas 3 y 4
      const resmultiplicationResultRow4 = multiplicationResultRow4 * 10; // Multiplica el resultado de la fila 4 por 1000 para la suma
      const totalSum = multiplicationResultRow3 + resmultiplicationResultRow4;
      
      // Descompone el total en millares, centenas, decenas y unidades
      const sumThousands = Math.floor(totalSum / 1000).toString(); // Millares
      const sumHundreds = Math.floor((totalSum % 1000) / 100).toString(); // Centenas
      const sumTens = Math.floor((totalSum % 100) / 10).toString(); // Decenas
      const sumUnits = (totalSum % 10).toString(); // Unidades

      // Actualiza los valores calculados
      setCalculatedValues([
        [hundredsRow3, tensResultRow3, unitsResultRow3], // Fila 3
        [hundredsRow4, tensResultRow4, unitsResultRow4], // Fila 4
        [sumThousands, sumHundreds, sumTens, sumUnits], // Fila 5 (suma de los resultados)
      ]);

      // Actualiza las filas de inputs
      setInputRows([
        [tens, units], // Primera fila: Decenas y unidades
        ["x", tensTwo, unitsTwo], // Segunda fila
        ["line"], // Línea divisoria
        ["", "", ""], // Tercera fila: Centenas, decenas y unidades (vacía para que el usuario la complete)
        ["", "", "", "special"], // Cuarta fila: Centenas, decenas y unidades (vacía para que el usuario la complete)
        ["line"], // Línea divisoria
        ["", "", "", ""], // Quinta fila: Millares, centenas, decenas y unidades (vacía para que el usuario la complete)
      ]);
    }
  }, [randomNumbers]);

  const [inputValue, setInputValue] = React.useState<string>(""); // Estado para almacenar el valor ingresado
  const [selectedInput, setSelectedInput] = useState<{ row: number; col: number } | null>(null); // Estado para rastrear el input seleccionado

  const handleNumberPress = (number: string) => {
    if (selectedInput) {
      setInputRows((prevRows) => {
        const updatedRows = [...prevRows];
        updatedRows[selectedInput.row][selectedInput.col] += number; // Agrega el número al input seleccionado
        return updatedRows;
      });
    }
  };

  const handleDelete = () => {
    if (selectedInput) {
      setInputRows((prevRows) => {
        const updatedRows = [...prevRows];
        updatedRows[selectedInput.row][selectedInput.col] = updatedRows[selectedInput.row][selectedInput.col].slice(0, -1); // Elimina el último carácter
        return updatedRows;
      });
    }
  };

  // Estado para rastrear los errores en las casillas
  const [errorRows, setErrorRows] = useState<boolean[][]>([
    [false, false, false], // Fila 3
    [false, false, false], // Fila 4
    [false, false, false, false], // Fila 5
  ]);

  const handleAccept = async () => {
    // Verifica las filas 3, 4 y 5
    const userRow3 = inputRows[3]; // Fila 3 ingresada por el usuario
    const userRow4 = inputRows[4]; // Fila 4 ingresada por el usuario
    const userRow5 = inputRows[6]; // Fila 5 ingresada por el usuario

    if (!calculatedValues || !userRow3 || !userRow4 || !userRow5) {
      console.log("No hay datos para verificar.");
      return;
    }

    let allCorrect = true;
    const newErrorRows = [
      [false, false, false], // Fila 3
      [false, false, false], // Fila 4
      [false, false, false, false], // Fila 5
    ];

    // Compara cada número de las filas 3, 4 y 5
    for (let i = 0; i < calculatedValues[0].length; i++) {
      if (userRow3[i] !== calculatedValues[0][i]) {
        newErrorRows[0][i] = true;
        allCorrect = false;
      }
    }
    for (let i = 0; i < calculatedValues[1].length; i++) {
      if (userRow4[i] !== calculatedValues[1][i]) {
        newErrorRows[1][i] = true;
        allCorrect = false;
      }
    }
    for (let i = 0; i < calculatedValues[2].length; i++) {
      if (userRow5[i] !== calculatedValues[2][i]) {
        newErrorRows[2][i] = true;
        allCorrect = false;
      }
    }

    setErrorRows(newErrorRows); // Actualiza los errores en las casillas

    if (allCorrect) {
      console.log("¡Todos los números son correctos en todas las filas!");
      setShowRefreshButton(true); // Muestra el botón de refrescar

      // Incrementa el contador de multiplicaciones completadas
      setMultiplicationsCompleted((prev) => prev + 1);

      // Desbloquea el logro de completar una multiplicación de dos cifras
      await addAchievement("¡Logro desbloqueado! Completaste una multiplicación de dos cifras.");

      // Verifica si se han completado 10 multiplicaciones
      if (multiplicationsCompleted + 1 === 10) {
        await addAchievement("¡Logro desbloqueado! Completaste 10 multiplicaciones de dos cifras.");
      }
    } else {
      console.log("Algunos números son incorrectos.");
    }
  };

  return (
    <View style={styles.container}>
      {showRefreshButton && (
        <View style={styles.refreshButtonContainer}>
          <PredButton 
            onPress={generateNewNumbers} 
            title=" " 
            iconName="refresh-outline"
            size="small" 
            iconMargin={0} 
          />
        </View>
      )}
      <View style={styles.title}>
        <Text>Pantalla de dos cifras</Text>
        <Button title="Volver a Inicio" onPress={() => router.back()} />
      </View>
      <View style={styles.operationView}>
        <View style={styles.operationCenter}>
          <View style={styles.operationContainer}>
          {inputRows.map((row, rowIndex) => (
            <View style={styles.row} key={rowIndex}>
              {row.map((value, colIndex) => {
                const isError =
                  rowIndex === 3 && errorRows[0]?.[colIndex] || // Fila 3
                  rowIndex === 4 && errorRows[1]?.[colIndex] || // Fila 4
                  rowIndex === 6 && errorRows[2]?.[colIndex];  // Fila 5
                return value === "special" ? (
                  <InputBox
                    key={colIndex}
                    value="" // Asegúrate de que el valor sea vacío
                    placeholder=""
                    fontSize={28}
                    editable={false} // No editable para la celda especial
                    borderColor="#89E7FF"
                    backgroundColor="#89E7FF" // Color específico
                  />
                ) : value === "line" ? (
                  <Text style={styles.line} key={colIndex}>-------------</Text>
                ) : (
                  <InputBox
                    key={colIndex}
                    value={value}
                    placeholder=""
                    fontSize={28}
                    editable={rowIndex >= 2} // Solo filas a partir de la tercera son editables
                    borderColor={isError ? "#FF0000" : "#89E7FF"} // Rojo si hay error
                    backgroundColor={rowIndex >= 2 ? "#fff" : "#89E7FF"}
                    onPress={() => setSelectedInput({ row: rowIndex, col: colIndex })} // Selecciona el input
                  />
                );
              })}
            </View>
          ))}
          </View>
        </View>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#89E7FF",
  },
  refreshButtonContainer: {
    position: "absolute",
    top: 15,
    right: 15,
  },
  title: {
    flex: 0.8,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: Platform.OS === "web" ? "2%" : "5%",
  },
  operationView: {
    flex: 6,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#89E7FF",
    width: "100%",
    paddingHorizontal: 20,
  },
  operationContainer: {
    width: "80%",
    alignItems: "flex-end",
    marginStart: "30%",
    marginEnd: "30%",
  },
  operationCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  line: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000",
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: Platform.OS === "web" ? "flex-end" : "center",
    width: Platform.OS === "web" ? "10%" : "100%",
    minWidth: Platform.OS === "web" ? 300 : "100%",
    height: Platform.OS === "web" ? "15%" : "100%",
    paddingBottom: Platform.OS === "web" ? "1%" : "5%",
  },
});