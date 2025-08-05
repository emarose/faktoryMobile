import React from "react";
import { View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const BUTTON_SIZE = 50;
const ARROW_CONFIGS = [
  {
    dir: "up",
    icon: "arrow-up",
    left: (size) => size / 2 - BUTTON_SIZE / 2,
    top: () => 0,
  },
  {
    dir: "down",
    icon: "arrow-down",
    left: (size) => size / 2 - BUTTON_SIZE / 2,
    top: (size) => size - BUTTON_SIZE,
  },
  {
    dir: "left",
    icon: "arrow-left",
    left: () => 0,
    top: (size) => size / 2 - BUTTON_SIZE / 2,
  },
  {
    dir: "right",
    icon: "arrow-right",
    left: (size) => size - BUTTON_SIZE,
    top: (size) => size / 2 - BUTTON_SIZE / 2,
  },
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
          // Translate so icon is centered on the middle of the final grid line
          transform:
            dir === "up"
              ? [{ translateY: -BUTTON_SIZE / 2 }]
              : dir === "down"
              ? [{ translateY: BUTTON_SIZE / 2 }]
              : dir === "left"
              ? [{ translateX: -BUTTON_SIZE / 2 }]
              : dir === "right"
              ? [{ translateX: BUTTON_SIZE / 2 }]
              : [],
        }}
      >
        <TouchableOpacity
          style={{
            width: BUTTON_SIZE,
            height: BUTTON_SIZE,
            elevation: 8,
            borderRadius: 20,
            backgroundColor: "rgba(255,255,255,0.1)",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => exploreDirection && exploreDirection(dir)}
        >
          <Icon name={icon} size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    ))}
  </>
);

export default MapGridControls;
