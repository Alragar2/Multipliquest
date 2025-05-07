export default {
  expo: {
    plugins: ["expo-router"],
    icon: "./assets/Logo.png", // Ruta al ícono
    assetBundlePatterns: ["**/*"], // Asegúrate de incluir los assets
    android: {
      package: "com.alvarorg.multipliquest"  // Nombre único del paquete para tu app en Android
    },
    extra: {
      eas: {
        projectId: "1d35758f-4e4a-473b-a015-0df7c82605c1",
      },
    },
  },
};
