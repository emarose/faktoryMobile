// components/MachineRecipeModal/MachineRecipeModal.js
import React, { useMemo } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { items } from '../../data/items';
import RecipeCard from '../RecipeCard/RecipeCard';
import { useGame } from '../../contexts/GameContext'; // Import useGame to get activeCrafts

const MachineRecipeModal = ({ isVisible, onClose, machineType, inventory, craftItem }) => {
  const { activeCrafts } = useGame(); // <--- Get activeCrafts from GameContext

  const recipesForMachine = useMemo(() => {
    if (!machineType) return [];

    const machineRecipes = [];
    Object.values(items).forEach(itemDefinition => {
      if (itemDefinition.machine === machineType && itemDefinition.inputs && itemDefinition.output) {
        machineRecipes.push(itemDefinition);
      }
    });
    return machineRecipes;
  }, [machineType, items]);

  return (
    <Modal
      animationType="slide"
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
                  activeCrafts={activeCrafts} // <--- Pass activeCrafts to RecipeCard
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

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalView: {
    margin: 20,
    backgroundColor: "#2a2a4a",
    borderRadius: 10,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    color: "#e0e0e0",
  },
  scrollView: {
    width: '100%',
    maxHeight: '70%',
  },
  noRecipesText: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  closeButton: {
    backgroundColor: "#007bff",
    borderRadius: 8,
    padding: 12,
    elevation: 2,
    marginTop: 20,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  }
});

export default MachineRecipeModal;
