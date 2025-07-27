import { useEffect, useMemo } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { items } from "../../../../data/items";
import { useGame } from "../../../../contexts/GameContext";
import modalStyles from "./styles";
import RecipeCard from "./RecipeCard/RecipeCard";

const MachineRecipeModal = ({
  isVisible,
  onClose,
  machineId,
  ownedMachines,
  assignRecipeToMachine,
  inventory,
  craftItem,
}) => {
  const { activeCrafts } = useGame();

  // Find the machine object by id
  const machine = ownedMachines?.find((m) => m.id === machineId);
  const machineType = machine?.type;

  useEffect(() => {
    if (isVisible) {
      console.log(
        "MODAL DEBUG: MachineRecipeModal is visible. machineId received:",
        machineId,
        "machineType:",
        machineType
      );
    }
  }, [isVisible, machineId, machineType]);

  const recipesForMachine = useMemo(() => {
    if (!machineType) {
      console.log(
        "MODAL DEBUG: No machineType provided, returning empty recipes."
      );
      return [];
    }
    const machineRecipes = [];
    Object.values(items).forEach((itemDefinition) => {
      if (
        itemDefinition.machine === machineType &&
        itemDefinition.inputs &&
        itemDefinition.output
      ) {
        machineRecipes.push(itemDefinition);
      }
    });
    return machineRecipes;
  }, [machineType]);

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
                  onSelectRecipe={() => {
                    assignRecipeToMachine(machineId, recipe.id);
                    onClose();
                  }}
                />
              ))
            ) : (
              <Text style={modalStyles.noRecipesText}>
                No recipes found for this machine type.
              </Text>
            )}
          </ScrollView>
          <TouchableOpacity style={modalStyles.closeButton} onPress={onClose}>
            <Text style={modalStyles.textStyle}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default MachineRecipeModal;