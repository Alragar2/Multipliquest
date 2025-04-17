import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";

interface InputBoxProps {
  value: string; // Valor actual del input
  placeholder?: string; // Texto de marcador de posición
  borderColor?: string; // Color del borde
  backgroundColor?: string; // Color de fondo
  fontSize?: number; // Tamaño de la fuente
  editable?: boolean; // Define si el input es editable
  onPress?: () => void; // Callback para manejar la interacción con el teclado personalizado
}

const InputBox: React.FC<InputBoxProps> = ({
  value,
  placeholder = "",
  borderColor = "#1E90FF",
  backgroundColor = "#fff",
  fontSize = 24,
  editable = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.inputContainer, { borderColor, backgroundColor }]}
      onPress={editable ? onPress : undefined} // Solo permite interacción si es editable
    >
      <Text style={[styles.input, { fontSize }]}>
        {value || placeholder} {/* Muestra el placeholder si el valor es vacío */}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    color: "#000",
    textAlign: "center",
    width: "100%",
  },
});

export default InputBox;
