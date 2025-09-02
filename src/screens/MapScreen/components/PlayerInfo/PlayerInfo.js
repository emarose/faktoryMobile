import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

const PlayerInfo = ({ visualPlayerPos, currentMilestone, nextMilestone }) => {
  return (
    <View
      style={{
        alignSelf: "flex-start",
        flexDirection: "column",
        gap: 8,
        borderWidth: 1,
        borderColor: "#444",
        borderRadius: 8,
        padding: 8,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <MaterialIcons
          name="my-location"
          size={18}
          color="#FFD700"
          style={{ opacity: 0.85 }}
        />
        <Text style={{ fontSize: 12, color: "#fff" }}>
          Current position: {visualPlayerPos.x}, {visualPlayerPos.y})
        </Text>
      </View>
      <View style={{ marginBottom: 8 }}>
        {currentMilestone || nextMilestone ? (
          <View
            style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
          >
            <MaterialCommunityIcons
              name="flag-checkered"
              size={18}
              color="#1abc9c"
            />
            <Text
              style={{ fontSize: 12, color: "#e0e0e0" }}
              numberOfLines={1}
            >
              {currentMilestone.requirementsDescription}
            </Text>
          </View>
        ) : (
          <Text style={{ fontSize: 11, color: "#e0e0e0" }}>
            No hay misiones pendientes
          </Text>
        )}
      </View>
    </View>
  );
};

export default React.memo(PlayerInfo);
