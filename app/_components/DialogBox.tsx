import React from "react";
import { View, Text, StyleSheet, Modal, TouchableWithoutFeedback, Image } from "react-native";

interface DialogBoxProps {
  visible: boolean;
  onClose: () => void;
  dialogText: string;
  dialogImage: string;
}

// Función auxiliar para resolver qué imagen mostrar
const getImageSource = (imagePath: string) => {  // Mapeo de nombres de archivo a recursos importados
  const imageMap: {[key: string]: any} = {
    "senyor_division": require("../../assets/images/Senyor_division.png"),
    "hada_suma": require("../../assets/images/Hada_suma.png"),
  };

  return imageMap[imagePath] || null;
};

const DialogBox: React.FC<DialogBoxProps> = ({ visible, onClose, dialogText, dialogImage }) => {
  // Obtener la fuente de la imagen correcta
  const imageSource = getImageSource(dialogImage);
  
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <View style={styles.dialogBox}>
            {imageSource && <Image source={imageSource} style={styles.dialogImage} />}
            <Text style={styles.dialogText}>{dialogText}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },  dialogBox: {
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
    paddingVertical: 25,
    flexDirection: "row",
    alignItems: "center",
  },dialogImage: {
    width: 80,
    height: 80,
    marginRight: 15,
    resizeMode: 'contain',
  },
  dialogText: {
    fontSize: 16,
    textAlign: "center",
    flex: 1,
  },
});

export default DialogBox;
