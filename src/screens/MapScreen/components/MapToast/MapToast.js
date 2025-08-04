import React, { useEffect } from "react";
import { Animated, Text, StyleSheet } from "react-native";

const MapToast = ({ visible, message, onHide }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      // Hide after 1.5s
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }).start(() => onHide && onHide());
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [visible, fadeAnim, onHide]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.toast, { opacity: fadeAnim }]}>  
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 32,
    alignSelf: 'center',
    backgroundColor: '#23272a',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 10,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    zIndex: 999,
  },
  text: {
    color: '#27ae60',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default MapToast;
