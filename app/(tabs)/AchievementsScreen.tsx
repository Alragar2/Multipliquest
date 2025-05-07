import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Background from "../_components/Background";

export default function AchievementsScreen() {
  const [achievements, setAchievements] = useState<string[]>([]);

  useEffect(() => {
    const fetchAchievements = async () => {
      const storedAchievements = await AsyncStorage.getItem("achievements");
      if (storedAchievements) {
        setAchievements(JSON.parse(storedAchievements));
      }
    };
    fetchAchievements();
  }, []);

  const hasFirstAchievement = achievements.length == 1;

  return (
    <View style={styles.container}>
      <Background />
      <View style={styles.content}>
        <Text style={styles.title}>Logros</Text>
        {hasFirstAchievement && (
          <Text style={styles.specialMessage}>¡Has desbloqueado tu primer logro!</Text>
        )}
        {achievements.length > 0 ? (
          <FlatList
            data={achievements}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <Text style={styles.achievement}>{item}</Text>}
            contentContainerStyle={styles.achievementList}
          />
        ) : (
          <Text style={styles.noAchievements}>No tienes logros aún.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#89E7FF",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    width: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E90FF",
    marginBottom: 20,
    textAlign: "center",
  },
  achievementList: {
    alignItems: "center",
    width: "100%",
  },
  achievement: {
    fontSize: 20,
    marginVertical: 5,
    color: "#333",
    textAlign: "center",
    backgroundColor: "#F0F8FF",
    padding: 10,
    borderRadius: 10,
  },
  noAchievements: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 10,
  },
  specialMessage: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E90FF",
    marginBottom: 10,
    textAlign: "center",
    paddingHorizontal: 10,
  },
});
