import React from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Text } from "../../../../../components";

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
    backgroundColor: "#1f2935",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    zIndex: 1000,
    elevation: 10,
    opacity: 0.95,
    minWidth: 60,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#4a5866",
    borderLeftWidth: 3,
    borderLeftColor: "#6db4f0",
  },
  toastText: {
    color: "#e8f4fd",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});

export default MiniToast;
