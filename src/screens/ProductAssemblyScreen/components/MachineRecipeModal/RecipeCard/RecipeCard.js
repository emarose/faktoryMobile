import React, { useMemo } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { Text } from "../../../../../components";
import { items } from "../../../../../data/items";
import Colors from "../../../../../constants/Colors";
import styles from "./styles";
// Global assets
import { GameAssets } from "../../../../../components/AppLoader";

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
    <View style={styles.card}>
      <Text style={styles.recipeName}>{recipe.name}</Text>

      <Text style={styles.sectionTitle}>Inputs:</Text>
      {Object.entries(recipe.inputs || {}).map(([inputId, amount]) => (
        <View key={inputId} style={styles.resourceItem}>
          {GameAssets.icons[inputId] ? (
            <Image
              source={GameAssets.icons[inputId]}
              style={styles.itemIcon}
            />
          ) : null}
          <Text style={styles.resourceText}>
            {currentItems[inputId]?.name || inputId}: {amount} (
            <Text
              style={{
                color:
                  (currentItems[inputId]?.currentAmount || 0) >= amount
                    ? Colors.success
                    : Colors.error,
              }}
            >
              {Math.floor(currentItems[inputId]?.currentAmount || 0)}
            </Text>
            /{amount})
          </Text>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Output:</Text>
      {outputItemKey ? (
        <View style={styles.resourceItem}>
          {GameAssets.icons[outputItemKey] ? (
            <Image
              source={GameAssets.icons[outputItemKey]}
              style={styles.itemIcon}
            />
          ) : null}
          <Text style={styles.resourceText}>
            {items[outputItemKey]?.name || outputItemKey}: {outputQuantity}
          </Text>
        </View>
      ) : (
        <Text style={styles.resourceText}>
          No output defined for this recipe.
        </Text>
      )}

      {isCrafting && currentCraft ? (
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>
            Crafting: {currentCraft.remainingTime}s remaining
          </Text>
          <View style={styles.progressBarBackground}>
            <View
              style={[styles.progressBarFill, { width: `${progress * 100}%` }]}
            />
          </View>
        </View>
      ) : null}

      <TouchableOpacity
        style={[
          styles.craftButton,
          (!canCraft || isCrafting) && styles.craftButtonDisabled,
        ]}
        onPress={handleCraft}
        disabled={!canCraft || isCrafting}
      >
        <Text style={styles.craftButtonText}>
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
