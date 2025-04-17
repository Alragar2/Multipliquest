import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ContrarrelojScreen() {
  return (
    <View style={styles.container}>
      <Text>Pantalla de Contrarreloj</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
