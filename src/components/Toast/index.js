import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Text from "../Text";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";

const SCREEN_WIDTH = Dimensions.get("window").width;
const Toast = ({ visible, message, duration = 1000, onHide }) => {
  const translateX = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // Check if this is a saving toast
  const isSavingToast = message === "Saving game";

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
        }),
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
          }),
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
          borderColor: isSavingToast ? Colors.accentBlue : Colors.accentGold,
          backgroundColor: Colors.backgroundPanel,
          shadowColor: isSavingToast ? Colors.accentBlue : Colors.accentGold,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.7,
          shadowRadius: 8,
        },
        isSavingToast && styles.savingToast,
      ]}
    >
      {isSavingToast ? (
        <View style={styles.savingContainer}>
          <View style={styles.savingIconContainer}>
            <MaterialCommunityIcons
              name="content-save"
              size={18}
              color={Colors.accentBlue}
              style={styles.saveIcon}
            />
          </View>
          <Text style={[styles.toastText, styles.savingText]}>{message}</Text>
        </View>
      ) : (
        <Text style={styles.toastText}>{message}</Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
    marginHorizontal: 20,
    backgroundColor: "#23233a",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    zIndex: 1000,
    elevation: 10,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
  },
  toastText: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "bold",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  savingToast: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    top: 40,
    right: 0,
    left: undefined,
    width: "auto",
    maxWidth: 180,
    marginHorizontal: 0,
    marginRight: 20,
    borderRadius: 8,
  },
  savingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  savingText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: "normal",
    textShadowRadius: 0,
    marginLeft: 8,
  },
  savingIconContainer: {
    position: "relative",
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  activityIndicator: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  saveIcon: {
    position: "absolute",
    left: 3,
    top: 3,
  },
});

export default Toast;
