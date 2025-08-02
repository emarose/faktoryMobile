import React, { useEffect } from "react";
import { Animated, Text, StyleSheet, View } from "react-native";

const Toast = ({ visible, message, duration = 2000, onHide }) => {
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      const timer = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          if (onHide) onHide();
        });
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onHide, opacity]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.toast, { opacity }]}> 
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    bottom: 60,
    left: 0,
    right: 0,
    marginHorizontal: 24,
    backgroundColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
    zIndex: 1000,
    elevation: 10,
  },
  toastText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Toast;
