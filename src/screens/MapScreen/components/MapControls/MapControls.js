import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "../../../../components";

const MapControls = ({ onRegenerateSeed, onSetTestSeed }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 8,
      }}
    >
      {/* Botón momentáneo para regenerar el seed del mundo */}
      <TouchableOpacity
        style={{
          marginHorizontal: 8,
          backgroundColor: "#23233a",
          borderRadius: 16,
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderWidth: 2,
          borderColor: "#FFD700",
        }}
        onPress={onRegenerateSeed}
      >
        <Text style={{ color: "#FFD700", fontWeight: "bold" }}>
          Change seed
        </Text>
      </TouchableOpacity>
      {/* Botón para activar el seed de test */}
      <TouchableOpacity
        style={{
          marginHorizontal: 8,
          backgroundColor: "#23233a",
          borderRadius: 16,
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderWidth: 2,
          borderColor: "#00BFFF",
        }}
        onPress={onSetTestSeed}
      >
        <Text style={{ color: "#00BFFF", fontWeight: "bold" }}>
          Test Seed
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(MapControls);
