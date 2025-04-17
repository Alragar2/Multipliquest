import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Importa íconos de Expo

interface Props {
  onPress: () => void;
  title: string;
  iconName?: string; // Propiedad opcional para el nombre del ícono
  size?: "small" | "large" | "extraLarge"; // Tamaño opcional del botón
  iconMargin?: number; // Propiedad opcional para el margen
}

const PredButton: React.FC<Props> = ({ onPress, title, iconName, size = "large", iconMargin = 10 }) => {
  const isLarge = size === "large";
  const isExtraLarge = size === "extraLarge";
  const isSmall = size === "small";

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        isExtraLarge ? styles.extraLargeButton : isLarge ? styles.largeButton : styles.smallButton,
        isSmall && { minWidth: 50, minHeight: 50 }, // Asegura un tamaño mínimo para botones pequeños
      ]}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        {iconName && (
          <Ionicons
            name={iconName as any} // Asegúrate de que el nombre del ícono sea correcto
            size={isExtraLarge ? 36 : isLarge ? 28 : 24} // Aumenta el tamaño del ícono para botones pequeños
            color="#fff"
            style={[styles.icon, { marginRight: iconMargin }]} // Aplica el margen personalizado
          />
        )}
        <Text
          style={[
            styles.text,
            isExtraLarge ? styles.extraLargeText : isLarge ? styles.largeText : styles.smallText,
          ]}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 10,
    borderRadius: 25,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Sombra para Android
  },
  extraLargeButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 35,
    paddingHorizontal: 25,
    width: "80%",
  },
  largeButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 20,
    paddingHorizontal: 20,
    width: "80%",
  },
  smallButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    paddingHorizontal: 15,
    width: "60%",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 10,
  },
  text: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  extraLargeText: {
    fontSize: 24,
  },
  largeText: {
    fontSize: 20,
  },
  smallText: {
    fontSize: 16,
  },
});

export default PredButton;