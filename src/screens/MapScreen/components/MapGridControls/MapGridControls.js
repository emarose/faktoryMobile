import React from "react";
import { View, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const BUTTON_SIZE = 38;
const ICON_SIZE = 20;
const BUTTON_OFFSET = 10; // separación extra

// D-pad config: up, down, left, right, usando flechas/caret
const DPAD_CONFIG = [
  {
    dir: "up",
    icon: "chevron-up",
    style: { top: BUTTON_OFFSET, left: "50%", marginLeft: -BUTTON_SIZE / 2 },
  },
  {
    dir: "down",
    icon: "chevron-down",
    style: { bottom: BUTTON_OFFSET, left: "50%", marginLeft: -BUTTON_SIZE / 2 },
  },
  {
    dir: "left",
    icon: "chevron-left",
    style: { left: BUTTON_OFFSET, top: "50%", marginTop: -BUTTON_SIZE / 2 },
  },
  {
    dir: "right",
    icon: "chevron-right",
    style: { right: BUTTON_OFFSET, top: "50%", marginTop: -BUTTON_SIZE / 2 },
  },
];

const MapGridControls = ({ MAP_DISPLAY_SIZE, exploreDirection }) => {
  const padSize = 108 + BUTTON_OFFSET * 2.5;

  return (
    <View
      style={{
        position: "absolute",
        right: 0,
        bottom: 0,
        width: padSize,
        height: padSize,
        zIndex: 20,
        alignItems: "center",
        justifyContent: "center",
        opacity: 0.8,
      }}
    >
      {/* D-pad cross */}
      {DPAD_CONFIG.map(({ dir, icon, style }) => (
        <TouchableOpacity
          key={dir}
          style={Object.assign(
            {
              position: "absolute",
              width: BUTTON_SIZE,
              height: BUTTON_SIZE,
              borderRadius: BUTTON_SIZE / 2,
              backgroundColor: "rgba(30,30,50,0.8)",
              alignItems: "center",
              justifyContent: "center",
              elevation: 2,
              shadowColor: "#000",
              shadowOpacity: 0.5,
              shadowRadius: 3,
              shadowOffset: { width: 0, height: 1 },
            },
            style
          )}
          onPress={() => exploreDirection && exploreDirection(dir)}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name={icon} size={ICON_SIZE} color="#fff" />
        </TouchableOpacity>
      ))}
      {/* Center dot */}
      <View
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          marginLeft: -10,
          marginTop: -10,
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: "#23243a",
          borderWidth: 1.2,
          borderColor: "#444",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialCommunityIcons name="circle-medium" size={14} color="#888" />
      </View>
    </View>
  );
};

export default MapGridControls;
