// components/RecipeCard/RecipeCard.js
import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { items } from "../../data/items";

// Now accepting 'activeCrafts' as a prop
const RecipeCard = ({ recipe, inventory, craftItem, activeCrafts }) => {
  if (!recipe) {
    return null;
  }

  const currentItems = inventory?.items || {};
  const ownedMachines = inventory?.ownedMachines || [];

  let outputItemKey = null;
  let outputQuantity = 0;

  if (recipe.output && Object.keys(recipe.output).length > 0) {
    outputItemKey = Object.keys(recipe.output)[0];
    outputQuantity = recipe.output[outputItemKey];
  }

  // Get current craft status for this recipe
  const currentCraft = activeCrafts[recipe.id];
  const isCrafting = !!currentCraft; // True if this recipe is currently active

  const canCraft = useMemo(() => {
    // If already crafting, cannot craft again
    if (isCrafting) {
        return false;
    }

    if (!ownedMachines.includes(recipe.machine)) {
      return false;
    }

    for (const inputId in recipe.inputs) {
      const requiredAmount = recipe.inputs[inputId];
      const currentAmount = currentItems[inputId]?.currentAmount || 0;
      if (currentAmount < requiredAmount) {
        return false;
      }
    }
    return true;
  }, [recipe, currentItems, ownedMachines, isCrafting]); // Add isCrafting to dependencies

  const handleCraft = () => {
    if (canCraft) {
      craftItem(recipe.id, outputItemKey, outputQuantity);
    }
  };

  // Calculate progress for the progress bar
  const progress = currentCraft ? (currentCraft.totalTime - currentCraft.remainingTime) / currentCraft.totalTime : 0;

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
      {outputItemKey ? (
        <Text style={cardStyles.resourceText}>
          - {items[outputItemKey]?.name || outputItemKey}:{" "}
          {outputQuantity}
        </Text>
      ) : (
        <Text style={cardStyles.resourceText}>No output defined for this recipe.</Text>
      )}

      {/* Timer and Progress Bar */}
      {isCrafting && currentCraft ? (
        <View style={cardStyles.timerContainer}>
          <Text style={cardStyles.timerText}>
            Crafting: {currentCraft.remainingTime}s remaining
          </Text>
          <View style={cardStyles.progressBarBackground}>
            <View style={[cardStyles.progressBarFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>
      ) : null}

      {/* Craft Button */}
      <TouchableOpacity
        style={[
          cardStyles.craftButton,
          (!canCraft || isCrafting) && cardStyles.craftButtonDisabled, // Disable if crafting
        ]}
        onPress={handleCraft}
        disabled={!canCraft || isCrafting} // Disable if crafting
      >
        <Text style={cardStyles.craftButtonText}>
          {isCrafting
            ? "Crafting..."
            : canCraft
            ? `Craft ${recipe.name}`
            : "Cannot Craft"}
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
  timerContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 16,
    color: '#f0f0f0',
    marginBottom: 5,
  },
  progressBarBackground: {
    width: '100%',
    height: 10,
    backgroundColor: '#555',
    borderRadius: 5,
    overflow: 'hidden', // Ensures fill stays within bounds
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#a0d911', // Green progress bar
    borderRadius: 5,
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
