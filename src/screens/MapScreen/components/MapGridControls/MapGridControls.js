import React from "react";
import { View, TouchableOpacity, Text } from "react-native";

const ARROW_CONFIGS = [
  { dir: "up", icon: "↑", left: (size) => size / 2 - 20, top: () => 5 },
  { dir: "down", icon: "↓", left: (size) => size / 2 - 20, top: (size) => size - 55 },
  { dir: "left", icon: "←", left: () => 15, top: (size) => size / 2 - 20 },
  { dir: "right", icon: "→", left: (size) => size - 45, top: (size) => size / 2 - 20 },
];

const MapGridControls = ({ MAP_DISPLAY_SIZE, exploreDirection }) => (
  <>
    {ARROW_CONFIGS.map(({ dir, icon, left, top }) => (
      <View
        key={dir}
        style={{
          position: "absolute",
          left: typeof left === "function" ? left(MAP_DISPLAY_SIZE) : left,
          top: typeof top === "function" ? top(MAP_DISPLAY_SIZE) : top,
          zIndex: 10,
        }}
      >
        <TouchableOpacity
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "rgba(0,0,0,0.4)",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => exploreDirection && exploreDirection(dir)}
        >
          <Text style={{ color: "#fff", fontSize: 22 }}>{icon}</Text>
        </TouchableOpacity>
      </View>
    ))}
  </>
);

export default MapGridControls;
