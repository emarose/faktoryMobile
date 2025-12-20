import React from "react";
import { TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "../../../../../components";
import Colors from "../../../../../constants/Colors";

const CraftButton = ({
  label,
  onPress,
  disabled,
  icon = "smog",
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
          ? "#3a3a48"
          : isActive
          ? "#ff9800"
          : "#2c2c2c",
        borderRadius: 12,
        paddingVertical: 14,
        marginHorizontal: 4,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: disabled ? Colors.border : "#ff9800",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Text
          style={{
            color: disabled ? Colors.textMuted : "#fff",
            fontSize: 14,
          }}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CraftButton;
