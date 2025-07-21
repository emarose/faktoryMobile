// components/MachineAssemblyPanel/MachineAssemblyPanel.js
import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { items } from '../../data/items'; // Ensure this path is correct relative to this file
import { RecipeCard } from '../RecipeCard/RecipeCard'; // Ensure this path is correct
import styles from './styles'; // Component's dedicated styles

export const MachineAssemblyPanel = ({ machineType, inventory, craftItem }) => {
  const machineDefinition = items[machineType];
  if (!machineDefinition) {
    return null; // Should ideally not happen if data is consistent
  }

  // Filter all items to find recipes that this specific machine can craft
  const recipesForThisMachine = useMemo(() => {
    return Object.values(items).filter(item =>
      item.inputs && item.output && item.machine === machineType
    );
  }, [machineType]);

  const availableMachineCount = inventory[machineType]?.currentAmount || 0;
  
console.log(recipesForThisMachine, "recipesForThisMachine");

  if (recipesForThisMachine.length === 0) {
    return (
      <View style={styles.machinePanel}>
        <Text style={styles.machineTitle}>{machineDefinition.name}</Text>
        <Text style={styles.machineSubtitle}>Available: {availableMachineCount}</Text>
        <Text style={styles.noRecipesText}>This machine has no known recipes.</Text>
      </View>
    );
  }

  return (
    <View style={styles.machinePanel}>
      <Text style={styles.machineTitle}>{machineDefinition.name}</Text>
      <Text style={styles.machineSubtitle}>Available: {availableMachineCount}</Text>

      {recipesForThisMachine.map(recipeItem => (
        <RecipeCard
          key={recipeItem.id}
          itemDefinition={recipeItem}
          inventory={inventory}
          craftItem={craftItem}
        />
      ))}
    </View>
  );
};