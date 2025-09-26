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
        marginTop: 8,
      }}
    >
      {/* Botón momentáneo para regenerar el seed del mundo */}
      <TouchableOpacity
        style={{
          marginHorizontal: 8,
          backgroundColor: Colors.backgroundPanel,
          borderRadius: 16,
          paddingVertical: 4,
          paddingHorizontal: 16,
          borderWidth: 1,
          borderColor: Colors.accentGold,
        }}
        onPress={onRegenerateSeed}
      >
        <Text style={{ color: Colors.accentGold }}>Change seed</Text>
      </TouchableOpacity>
      {/* Botón para activar el seed de test */}
      <TouchableOpacity
        style={{
          marginHorizontal: 8,
          backgroundColor: Colors.backgroundPanel,
          borderRadius: 16,
          paddingVertical: 4,
          paddingHorizontal: 16,
          borderWidth: 1,
          borderColor: Colors.accentBlue,
        }}
        onPress={onSetTestSeed}
      >
        <Text style={{ color: Colors.accentBlue }}>Test Seed</Text>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(MapControls);
