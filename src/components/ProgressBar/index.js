import React, { useState, useRef, useEffect } from "react";
import { View, Animated } from "react-native";
import Text from "../Text";
import * as Progress from "react-native-progress";
import Colors from "../../constants/Colors";

const ProgressBar = ({
  value,
  max = 1,
  label,
  height = 20,
  color = Colors.backgroundAccent,
  backgroundColor = Colors.background,
  style,
  textColor = Colors.textPrimary,
}) => {
  const [barWidth, setBarWidth] = useState(null);
  const pulse = useRef(new Animated.Value(0)).current;
  const prevProgressRef = useRef(0);
  // coerce to safe numbers to avoid NaN transforms in native Animated views
  const safeValue =
    typeof value === "number" && !isNaN(value) ? value : Number(value) || 0;
  const safeMax =
    typeof max === "number" && !isNaN(max) && Number(max) > 0 ? Number(max) : 1;
  const progress = Math.max(0, Math.min(1, safeValue / safeMax));
  const progressText = `${Math.floor(safeValue)} / ${safeMax}`;

  // Trigger a subtle pulse animation when progress increases
  useEffect(() => {
    const prev = prevProgressRef.current;
    // Trigger pulse on any change (increase or decrease) but not on first mount
    if (typeof prev === "number" && progress !== prev) {
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 120,
          useNativeDriver: true,
        }),
      ]).start();
    }
    prevProgressRef.current = progress;
  }, [progress, pulse]);

  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });

  return (
    <View style={[{ marginVertical: 4 }, style]}>
      {label && (
        <Text
          style={{ color: Colors.textPrimary, fontSize: 12, marginBottom: 6 }}
        >
          {label}
        </Text>
      )}

      <View
        style={{
          height: height,
          justifyContent: "center",
          alignItems: "center",
        }}
        onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
      >
        {barWidth && (
          <Progress.Bar
            progress={progress}
            width={barWidth}
            height={height}
            color={color}
            unfilledColor={backgroundColor}
            borderWidth={1}
            borderRadius={8}
            animated={true}
            style={{}}
          />
        )}
        <Animated.View
          style={{
            position: "absolute",
            width: "100%",
            transform: [{ scale }],
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: textColor,
              fontSize: 12,
              fontWeight: "bold",
            }}
          >
            {progressText}
          </Text>
        </Animated.View>
      </View>
    </View>
  );
};

export default ProgressBar;
