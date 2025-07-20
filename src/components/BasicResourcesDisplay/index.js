// components/BasicResourcesSummary/BasicResourcesSummary.js
import React from "react"; // Make sure React is imported
import { View, Text, StyleSheet } from "react-native";
import { useGame } from "../../contexts/GameContext";

const BasicResourcesSummary = () => {
  const { inventory } = useGame();

  // Define which basic resources you want to display in this summary
  // These should be the actual item IDs (e.g., 'ironOre'), not node IDs.
  const summaryResourceIds = ["ironOre", "copperOre", "coal", "limestone"];

  return (
    <View style={styles.container}>
      {summaryResourceIds.map((resourceId) => {
        const item = inventory[resourceId];
        // Ensure the item exists and has a currentAmount property.
        // Use nullish coalescing (?? 0) to default currentAmount to 0 if it's undefined/null.
        const currentAmount = item?.currentAmount ?? 0;

        // Only render if the item exists in the inventory (even if amount is 0)
        // or if you only want to show items with > 0 amount, add `if (currentAmount === 0) return null;`
        if (!item) return null;

        return (
          <View key={resourceId} style={styles.resourceLine}>
            <Text style={styles.resourceName}>{item.name}:</Text>
            <Text style={styles.resourceAmount}>
              {Math.floor(currentAmount)}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 5,
    alignItems: "center",
  },
  resourceLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%", // Control width of the lines
    marginBottom: 3,
  },
  resourceName: {
    fontSize: 16,
    color: "#cccccc",
    fontWeight: "bold",
  },
  resourceAmount: {
    fontSize: 16,
    color: "#a0d911",
    fontWeight: "bold",
  },
});

export default BasicResourcesSummary;
