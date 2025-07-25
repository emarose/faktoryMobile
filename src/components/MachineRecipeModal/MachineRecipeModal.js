import React, { useMemo } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { items } from '../../data/items';
import RecipeCard from '../RecipeCard/RecipeCard';
import { useGame } from '../../contexts/GameContext'; // Import useGame to get activeCrafts
import modalStyles from './styles'; // Assuming you have a styles.js for modal styles
const MachineRecipeModal = ({ isVisible, onClose, machineType, inventory, craftItem }) => {
  const { activeCrafts } = useGame(); // <--- Get activeCrafts from GameContext

  // Depuración: Log cuando el modal se hace visible y qué machineType recibe
  React.useEffect(() => {
    if (isVisible) {
      console.log("MODAL DEBUG: MachineRecipeModal is visible. machineType received:", machineType);
    }
  }, [isVisible, machineType]);

  const recipesForMachine = useMemo(() => {
    if (!machineType) {
      console.log("MODAL DEBUG: No machineType provided, returning empty recipes.");
      return [];
    }

    const machineRecipes = [];
    console.log(`MODAL DEBUG: Looking for recipes for machineType: "${machineType}"`);

    Object.values(items).forEach(itemDefinition => {
      // Depuración: Log cada itemDefinition que se está revisando y su propiedad 'machine'
      // console.log(`  Checking item: ${itemDefinition.id}, machine: ${itemDefinition.machine}`);

      if (itemDefinition.machine === machineType && itemDefinition.inputs && itemDefinition.output) {
        machineRecipes.push(itemDefinition);
        console.log(`  FOUND RECIPE: ${itemDefinition.name} for ${machineType}`);
      } else {
        // Depuración: Si no coincide, log por qué
        // if (itemDefinition.machine !== machineType) {
        //   console.log(`  SKIP: ${itemDefinition.name} (machine mismatch: ${itemDefinition.machine} !== ${machineType})`);
        // }
        // if (!itemDefinition.inputs) {
        //   console.log(`  SKIP: ${itemDefinition.name} (missing inputs)`);
        // }
        // if (!itemDefinition.output) {
        //   console.log(`  SKIP: ${itemDefinition.name} (missing output)`);
        // }
      }
    });

    console.log(`MODAL DEBUG: Found ${machineRecipes.length} recipes for ${machineType}.`);
    return machineRecipes;
  }, [machineType, items]); // La dependencia 'items' asegura que se re-ejecuta si los datos de ítems cambian (aunque items es una constante, es buena práctica si se pudiera modificar dinámicamente)

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <Text style={modalStyles.modalTitle}>
            Recipes for {items[machineType]?.name || machineType}
          </Text>

          <ScrollView style={modalStyles.scrollView}>
            {recipesForMachine.length > 0 ? (
              recipesForMachine.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  inventory={inventory}
                  craftItem={craftItem}
                  activeCrafts={activeCrafts}
                />
              ))
            ) : (
              <Text style={modalStyles.noRecipesText}>
                No recipes found for this machine type.
              </Text>
            )}
          </ScrollView>

          <TouchableOpacity
            style={modalStyles.closeButton}
            onPress={onClose}
          >
            <Text style={modalStyles.textStyle}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default MachineRecipeModal;
