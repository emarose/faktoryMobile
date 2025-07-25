import { useMemo, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles"; 
import { items } from "../../data/items";
import { useGame } from "../../contexts/GameContext";

const DeployedMachinesScreen = () => {
  const { placedMachines, ownedMachines, allResourceNodes, setMachineRecipe } = useGame();
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [viewMode, setViewMode] = useState('all'); // 'all', 'placed', 'owned'

  const groupedMachines = useMemo(() => {
    const groups = {};
    const machines = viewMode === 'placed' ? placedMachines : 
                    viewMode === 'owned' ? ownedMachines.filter(m => !placedMachines.find(p => p.id === m.id)) :
                    [...placedMachines, ...ownedMachines.filter(m => !placedMachines.find(p => p.id === m.id))];

    machines.forEach((machine) => {
      const machineType = items[machine.machineType]?.name || machine.machineType;
      if (!groups[machineType]) {
        groups[machineType] = [];
      }
      groups[machineType].push(machine);
    });
    return groups;
  }, [placedMachines, ownedMachines, viewMode]);

  // Helper to determine machine state
  const getMachineState = (machine) => {
    if (!machine.currentRecipeId) return "Idle";
    
    const recipe = items[machine.currentRecipeId];
    if (!recipe || !recipe.inputs) return "Invalid Recipe";

    // Check if machine is placed and if the recipe requires placement
    const isPlaced = placedMachines.some(p => p.id === machine.id);
    if (recipe.requiresPlacement && !isPlaced) return "Needs Placement";

    // If machine is configured for resource extraction
    if (machine.resourceTarget) {
      const resourceName = items[machine.resourceTarget]?.name || "Unknown Resource";
      return `Extracting ${resourceName}`;
    }

    // For processing machines
    const outputItemName = recipe.name || 'Unknown Item';
    return `Processing ${outputItemName}`;
  };

  const getNodeNameById = (nodeId) => {
    const node = allResourceNodes.find(n => n.id === nodeId);
    return node ? node.name : nodeId; // Fallback to ID if name not found
  };

  // --- Machine Detail View Component ---
  const MachineDetailModal = ({ machine, onClose }) => {
    if (!machine) return null;

    const machineDefinition = items[machine.machineType];
    console.log("🚀 ~ MachineDetailModal ~ machineDefinition:", machineDefinition)
    const machineName = machineDefinition?.name || machine.machineType;
    const machineDescription = machineDefinition?.description || "";
    const machineLevel = machine.level || 1;

    // Filter recipes directly from the 'items' data
    // A "recipe" is an item that has an 'inputs' property AND its 'machine' property matches the current machine's type
    const availableRecipes = useMemo(() => {
      return Object.values(items).filter(item =>
        item.inputs && item.machine === machine.machineType
      );
    }, [machine.machineType]);

    // Get the currently assigned recipe's output item name
    const currentRecipeOutputName = machine.currentRecipeId && items[machine.currentRecipeId]?.name;

    const handleAssignRecipe = (recipeId) => {
      // Call GameContext function to assign recipe to this specific machine instance
      setMachineRecipe(machine.id, recipeId);
      console.log(`Assigned recipe ${recipeId} to machine ${machine.id}`);
      // Optionally keep the modal open to see the change, or close: onClose();
    };

    const handleRemoveRecipe = () => {
      // Call GameContext function to set recipe to null or empty
      setMachineRecipe(machine.id, null);
      console.log(`Cleared recipe for machine ${machine.id}`);
    };

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!machine}
        onRequestClose={onClose}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{machineName} Details</Text>
            <ScrollView style={styles.modalScrollView}>
              <Text style={styles.modalText}>**ID:** {machine.id.substring(0, 8)}...</Text>
              <Text style={styles.modalText}>**Type:** {machineName}</Text>
              <Text style={styles.modalText}>**Description:** {machineDescription}</Text>
              {machine.nodeTargetId && (
                <Text style={styles.modalText}>**Node:** {getNodeNameById(machine.nodeTargetId)}</Text>
              )}
              <Text style={styles.modalText}>**State:** {getMachineState(machine)}</Text>
              <Text style={styles.modalText}>**Level:** {machineLevel}</Text>

              {/* Recipe Assignment Section (for crafting machines, identified by having an 'inputs' and 'machine' property in items.js) */}
              {machineDefinition.type === 'machine' && ( // Ensure you have this 'type' property in items.js for machines
                <View style={styles.recipeSection}>
                  <Text style={styles.sectionTitle}>Assign Recipe</Text>
                  {machine.currentRecipeId && currentRecipeOutputName ? (
                    <View>
                      <Text style={styles.currentRecipeText}>
                        Currently: Crafting {currentRecipeOutputName}
                      </Text>
                      <TouchableOpacity style={styles.removeRecipeButton} onPress={handleRemoveRecipe}>
                        <Text style={styles.removeRecipeButtonText}>Clear Recipe</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recipeScroll}>
                      {availableRecipes.length > 0 ? (
                        availableRecipes.map(recipe => (
                          <TouchableOpacity
                            key={recipe.id}
                            style={styles.recipeButton}
                            onPress={() => handleAssignRecipe(recipe.id)}
                          >
                            <Text style={styles.recipeButtonText}>
                              Craft {recipe.name}
                            </Text>
                          </TouchableOpacity>
                        ))
                      ) : (
                        <Text style={styles.emptyRecipeText}>No recipes available for this machine type.</Text>
                      )}
                    </ScrollView>
                  )}
                </View>
              )}

              {/* Upgrade Section */}
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={() => {
                  console.log(`Upgrade triggered for ${machine.id}`);
                  // You'd call your upgrade logic here. Example: upgradeMachine(machine.id);
                  // Remember to handle costs, level caps, etc.
                }}
              >
                <Text style={styles.upgradeButtonText}>Upgrade Machine</Text>
              </TouchableOpacity>
            </ScrollView>

            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  };
  // --- END Machine Detail View Component ---

  const ViewModeSelector = () => (
    <View style={styles.viewModeContainer}>
      <TouchableOpacity 
        style={[styles.modeButton, viewMode === 'all' && styles.modeButtonActive]}
        onPress={() => setViewMode('all')}
      >
        <Text style={[styles.modeButtonText, viewMode === 'all' && { color: '#ffffff' }]}>
          All Machines
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.modeButton, viewMode === 'placed' && styles.modeButtonActive]}
        onPress={() => setViewMode('placed')}
      >
        <Text style={[styles.modeButtonText, viewMode === 'placed' && { color: '#ffffff' }]}>
          Placed Only
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.modeButton, viewMode === 'owned' && styles.modeButtonActive]}
        onPress={() => setViewMode('owned')}
      >
        <Text style={[styles.modeButtonText, viewMode === 'owned' && { color: '#ffffff' }]}>
          Unplaced Only
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Machines Overview</Text>
      <ViewModeSelector />
      
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {Object.keys(groupedMachines).length > 0 ? (
          Object.keys(groupedMachines)
            .sort()
            .map((groupName) => (
              <View key={groupName} style={styles.machineGroup}>
                <Text style={styles.groupTitle}>{groupName}s</Text>
                {groupedMachines[groupName].map((machine) => (
                  <TouchableOpacity
                    key={machine.id}
                    style={styles.machineCard}
                    onPress={() => setSelectedMachine(machine)}
                  >
                    <View style={styles.machineInfo}>
                      <Text style={styles.machineName}>
                        {items[machine.machineType]?.name || machine.machineType}
                      </Text>
                      <Text style={styles.machineStatus}>
                        {getMachineState(machine)}
                      </Text>
                      {placedMachines.some(p => p.id === machine.id) && machine.nodeId && (
                        <Text style={styles.nodeName}>
                          @ {getNodeNameById(machine.nodeId)}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))
        ) : (
          <Text style={styles.emptyStateText}>
            No machines {viewMode === 'placed' ? 'placed' : viewMode === 'owned' ? 'owned' : ''} yet.
            {viewMode === 'placed' ? ' Start placing your machines!' : 
             viewMode === 'owned' ? ' Start crafting machines!' : 
             ' Start building your factory!'}
          </Text>
        )}
      </ScrollView>

      <MachineDetailModal
        machine={selectedMachine}
        onClose={() => setSelectedMachine(null)}
      />
    </SafeAreaView>
  );
};

export default DeployedMachinesScreen;