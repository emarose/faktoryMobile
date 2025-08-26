import React from "react";
import { Animated, Text, StyleSheet, View } from "react-native";

const MiniToast = ({ visible, message }) => {
  if (!visible) return null;
  return (
    <View style={styles.toast} pointerEvents="none">
      <Text style={styles.toastText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    bottom: 24,
    alignSelf: "center",
    backgroundColor: "#23233a",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    zIndex: 1000,
    elevation: 10,
    opacity: 0.92,
    minWidth: 40,
    minHeight: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toastText: {
    color: "#FFD700",
    fontSize: 15,
    fontWeight: "bold",
    letterSpacing: 0.2,
    textAlign: 'center',
  },
});

export default MiniToast;
