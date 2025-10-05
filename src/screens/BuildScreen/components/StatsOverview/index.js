import React from "react";
import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "./styles";
import { Text } from "../../../../components";
import Colors from "../../../../constants/Colors";

export default function StatsOverview({ allBuildableItems, ownedMachines }) {
  return (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <MaterialCommunityIcons name="hammer-wrench" size={24} color={Colors.accentBlue} />
        <Text style={styles.statNumber}>{allBuildableItems.filter((item) => item.canBuild).length}</Text>
        <Text style={styles.statLabel}>Available</Text>
      </View>
      <View style={styles.statItem}>
        <MaterialCommunityIcons name="lock" size={24} color={Colors.textDanger} />
        <Text style={styles.statNumber}>{allBuildableItems.filter((item) => !item.isUnlocked).length}</Text>
        <Text style={styles.statLabel}>Locked</Text>
      </View>
      <View style={styles.statItem}>
        <MaterialCommunityIcons name="cog" size={24} color={Colors.accentGreen} />
        <Text style={styles.statNumber}>{Object.keys(ownedMachines).length}</Text>
        <Text style={styles.statLabel}>Owned</Text>
      </View>
    </View>
  );
}
