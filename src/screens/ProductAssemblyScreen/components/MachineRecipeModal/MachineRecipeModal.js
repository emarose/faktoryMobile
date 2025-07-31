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
              recipesForMachine.map((recipe) => {
                // UI for crafting: show required resources, output, and a button
                // Add number input for amount
                const [amount, setAmount] = useState('1');
                const parsedAmount = Math.max(1, parseInt(amount) || 1);
                const canAfford = (recipe.inputs || []).every(input =>
                  (inventory[input.item]?.currentAmount || 0) >= (input.amount * parsedAmount)
                );
                return (
                  <View key={recipe.id} style={{ marginBottom: 16, backgroundColor: '#23233a', borderRadius: 8, padding: 12 }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{recipe.name}</Text>
                    <Text style={{ color: '#fff', marginTop: 4 }}>Requires:</Text>
                    {(recipe.inputs || []).length === 0 ? (
                      <Text style={{ color: '#fff' }}>None</Text>
                    ) : (
                      (recipe.inputs || []).map(input => (
                        <Text key={input.item} style={{ color: '#fff' }}>
                          {input.amount * parsedAmount} x {items[input.item]?.name || input.item} (You have: {inventory[input.item]?.currentAmount || 0})
                        </Text>
                      ))
                    )}
                    <Text style={{ color: '#fff', marginTop: 4 }}>Produces:</Text>
                    {recipe.output ? (
                      <Text style={{ color: '#fff' }}>{(recipe.outputAmount || 1) * parsedAmount} x {items[recipe.output]?.name || recipe.output}</Text>
                    ) : (Array.isArray(recipe.outputs) && recipe.outputs.length > 0 ? (
                      recipe.outputs.map(output => (
                        <Text key={output.item} style={{ color: '#fff' }}>{(output.amount || 1) * parsedAmount} x {items[output.item]?.name || output.item}</Text>
                      ))
                    ) : null)}
                    <Text style={{ color: '#fff', marginTop: 4 }}>Amount to craft:</Text>
                    <TextInput
                      style={{ backgroundColor: '#fff', color: '#222', borderRadius: 6, padding: 6, marginBottom: 8, width: 80 }}
                      keyboardType="numeric"
                      value={amount}
                      onChangeText={val => setAmount(val.replace(/[^0-9]/g, ""))}
                    />
                    <TouchableOpacity
                      style={{
                        backgroundColor: canAfford ? '#27ae60' : '#aaa',
                        borderRadius: 6,
                        paddingVertical: 8,
                        paddingHorizontal: 18,
                        alignItems: 'center',
                        marginTop: 8,
                      }}
                      disabled={!canAfford}
                      onPress={() => {
                        const success = craftItem(recipe.id, parsedAmount);
                        if (success) {
                          onClose();
                        }
                      }}
                    >
                      <Text style={{ color: '#fff', fontWeight: 'bold' }}>Craft</Text>
                    </TouchableOpacity>
                    {!canAfford && (
                      <Text style={{ color: '#e53935', marginTop: 4 }}>Not enough resources.</Text>
                    )}
                  </View>
                );
              })
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