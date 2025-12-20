import React from "react";
import {  TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "../../../../../components";

const CraftButton = ({
  label,
  onPress,
  disabled,
  icon = "factory",
  isActive = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      style={{
        flex: 1,
        backgroundColor: disabled
          ? "#3a4856"
          : isActive
          ? "#4a7fa7"
          : "#2a3441",
        borderRadius: 4,
        paddingVertical: 10,
        marginHorizontal: 3,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: disabled 
          ? "#4a5866" 
          : isActive 
          ? "#6db4f0" 
          : "#4a5866",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <Text
          style={{
            color: disabled ? "#6b7885" : isActive ? "#e8f4fd" : "#b8c7d1",
            fontWeight: isActive ? "700" : "600",
            fontSize: 12,
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CraftButton;
