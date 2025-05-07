import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface FourOptionsModeProps {
    biome: number; // Bioma del nivel
    onComplete: () => void; // Callback al completar el nivel
    onError: () => void; // Callback al cometer un error (opcional)
}

export default function FourOptionsMode({ biome, onComplete, onError }: FourOptionsModeProps) {
    const [question, setQuestion] = useState<string>(""); // Pregunta actual
    const [correctAnswer, setCorrectAnswer] = useState<number>(0); // Respuesta correcta
    const [options, setOptions] = useState<number[]>([]); // Opciones de respuesta
    const [disabledOptions, setDisabledOptions] = useState<Set<number>>(new Set()); // Opciones deshabilitadas
    const [errorMessage, setErrorMessage] = useState<string>(""); // Mensaje de error

    // Genera una nueva pregunta aleatoria
    const generateQuestion = () => {
        let num1: number;
        let num2: number;

        if (biome === 1) {
            num1 = Math.floor(Math.random() * 5) + 1; // Número entre 1 y 5
            num2 = Math.floor(Math.random() * 10) + 1; // Número entre 1 y 10
        } else if (biome === 2) {
            num1 = Math.floor(Math.random() * 10) + 1; // Número entre 1 y 10
            num2 = Math.floor(Math.random() * 10) + 1; // Número entre 1 y 10
        } else if (biome >= 3) {
            num1 = Math.floor(Math.random() * 15) + 1; // Número entre 1 y 15
            num2 = Math.floor(Math.random() * 10) + 1; // Número entre 1 y 10
        } else {
            num1 = 1;
            num2 = 1;
        }

        const correct = num1 * num2;

        // Genera opciones aleatorias
        const incorrectOptions = new Set<number>();
        while (incorrectOptions.size < 3) {
            let randomOption = Math.floor(Math.random() * 150) + 1;
            if (biome === 1) {
                randomOption = Math.floor(Math.random() * 50) + 1;
            } else if (biome === 2) {
                randomOption = Math.floor(Math.random() * 100) + 1;
            }
            if (randomOption !== correct) {
                incorrectOptions.add(randomOption);
            }
        }

        setQuestion(`${num1} x ${num2}`);
        setCorrectAnswer(correct);
        setOptions([...Array.from(incorrectOptions), correct].sort(() => Math.random() - 0.5)); // Mezcla las opciones
        setDisabledOptions(new Set()); // Reinicia las opciones deshabilitadas
        setErrorMessage(""); // Limpia el mensaje de error
    };

    useEffect(() => {
        generateQuestion(); // Genera la primera pregunta al montar el componente
    }, []);

    const handleOptionPress = (option: number) => {
        if (option === correctAnswer) {
            generateQuestion(); // Genera una nueva pregunta si la respuesta es correcta
            onComplete(); // Llama al callback para indicar que se completó el nivel
        } else {
            setDisabledOptions((prev) => new Set(prev).add(option)); // Deshabilita el botón presionado
            onError(); // Llama al callback de error
        }
    };

    return (
        <View style={styles.container}>
            {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
            <Text style={styles.question}>{question}</Text>
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
    question: {
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    errorMessage: {
        fontSize: 24,
        color: "red",
        marginBottom: 10,
        textAlign: "center",
    },
    optionsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
    },
    option: {
        backgroundColor: "#F0F8FF",
        padding: 20, // Aumenta el padding para hacer los botones más grandes
        margin: 10, // Aumenta el margen para mayor separación entre botones
        borderRadius: 12, // Ajusta el borde redondeado
        borderWidth: 1,
        borderColor: "#1E90FF",
        width: 130, // Aumenta el ancho del botón
        alignItems: "center",
    },
    disabledOption: {
        backgroundColor: "#D3D3D3", // Gris para opciones deshabilitadas
        borderColor: "red", // Rojo para indicar error
    },
    optionText: {
        fontSize: 28, // Aumenta el tamaño del texto
        fontWeight: "bold",
        color: "#333",
    },
});
