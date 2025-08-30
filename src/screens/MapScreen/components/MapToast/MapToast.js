import React from "react";
import { Animated, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Colors from "../../../../constants/Colors";

const MapToast = ({ visible, message, onHide }) => {
  if (!visible) return null;

  return (
    <Animated.View style={styles.toast}>
      <Text style={styles.text}>{message}</Text>
      <TouchableOpacity style={styles.closeBtn} onPress={onHide}>
        <Icon name="close" size={18} color="#aaa" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    top: 25,
    alignSelf: "center",
    backgroundColor: Colors.backgroundPanel,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 10,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    zIndex: 999,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.accentGreen,
  },
  text: {
    color: "#27ae60",
    fontWeight: "bold",
    fontSize: 15,
    flex: 1,
  },
  closeBtn: {
    marginLeft: 10,
    padding: 4,
  },
});

export default MapToast;
