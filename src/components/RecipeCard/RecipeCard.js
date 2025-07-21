// components/RecipeCard/RecipeCard.js
import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { items } from "../../data/items"; // Still needed to look up item names

// Ensure you receive 'recipe', 'inventory' (which has .items and .ownedMachines), and 'craftItem'
const RecipeCard = ({ recipe, inventory, craftItem }) => {
  if (!recipe) {
    return null;
  }

  const currentItems = inventory?.items || {};
  const ownedMachines = inventory?.ownedMachines || [];

  // --- CRITICAL FIX: Correctly extract output item ID and quantity ---
  let outputItemKey = null;
  let outputQuantity = 0;

  if (recipe.output && Object.keys(recipe.output).length > 0) {
    outputItemKey = Object.keys(recipe.output)[0]; // Get the first (and likely only) key
    outputQuantity = recipe.output[outputItemKey]; // Get the value for that key
  }
  // --- END CRITICAL FIX ---


  const canCraft = useMemo(() => {
    // Check if the machine is owned
    if (!ownedMachines.includes(recipe.machine)) {
      return false; // Cannot craft if the required machine type is not owned
    }

    // Check if player has enough input resources
    for (const inputId in recipe.inputs) {
      const requiredAmount = recipe.inputs[inputId];
      const currentAmount = currentItems[inputId]?.currentAmount || 0;
      if (currentAmount < requiredAmount) {
        return false; // Not enough resources
      }
    }
    return true; // All conditions met
  }, [recipe, currentItems, ownedMachines]);

  const handleCraft = () => {
    if (canCraft) {
      // --- CRITICAL FIX: Pass correct output ID and quantity to craftItem ---
      craftItem(recipe.id, outputItemKey, outputQuantity);
      // --- END CRITICAL FIX ---
    }
  };

  return (
    <View style={cardStyles.card}>
      <Text style={cardStyles.recipeName}>{recipe.name}</Text>

      {/* Inputs */}
      <Text style={cardStyles.sectionTitle}>Inputs:</Text>
      {Object.entries(recipe.inputs || {}).map(([inputId, amount]) => (
        <Text key={inputId} style={cardStyles.resourceText}>
          - {currentItems[inputId]?.name || inputId}: {amount} (
          <Text
            style={{
              color:
                (currentItems[inputId]?.currentAmount || 0) >= amount
                  ? "#a0d911"
                  : "#ff6347",
            }}
          >
            {Math.floor(currentItems[inputId]?.currentAmount || 0)}
          </Text>
          /{amount})
        </Text>
      ))}

      {/* Output */}
      <Text style={cardStyles.sectionTitle}>Output:</Text>
      {outputItemKey ? ( // <--- Use the new outputItemKey for conditional rendering
        <Text style={cardStyles.resourceText}>
          - {items[outputItemKey]?.name || outputItemKey}:{" "} {/* Use outputItemKey here */}
          {outputQuantity} {/* Use outputQuantity here */}
        </Text>
      ) : (
        <Text style={cardStyles.resourceText}>No output defined for this recipe.</Text>
      )}

      {/* Craft Button */}
      <TouchableOpacity
        style={[
          cardStyles.craftButton,
          !canCraft && cardStyles.craftButtonDisabled,
        ]}
        onPress={handleCraft}
        disabled={!canCraft}
      >
        <Text style={cardStyles.craftButtonText}>
          {canCraft ? `Craft ${recipe.name}` : "Cannot Craft"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: "#3a3a5a",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#5a5a7e",
    width: "100%",
  },
  recipeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#a0d911",
    marginBottom: 10,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e0e0e0",
    marginTop: 5,
    marginBottom: 3,
  },
  resourceText: {
    fontSize: 14,
    color: "#cccccc",
    marginLeft: 10,
  },
  craftButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 15,
    alignItems: "center",
  },
  craftButtonDisabled: {
    backgroundColor: "#6c757d",
  },
  craftButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default RecipeCard;