import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";
const images = [
  require("../../assets/images/X1.png"),
  require("../../assets/images/X2.png"),
  require("../../assets/images/X3.png"),
  require("../../assets/images/X4.png"),
];

const { width, height } = Dimensions.get("window");

interface Position {
  top: number;
  left: number;
}

const getRandomPosition = (existingPositions: Position[]): Position => {
  let top: number = 0;
  let left: number = 0;
  let isValidPosition = false;

  while (!isValidPosition) {
    top = Math.floor(height * Math.random());
    left = Math.floor(width * Math.random());
    
    isValidPosition = existingPositions.every(
      (pos) => Math.abs(pos.top - top) > 200 && Math.abs(pos.left - left) > 200
    );
  }

  return { top, left };
};

const Background = () => {
  const [positions, setPositions] = useState<Position[]>([]);

  useEffect(() => {
    const newPositions = Array.from({ length: 10 }, () => getRandomPosition([]));
    //console.log("Posiciones generadas:", newPositions); // Mostrar las posiciones en la terminal
    setPositions(newPositions);
  }, []);

  return (
    <View style={styles.container}>
      
      {positions.map((position, index) => {
        const image = images[index % images.length];
        return (
          <Image
            key={index}
            source={image}
            style={[
              styles.backgroundImage,
              { 
                top: Math.min(position.top, height - 100), 
                left: Math.min(position.left, width - 100) 
              },
            ]}
            resizeMode="contain" // Cambiar a "contain" para asegurar que las imágenes se ajusten correctamente
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
    backgroundColor: "transparent", // Asegurar que el fondo sea transparente
  },
  backgroundImage: {
    position: "absolute",
    width: 100,
    height: 100,
    opacity: 1,
  },
});

export default Background;