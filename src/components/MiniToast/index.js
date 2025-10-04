import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import Text from "../Text";
import Colors from "../../constants/Colors";

const MiniToast = ({ visible, message }) => {
  const translateY = useRef(new Animated.Value(8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;
    // Slide up and fade in quickly on mount
    translateY.setValue(8);
    opacity.setValue(0);
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -8,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0.95,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible]);

  if (!visible) return null;
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.toast,
        {
          transform: [{ translateY }],
          opacity: opacity,
        },
      ]}
    >
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    bottom: 24,
    alignSelf: "center",
    backgroundColor: Colors.accentGold,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    zIndex: 1000,
    elevation: 10,
    minWidth: 32,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  toastText: {
    color: Colors.background,
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});

export default MiniToast;
