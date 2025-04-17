import React from "react";
import {
  BottomTabBarProps,
  BottomTabBar,
} from "@react-navigation/bottom-tabs";
import { View, StyleSheet, Platform } from "react-native";

export default function CustomTabBar(props: BottomTabBarProps) {
  return (
    <View style={styles.wrapper}>
      <BottomTabBar {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#A1E3F9",
    ...Platform.select({
      android: {
        elevation: 10,
      },
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 10,
      },
    }),
  },
});
