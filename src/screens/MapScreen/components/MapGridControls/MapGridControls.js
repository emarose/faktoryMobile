import React, { useState } from "react";
import { View, TouchableOpacity, Animated } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../../../constants/Colors";

const BUTTON_SIZE = 52; // Aumentado de 38 a 52
const ICON_SIZE = 28;   // Aumentado de 20 a 28
const BUTTON_OFFSET = 12; // Aumentado ligeramente para mejor espaciado

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
  const [pressedButton, setPressedButton] = useState(null);
  const padSize = 140 + BUTTON_OFFSET * 2.5; // Aumentado para acomodar botones más grandes

  const handlePressIn = (dir) => {
    setPressedButton(dir);
  };

  const handlePressOut = () => {
    setPressedButton(null);
  };

  const handlePress = (dir) => {
    if (exploreDirection) {
      exploreDirection(dir);
    }
    // Pequeña vibración visual manteniendo el estado pressed un poco más
    setTimeout(() => setPressedButton(null), 100);
  };

  return (
    <View
      style={{
        position: "relative", // Cambiado de absolute a relative
        width: padSize,
        height: padSize,
        zIndex: 20,
        alignItems: "center",
        justifyContent: "center",
        opacity: 0.9,
      }}
    >
      {/* D-pad cross */}
      {DPAD_CONFIG.map(({ dir, icon, style }) => {
        const isPressed = pressedButton === dir;
        return (
          <TouchableOpacity
            key={dir}
            style={Object.assign(
              {
                position: "absolute",
                width: BUTTON_SIZE,
                height: BUTTON_SIZE,
                borderRadius: BUTTON_SIZE / 2,
                backgroundColor: isPressed ? Colors.backgroundAccent : Colors.overlay,
                alignItems: "center",
                justifyContent: "center",
                elevation: isPressed ? 12 : 8,
                borderWidth: isPressed ? 2 : 1,
                borderColor: isPressed ? Colors.accentGold : Colors.borderLight,
                shadowColor: "#000",
                shadowOpacity: isPressed ? 0.4 : 0.2,
                shadowRadius: isPressed ? 5 : 3,
                shadowOffset: { width: 0, height: isPressed ? 2 : 1 },
                transform: [{ scale: isPressed ? 0.95 : 1 }],
              },
              style
            )}
            onPress={() => handlePress(dir)}
            onPressIn={() => handlePressIn(dir)}
            onPressOut={handlePressOut}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} // Área de toque ampliada
          >
            <MaterialCommunityIcons
              name={icon}
              size={ICON_SIZE}
              color={isPressed ? "#fff" : Colors.textPrimary}
            />
          </TouchableOpacity>
        );
      })}
      {/* Center dot - también mejorado */}
      <View
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          marginLeft: -12,
          marginTop: -12,
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: Colors.background,
          borderWidth: 1.5,
          borderColor: Colors.borderLight,
          alignItems: "center",
          justifyContent: "center",
          elevation: 4,
          shadowColor: "#000",
          shadowOpacity: 0.15,
          shadowRadius: 2,
          shadowOffset: { width: 0, height: 1 },
        }}
      >
        <MaterialCommunityIcons
          name="circle-medium"
          size={16}
          color={Colors.textMuted}
        />
      </View>
    </View>
  );
};

export default MapGridControls;
