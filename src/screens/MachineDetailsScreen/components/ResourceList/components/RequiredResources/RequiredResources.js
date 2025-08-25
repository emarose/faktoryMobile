
import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "./styles";
import { items } from "../../../../../../data/items";

const RequiredResources = ({ input, amount, inventory, getResourceIcon }) => {
  if (!input || input.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons
          name="information-outline"
          size={20}
          color="#888"
        />
        <Text style={styles.emptyText}>None required</Text>
      </View>
    );
  }
  return (
    <View style={styles.resourceListContainer}>
      {input.map((input) => {
        const baseAmount = input.amount;
        const requiredAmount = baseAmount * amount;
        const currentAmount = inventory[input.item]?.currentAmount || 0;
        const hasEnough = currentAmount >= requiredAmount;
        const itemName = items[input.item]?.name || input.item;
        return (
          <View key={input.item} style={styles.resourceRow}>
            <View
              style={[
                styles.resourceIconContainer,
                {
                  backgroundColor: hasEnough ? "#23233a" : "#3a2a2a",
                  borderColor: hasEnough ? "#444455" : "#663333",
                },
              ]}
            >
              <MaterialCommunityIcons
                name={getResourceIcon(input.item)}
                size={18}
                color={hasEnough ? "#4CAF50" : "#ff6b6b"}
              />
            </View>
            <View style={styles.resourceInfoContainer}>
              <Text style={styles.resourceName}>
                {requiredAmount} x {itemName}
              </Text>
              {!hasEnough && (
                <View style={styles.resourceErrorBadge}>
                  <Text style={styles.resourceErrorBadgeText}>
                    Faltan {requiredAmount - currentAmount}
                  </Text>
                </View>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default RequiredResources;
