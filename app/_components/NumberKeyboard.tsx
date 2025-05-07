import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";

interface Props {
  onNumberPress: (number: string) => void;
  onAccept: () => void;
  onDelete: () => void;
}

const NumberKeyboard: React.FC<Props> = ({ onNumberPress, onAccept, onDelete }) => {
  const renderButton = (label: string, onPress: () => void, style = styles.button) => (
    <TouchableOpacity key={label} onPress={onPress} style={style}>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {["7", "8", "9"].map((num) => renderButton(num, () => onNumberPress(num)))}
      </View>
      <View style={styles.row}>
        {["4", "5", "6"].map((num) => renderButton(num, () => onNumberPress(num)))}
      </View>
      <View style={styles.row}>
        {["1", "2", "3"].map((num) => renderButton(num, () => onNumberPress(num)))}
      </View>
      <View style={styles.row}>
        {renderButton("⌦", onDelete, styles.specialButton)}
        {renderButton("0", () => onNumberPress("0"))}
        {renderButton("✔", onAccept, styles.specialButton)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Platform.OS === "web" ? "2%" : 10,
    backgroundColor: "rgba(255, 255, 255, 0)",
    borderRadius: 10,
    width: "90%",
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Platform.OS === "web" ? "2%" : 10,
  },
  button: {
    backgroundColor: "#55B4F7",
    padding: Platform.OS === "web" ? "5%" : 18,
    borderRadius: 5,
    flex: 1.5,
    marginHorizontal: 5,
    alignItems: "center",
  },
  specialButton: {
    backgroundColor: "#1E90FF",
    padding: Platform.OS === "web" ? "5%" : 18,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});

export default NumberKeyboard;
