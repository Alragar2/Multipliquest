import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Platform, StyleSheet } from "react-native";

export default function Layout() {
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarStyle: styles.tabBarStyle,
          tabBarItemStyle: styles.tabBarItemStyle,
          tabBarIconStyle: styles.tabBarIconStyle,
          tabBarActiveTintColor: "#1E90FF",
          tabBarInactiveTintColor: "#999",
          tabBarShowLabel: false,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                color={color}
                size={30}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="AchievementsScreen"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "trophy" : "trophy-outline"}
                color={color}
                size={30}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="SettingsScreen"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "settings" : "settings-outline"}
                color={color}
                size={30}
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#89E7FF",
  },
  tabBarStyle: {
    backgroundColor: "#A1E3F9",
    height: 70,
    borderRadius: 20,
    shadowColor: "#3A59D1",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    elevation: 5,
    borderTopWidth: 0,
    overflow: Platform.OS === "android" ? "hidden" : "visible",
    marginHorizontal: 16,
    marginBottom: 24, // Ajuste para mover la barra más arriba
  },
  tabBarItemStyle: {
    height: "100%", // Asegurar que cada ítem ocupe toda la altura
    justifyContent: "center", // Centrar verticalmente
    alignItems: "center", // Centrar horizontalmente
  },
  tabBarIconStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
