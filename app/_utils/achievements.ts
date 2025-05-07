import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Añade un logro al almacenamiento local si no existe ya.
 * @param achievement El texto del logro a añadir.
 */
export const addAchievement = async (achievement: string) => {
  try {
    const storedAchievements = await AsyncStorage.getItem("achievements");
    const achievements = storedAchievements ? JSON.parse(storedAchievements) : [];
    if (!achievements.includes(achievement)) {
      achievements.push(achievement);
      await AsyncStorage.setItem("achievements", JSON.stringify(achievements));
    }
  } catch (error) {
    console.error("Error al añadir el logro:", error);
  }
};

/**
 * Obtiene todos los logros almacenados.
 * @returns Una lista de logros.
 */
export const getAchievements = async (): Promise<string[]> => {
  try {
    const storedAchievements = await AsyncStorage.getItem("achievements");
    return storedAchievements ? JSON.parse(storedAchievements) : [];
  } catch (error) {
    console.error("Error al obtener los logros:", error);
    return [];
  }
};
