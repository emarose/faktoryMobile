import React, { useEffect, useRef } from "react";
import { Animated, Text, StyleSheet, View, Dimensions } from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const Toast = ({ visible, message, duration = 1000, onHide }) => {
  const translateX = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: SCREEN_WIDTH,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          })
        ]).start(() => {
          if (onHide) onHide();
        });
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onHide, opacity, translateX]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          opacity,
          transform: [{ translateX }],
          borderWidth: 3,
          borderColor: '#FFD700',
          backgroundColor: '#23233a',
          shadowColor: '#FFD700',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.7,
          shadowRadius: 8,
        },
      ]}
    >
      <Text style={styles.toastText}>
        🎉 {message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    top: '30%',
    left: 0,
    right: 0,
    marginHorizontal: 24,
    backgroundColor: "#23233a",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 20,
    alignItems: "center",
    zIndex: 1000,
    elevation: 10,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
  },
  toastText: {
    color: "#FFD700",
    fontSize: 20,
    fontWeight: "bold",
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 1,
  },
});

export default Toast;
