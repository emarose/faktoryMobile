import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import * as Progress from "react-native-progress";

const ProgressBar = ({
  value,
  max = 1,
  label,
  height = 16,
  color = "#4CAF50",
  backgroundColor = "#23233a",
  style,
  textColor = "#fff",
}) => {
  const progress = Math.max(0, Math.min(1, value / max));
  const progressText = `${Math.floor(value)} / ${max}`;

  // Escala para el latido
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05, // apenas más grande
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [value]);

  return (
    <View style={[{ marginVertical: 4, justifyContent: "center" }, style]}>
      {label && (
        <Text style={{ color: "#fff", fontSize: 12, marginBottom: 2 }}>
          {label}
        </Text>
      )}

      {/* Barra con animación de escala */}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Progress.Bar
          progress={progress}
          width={null}
          height={height}
          color={color}
          unfilledColor={backgroundColor}
          borderWidth={1}
          borderRadius={8}
          animated={false}
        />
      </Animated.View>

      {/* Texto centrado dentro */}
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Animated.Text
          style={{
            color: textColor,
            fontSize: 11,
            fontWeight: "bold",
            transform: [{ scale: scaleAnim }], // el texto también late
          }}
        >
          {progressText}
        </Animated.Text>
      </View>
    </View>
  );
};

export default ProgressBar;
