import React, { useEffect, useRef, useState } from "react";
import { Animated, TouchableOpacity, View } from "react-native";
import { Text } from "../../../../components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../../../constants/Colors";
import styles from "./styles";

const MapToast = ({ visible, message, onHide, duration = 5000 }) => {
  const [isPressed, setIsPressed] = useState(false);
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        handleHide();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleHide = () => {
    // Animación de salida
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide && onHide();
    });
  };

  if (!visible) return null;

  return (
    <Animated.View 
      style={[
        styles.toast,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        }
      ]}
    >
      {/* Overlay sutil para mejor contraste */}
      <View style={styles.toastOverlay} />
      
      {/* Icono de success */}
      <MaterialCommunityIcons
        name="check-circle"
        size={20}
        color={Colors.accentGreen}
        style={{ marginRight: 10 }}
      />
      
      <Text style={styles.text}>{message}</Text>
      
      <TouchableOpacity
        style={[
          styles.closeBtn,
          isPressed && styles.closeBtnPressed
        ]}
        onPress={handleHide}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <MaterialCommunityIcons
          name="close"
          size={18}
          color={Colors.textSecondary}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default MapToast;
