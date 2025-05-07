import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import NumberKeyboard from "../NumberKeyboard";
import InputBox from "../InputBox";

interface TwoDigitMultiplicationModeProps {
  onComplete: () => void; // Callback para indicar que se completó el nivel
  onError: () => void; // Callback para manejar errores (opcional) 
}

// Funciones de generación de números
const generateTwoDigitNumber = () => Math.floor(Math.random() * 90) + 10; // Genera un número de dos cifras
const generateOneOrTwoDigitNumber = () => Math.floor(Math.random() * 90) + 10; // Genera un número de una o dos cifras

export default function TwoDigitMultiplicationMode({ onComplete, onError }: TwoDigitMultiplicationModeProps) {
    
  const [num1, setNum1] = useState<number>(generateTwoDigitNumber()); // Número de dos cifras
  const [num2, setNum2] = useState<number>(generateOneOrTwoDigitNumber()); // Número de una o dos cifras
  const [inputRows, setInputRows] = useState<string[][]>([["", ""], ["", "", ""], ["line"], ["", "", ""], ["", "", "", "special"], ["line"], ["", "", "", ""]]); // Filas de inputs
  const [selectedInput, setSelectedInput] = useState<{ row: number; col: number } | null>(null); // Input seleccionado
  const [errorRows, setErrorRows] = useState<boolean[][]>([[], [], [], []]); // Errores en las filas
  const [calculatedValues, setCalculatedValues] = useState<string[][]>([]); // Valores calculados

  useEffect(() => {
    generateNewQuestion();
  }, []);

  const generateNewQuestion = () => {
    const newNum1 = generateTwoDigitNumber();
    const newNum2 = generateOneOrTwoDigitNumber();
    setNum1(newNum1);
    setNum2(newNum2);

    const tens = Math.floor(newNum1 / 10).toString();
    const units = (newNum1 % 10).toString();
    const tensTwo = Math.floor(newNum2 / 10).toString();
    const unitsTwo = (newNum2 % 10).toString();

    const row3 = parseInt(unitsTwo) * newNum1;
    const row4 = parseInt(tensTwo) * newNum1;

    const totalSum = row3 + row4 * 10;

    setCalculatedValues([
      [Math.floor(row3 / 100).toString(), Math.floor((row3 % 100) / 10).toString(), (row3 % 10).toString()],
      [Math.floor(row4 / 100).toString(), Math.floor((row4 % 100) / 10).toString(), (row4 % 10).toString()],
      [Math.floor(totalSum / 1000).toString(), Math.floor((totalSum % 1000) / 100).toString(), Math.floor((totalSum % 100) / 10).toString(), (totalSum % 10).toString()],
    ]);

    setInputRows([
      [tens, units],
      ["x", tensTwo, unitsTwo],
      ["line"],
      ["", "", ""],
      ["", "", "", "special"],
      ["line"],
      ["", "", "", ""],
    ]);

    setErrorRows([
      [false, false, false],
      [false, false, false],
      [false, false, false, false],
    ]);
  };

  const handleNumberPress = (number: string) => {
    if (selectedInput) {
      setInputRows((prevRows) => {
        const updatedRows = [...prevRows];
        updatedRows[selectedInput.row][selectedInput.col] += number;
        return updatedRows;
      });
    }
  };

  const handleDelete = () => {
    if (selectedInput) {
      setInputRows((prevRows) => {
        const updatedRows = [...prevRows];
        updatedRows[selectedInput.row][selectedInput.col] = updatedRows[selectedInput.row][selectedInput.col].slice(0, -1);
        return updatedRows;
      });
    }
  };

  const handleAccept = () => {
    const userRow3 = inputRows[3];
    const userRow4 = inputRows[4];
    const userRow5 = inputRows[6];

    let allCorrect = true;
    const newErrorRows = [
      [false, false, false],
      [false, false, false],
      [false, false, false, false],
    ];

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

    setErrorRows(newErrorRows);

    if (allCorrect) {
      onComplete();
      generateNewQuestion();
    }
    else {
      onError();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.operationContainer}>
        {inputRows.map((row, rowIndex) => (
          <View style={styles.row} key={rowIndex}>
            {row.map((value, colIndex) => {
              const isError =
                (rowIndex === 3 && errorRows[0]?.[colIndex]) ||
                (rowIndex === 4 && errorRows[1]?.[colIndex]) ||
                (rowIndex === 6 && errorRows[2]?.[colIndex]);
              return value === "special" ? (
                <InputBox
                  key={colIndex}
                  value=""
                  placeholder=""
                  fontSize={28}
                  editable={false}
                  borderColor="rgba(137, 231, 255, 0)"
                  backgroundColor="rgba(137, 231, 255, 0)"
                  size ={42} // Cambia el tamaño del input en la fila 4
                  marginHorizontal={3}
                />
              ) : value === "line" ? (
                <Text style={styles.line} key={colIndex}>-------------</Text>
              ) : (
                <InputBox
                  key={colIndex}
                  value={value}
                  placeholder=""
                  fontSize={28}
                  editable={rowIndex >= 3}
                  borderColor={isError ? "#FF0000" : "rgba(137, 231, 255, 0)"}
                  backgroundColor={rowIndex >= 3 ? "#fff" : "rgba(137, 231, 255, 0)"}
                  onPress={() => setSelectedInput({ row: rowIndex, col: colIndex })}
                  size ={42} // Cambia el tamaño del input en la fila 4
                  marginHorizontal={3}
                  marginVertical={1}
                />
              );
            })}
          </View>
        ))}
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
    width: "100%",
  },
  operationContainer: {
    flex: 6,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    width: "100%",
    padding: 20,
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
    flex: 2,
    justifyContent: "flex-end",
    width: "100%",
    paddingBottom: 0,
  },
});
