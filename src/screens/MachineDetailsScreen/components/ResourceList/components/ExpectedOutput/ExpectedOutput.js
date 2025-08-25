import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "./styles";
import { items } from "../../../../../../data/items";

const ExpectedOutput = ({ output, amount, inventory, getResourceIcon }) => {
  if (!output) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons
          name="information-outline"
          size={20}
          color="#888"
        />
        <Text style={styles.emptyText}>No output defined</Text>
      </View>
    );
  }
  return (
    <View style={styles.outputContainer}>
      <View style={styles.outputIconContainer}>
        <MaterialCommunityIcons
          name={getResourceIcon(output.item)}
          size={22}
          color="#4CAF50"
        />
      </View>
      <View style={styles.outputInfoContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.outputAmount}>
            {output.amount * amount} x {items[output.item]?.name || output.item}
          </Text>
          <View style={styles.outputBadge}>
            <Text style={styles.outputBadgeText}>
              En inventario: {inventory[output.item]?.currentAmount || 0}
            </Text>
          </View>
        </View>
        <Text style={styles.outputDescription}>
          {items[output.item]?.description || ""}
        </Text>
      </View>
    </View>
  );
};

export default ExpectedOutput;
