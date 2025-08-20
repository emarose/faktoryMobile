import React from "react";
import { View, Text } from "react-native";
import * as Progress from "react-native-progress";

const ProgressBar = ({
  value,
  max = 1,
  label,
  height = 20,
  color = "#4CAF50",
  backgroundColor = "#23233a",
  style,
  textColor = "#fff",
}) => {
  const progress = Math.max(0, Math.min(1, value / max));
  const progressText = `${Math.floor(value)} / ${max}`;

  return (
    <View style={[{ marginVertical: 4 }, style]}>
      {label && (
        <Text style={{ color: "#fff", fontSize: 12, marginBottom: 6 }}>
          {label}
        </Text>
      )}

      <View
        style={{
          height: height,
          justifyContent: "center",
        }}
      >
        <Progress.Bar
          progress={progress}
          width={null}
          height={height}
          color={color}
          unfilledColor={backgroundColor}
          borderWidth={1}
          borderRadius={8}
          animated={false}
          style={{ position: "absolute", top: 0, left: 0, right: 0 }}
        />
        <Text
          style={{
            position: "absolute",
            width: "100%",
            textAlign: "center",
            color: textColor,
            fontSize: 12,
            fontWeight: "bold",
          }}
        >
          {progressText}
        </Text>
      </View>
    </View>
  );
};

export default ProgressBar;