import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "../../../../components";
import Colors from "../../../../constants/Colors";

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
          backgroundColor: Colors.backgroundPanel,
          borderRadius: 16,
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderWidth: 2,
          borderColor: Colors.accentGold,
        }}
        onPress={onRegenerateSeed}
      >
        <Text style={{ color: Colors.accentGold, fontWeight: "bold" }}>
          Change seed
        </Text>
      </TouchableOpacity>
      {/* Botón para activar el seed de test */}
      <TouchableOpacity
        style={{
          marginHorizontal: 8,
          backgroundColor: Colors.backgroundPanel,
          borderRadius: 16,
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderWidth: 2,
          borderColor: Colors.primary,
        }}
        onPress={onSetTestSeed}
      >
        <Text style={{ color: Colors.primary, fontWeight: "bold" }}>
          Test Seed
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(MapControls);
