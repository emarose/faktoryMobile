import React from "react";
import { View } from "react-native";
import { Text } from "../../../../components";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Colors from "../../../../constants/Colors";

const PlayerInfo = ({ visualPlayerPos, currentMilestone, nextMilestone }) => {
  return (
    <View
      style={{
        alignSelf: "flex-start",
        flexDirection: "column",
        gap: 8,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        padding: 8,
        marginTop:16
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <MaterialIcons
          name="my-location"
          size={18}
          color={Colors.accentGold}
          style={{ opacity: 0.85 }}
        />
        <Text style={{ fontSize: 12, color: Colors.textPrimary }}>
          Position: ({visualPlayerPos.x}, {visualPlayerPos.y})
        </Text>
      </View>
     {/*  <View style={{ marginBottom: 8 }}>
        {currentMilestone || nextMilestone ? (
          <View
            style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
          >
            <MaterialCommunityIcons
              name="flag-checkered"
              size={18}
              color={Colors.success}
            />
            <Text
              style={{ fontSize: 12, color: Colors.textSecondary }}
              numberOfLines={1}
            >
              {currentMilestone.requirementsDescription}
            </Text>
          </View>
        ) : (
          <Text style={{ fontSize: 11, color: Colors.textSecondary }}>
            No hay misiones pendientes
          </Text>
        )}
      </View> */}
    </View>
  );
};

export default React.memo(PlayerInfo);
