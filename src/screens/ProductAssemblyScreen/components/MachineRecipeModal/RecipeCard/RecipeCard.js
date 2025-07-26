import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { items } from "../../../../../data/items";
import { cardStyles } from "./styles";

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

  const currentCraft = activeCrafts[recipe.id];
  const isCrafting = !!currentCraft;

  const canCraft = useMemo(() => {
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
  }, [recipe, currentItems, ownedMachines, isCrafting]);

  const handleCraft = () => {
    if (canCraft) {
      craftItem(recipe.id, outputItemKey, outputQuantity);
    }
  };

  const progress = currentCraft
    ? (currentCraft.totalTime - currentCraft.remainingTime) /
      currentCraft.totalTime
    : 0;

  return (
    <View style={cardStyles.card}>
      <Text style={cardStyles.recipeName}>{recipe.name}</Text>

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

      <Text style={cardStyles.sectionTitle}>Output:</Text>
      {outputItemKey ? (
        <Text style={cardStyles.resourceText}>
          - {items[outputItemKey]?.name || outputItemKey}: {outputQuantity}
        </Text>
      ) : (
        <Text style={cardStyles.resourceText}>
          No output defined for this recipe.
        </Text>
      )}

      {isCrafting && currentCraft ? (
        <View style={cardStyles.timerContainer}>
          <Text style={cardStyles.timerText}>
            Crafting: {currentCraft.remainingTime}s remaining
          </Text>
          <View style={cardStyles.progressBarBackground}>
            <View
              style={[
                cardStyles.progressBarFill,
                { width: `${progress * 100}%` },
              ]}
            />
          </View>
        </View>
      ) : null}

      <TouchableOpacity
        style={[
          cardStyles.craftButton,
          (!canCraft || isCrafting) && cardStyles.craftButtonDisabled,
        ]}
        onPress={handleCraft}
        disabled={!canCraft || isCrafting}
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

export default RecipeCard;
