import React from "react";
import { Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from "react-native";

const { width } = Dimensions.get("window");

interface Props {
  onPress: () => void;
  title: string;
  tablenumber: number;
  index: number; // Agrega el índice como propiedad
}

const TablButton: React.FC<Props> = ({ onPress, title, index }) => {
  // Determina el color del botón según el índice (par o impar)
  const buttonStyle = [
    styles.button,
    { backgroundColor: index % 2 === 0 ? "#fe4a98" : "#6335e1" }, // Rosa para pares, morado para impares
  ];

  return (
    <TouchableOpacity onPress={onPress} style={buttonStyle}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 30,
    width: Platform.OS === "web" ? width * 0.6 : width - 80, // Cambia el ancho del botón según la plataforma
    height: "auto",
    marginBottom: 20,
    alignSelf: "center", // Centra el botón horizontalmente
    borderColor: "#2b1869", // Borde blanco para contraste
    borderWidth: 2, // Ancho del borde
  },
  text: {
    color: "#fff", // Texto blanco para contraste
    fontSize: 45,
    textAlign: "center",
  },
});

export default TablButton;