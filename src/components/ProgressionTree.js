import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { items } from "../data/items";
import { ScrollView } from "react-native-gesture-handler";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import Colors from "../constants/Colors";

// Machine color mapping for consistent visual identity
const MACHINE_COLORS = {
  smelter: "#E57373", // Reddish
  constructor: "#64B5F6", // Light blue
  foundry: "#FFD54F", // Yellow
  refinery: "#AB47BC", // Purple
  assembler: "#26A69A", // Teal
  manufacturer: "#FF7043", // Orange
  miner: Colors.accentGreen, // Green from Colors
  oilExtractor: "#5D4037", // Brown
  // Default color for any missing machines
  default: "#90A4AE", // Grey blue
};

// Helper to build machine recipes data - memoized to avoid recalculation
const useMachineRecipes = () => {
  return useMemo(() => {
    // Get all machines
    const machineIds = Object.keys(items).filter(
      (id) => items[id].type === "machine"
    );

    // For each machine, collect all products it can create
    const machineRecipes = {};

    machineIds.forEach((machineId) => {
      const machine = items[machineId];
      const machineColor = MACHINE_COLORS[machineId] || MACHINE_COLORS.default;
      const isMiningMachine = machineId === "miner" || machineId === "oilExtractor";

      if (isMiningMachine) {
        // For mining machines, we need to use the node resources
        // Find all nodes this machine can extract from
        const nodeIds = Object.keys(items).filter(id => 
          id.endsWith('_node') && 
          (items[id].machineRequired === machineId || 
          (!items[id].machineRequired && machineId === "miner"))
        );
        
        // Create recipe objects for each node
        const recipes = nodeIds.map(nodeId => {
          const node = items[nodeId];
          const outputResourceId = nodeId.replace('_node', '');
          
          // Get input materials for this machine
          const inputs = machine.inputs
            ? Object.keys(machine.inputs).map((inputId) => ({
                id: inputId,
                name: items[inputId]?.name || inputId,
                quantity: machine.inputs[inputId],
                color: items[inputId]?.machine
                  ? MACHINE_COLORS[items[inputId].machine] ||
                    MACHINE_COLORS.default
                  : "#8BC34A", // Green for raw materials
              }))
            : [];
            
          // Get output resources from the node
          const outputs = node.output
            ? Object.keys(node.output).map((outputId) => {
                return {
                  id: outputId,
                  name: items[outputId]?.name || outputId,
                  quantity: node.output[outputId],
                  color: machineColor,
                  nodeInfo: {
                    description: node.description || "",
                    manualMineable: node.manualMineable || false,
                    processingTime: node.processingTime || 1
                  }
                };
              })
            : [];
            
          return {
            id: outputResourceId, // Use the resource ID, not the node ID
            name: items[outputResourceId]?.name || node.name.replace(' Node', ''),
            inputs,
            outputs,
            processingTime: node.processingTime || 1,
            fuelConsumption: machine.fuelConsumption || 0
          };
        });
        
        machineRecipes[machineId] = {
          id: machineId,
          name: machine.name,
          color: machineColor,
          description: machine.description || "",
          recipes: recipes
        };
      } else {
        // Standard machines - find all products that can be made by this machine
        const products = Object.keys(items).filter((id) => {
          return items[id].machine === machineId && items[id].type !== "machine";
        });

        // Create recipe objects for each product
        const recipes = products.map((productId) => {
          const product = items[productId];

          // Get input materials for this recipe
          const inputs = product.inputs
            ? Object.keys(product.inputs).map((inputId) => ({
                id: inputId,
                name: items[inputId]?.name || inputId,
                quantity: product.inputs[inputId],
                color: items[inputId]?.machine
                  ? MACHINE_COLORS[items[inputId].machine] ||
                    MACHINE_COLORS.default
                  : "#8BC34A", // Green for raw materials
              }))
            : [];

          // Get output products
          const outputs = product.output
            ? Object.keys(product.output).map((outputId) => {
                return {
                  id: outputId,
                  name:
                    outputId === productId
                      ? product.name
                      : items[outputId]?.name || outputId,
                  quantity: product.output[outputId],
                  color: machineColor
                };
              })
            : [];

          return {
            id: productId,
            name: product.name,
            inputs,
            outputs,
            processingTime: product.processingTime || 1,
            fuelConsumption: product.fuelConsumption || 0,
          };
        });

        machineRecipes[machineId] = {
          id: machineId,
          name: machine.name,
          color: machineColor,
          description: machine.description || "",
          recipes: recipes,
        };
      }
    });

    // Create an array of machine objects for the tabs
    const machineList = machineIds.map((id) => ({
      id,
      name: items[id].name,
      color: MACHINE_COLORS[id] || MACHINE_COLORS.default,
      recipeCount: machineRecipes[id].recipes.length,
    }));

    return { machineList, machineRecipes };
  }, []);
};

// Recipe card component to show a single recipe
const RecipeCard = ({ recipe, machineColor, machineName }) => {
  const isMiningMachine =
    machineName === "Miner" || machineName === "Oil Extractor";
  return (
    <Animated.View
      style={[styles.recipeCard, { borderLeftColor: machineColor }]}
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
    >
      <View style={styles.recipeHeader}>
        <Text style={styles.recipeTitle}>{recipe.name}</Text>
        <Text style={styles.recipeTime}>
          Time: {recipe.processingTime}s{" "}
          {recipe.fuelConsumption > 0
            ? `• Consumption: ${recipe.fuelConsumption}`
            : ""}
        </Text>
      </View>

      <View style={styles.recipeContent}>
        {isMiningMachine ? (
          // Special layout for miners and oil extractors
          <View style={styles.miningRecipeContent}>
            {recipe.outputs.map((output) => (
              <View key={output.id} style={styles.miningOutputItem}>
                <View style={styles.miningOutputHeader}>
                  <View
                    style={[
                      styles.itemColorIndicator,
                      { backgroundColor: output.color, width: 12, height: 12 },
                    ]}
                  />
                  <Text
                    style={[
                      styles.itemName,
                      { fontSize: 15, fontWeight: "500" },
                    ]}
                  >
                    {output.name}
                  </Text>
                  <Text style={styles.itemQuantity}>
                    × {output.quantity} per cycle
                  </Text>
                </View>

                {output.nodeInfo && (
                  <View style={styles.nodeInfoContainer}>
                    <Text style={styles.nodeInfoDescription}>
                      "{output.nodeInfo.description}"
                    </Text>
                    <View style={styles.nodeInfoDetails}>
                      <View style={styles.nodeInfoTagContainer}>
                        <Text
                          style={[
                            styles.nodeInfoTag,
                            {
                              backgroundColor: output.nodeInfo.manualMineable
                                ? Colors.accentGreen
                                : Colors.backgroundWarning,
                            },
                          ]}
                        >
                          {output.nodeInfo.manualMineable
                            ? "Manually Mineable"
                            : "Machine Required"}
                        </Text>
                        {output.nodeInfo.manualMineable && (
                          <Text style={styles.nodeInfoTagHint}>
                            Can be collected without machines
                          </Text>
                        )}
                      </View>
                      <Text style={styles.nodeInfoText}>
                        Cycle time: {output.nodeInfo.processingTime}s
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : (
          // Standard recipe layout for other machines
          <>
            {/* Inputs */}
            <View style={styles.recipeInputs}>
              {recipe.inputs.map((input) => (
                <View key={input.id} style={styles.recipeItem}>
                  <View
                    style={[
                      styles.itemColorIndicator,
                      { backgroundColor: input.color },
                    ]}
                  />
                  <Text style={styles.itemName}>{input.name}</Text>
                  <Text style={styles.itemQuantity}>× {input.quantity}</Text>
                </View>
              ))}
            </View>
            
            {/* Arrow */}
            <View style={styles.recipeArrow}>
              <Text style={styles.arrowText}>→</Text>
            </View>

            {/* Outputs */}
            <View style={styles.recipeOutputs}>
              {recipe.outputs.map((output) => (
                <View key={output.id} style={styles.recipeItem}>
                  <View
                    style={[
                      styles.itemColorIndicator,
                      { backgroundColor: output.color },
                    ]}
                  />
                  <Text style={styles.itemName}>{output.name}</Text>
                  <Text style={styles.itemQuantity}>× {output.quantity}</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </View>
    </Animated.View>
  );
};

// Machine Tab component for the tab navigation
const MachineTab = ({ machine, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.machineTab,
        {
          backgroundColor: isSelected ? machine.color : `${machine.color}33`,
          borderColor: machine.color,
        },
      ]}
      onPress={() => onPress(machine.id)}
    >
      <Text
        style={[
          styles.machineTabText,
          { color: isSelected ? Colors.textPrimary : Colors.textSecondary },
        ]}
      >
        {machine.name}
      </Text>
      {machine.recipeCount > 0 && (
        <View
          style={[
            styles.recipeCounter,
            {
              backgroundColor: isSelected ? Colors.textPrimary : machine.color,
            },
          ]}
        >
          <Text
            style={[
              styles.recipeCounterText,
              { color: isSelected ? machine.color : Colors.textPrimary },
            ]}
          >
            {machine.recipeCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// Main component with tabbed machine recipes
const ProgressionTree = () => {
  const { machineList, machineRecipes } = useMachineRecipes();
  const [selectedMachineId, setSelectedMachineId] = useState(
    machineList[0]?.id || null
  );

  // Handler for selecting a machine tab
  const handleMachineSelect = (machineId) => {
    setSelectedMachineId(machineId);
  };

  // Get the currently selected machine data
  const selectedMachine = machineRecipes[selectedMachineId];

  return (
    <View style={styles.container}>
      {/* Machine Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollContent}
        >
          {machineList.map((machine) => (
            <MachineTab
              key={machine.id}
              machine={machine}
              isSelected={selectedMachineId === machine.id}
              onPress={handleMachineSelect}
            />
          ))}
        </ScrollView>
      </View>

      {/* Machine Header */}
      {selectedMachine && (
        <View
          style={[
            styles.machineHeader,
            { backgroundColor: selectedMachine.color },
          ]}
        >
          <Text style={styles.machineTitle}>{selectedMachine.name}</Text>
          <Text style={styles.machineDescription}>
            {selectedMachine.description}
          </Text>
          
          {/* Machine Requirements */}
          {selectedMachine.recipes.length > 0 && selectedMachine.recipes[0].inputs.length > 0 && (
            <View style={styles.machineRequirements}>
              <Text style={styles.machineRequirementsTitle}>Machine Requirements:</Text>
              <View style={styles.machineRequirementsItems}>
                {selectedMachine.recipes[0].inputs.map((input) => (
                  <View key={input.id} style={styles.requiredItemChip}>
                    <View
                      style={[
                        styles.itemColorIndicator,
                        { backgroundColor: input.color },
                      ]}
                    />
                    <Text style={styles.requiredItemName}>{input.name}</Text>
                    <Text style={styles.requiredItemQuantity}>× {input.quantity}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      )}

      {/* Recipe List */}
      <ScrollView style={styles.recipesContainer}>
        {selectedMachine?.recipes.length > 0 ? (
          selectedMachine.recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              machineColor={selectedMachine.color}
              machineName={selectedMachine.name}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No recipes available for this machine.
            </Text>
          </View>
        )}

        {/* Add some padding at the bottom for better scrolling */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
};

// Extract all styles to StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  // Tab navigation styles
  tabsContainer: {
    backgroundColor: Colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 8,
  },
  tabsScrollContent: {
    paddingHorizontal: 8,
  },
  machineTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },
  machineTabText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textPrimary,
  },
  recipeCounter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.textPrimary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },
  recipeCounterText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  // Machine header styles
  machineHeader: {
    padding: 16,
  },
  machineTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  machineDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 8,
  },
  machineRequirements: {
    marginTop: 8,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 6,
    borderLeftWidth: 2,
    borderLeftColor: Colors.textWarning,
  },
  machineRequirementsTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  machineRequirementsItems: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  requiredItemChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 6,
  },
  requiredItemName: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: "500",
  },
  requiredItemQuantity: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  // Recipe styles
  recipesContainer: {
    flex: 1,
    padding: 12,
  },
  recipeCard: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
    borderLeftWidth: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  recipeHeader: {
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: 8,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  recipeTime: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  recipeContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  // Special layout for miners and oil extractors
  miningRecipeContent: {
    flex: 1,
    borderLeftWidth: 2,
    borderLeftColor: Colors.accentGreen,
  },
  miningOutputItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  miningOutputHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  nodeInfoContainer: {
    backgroundColor: Colors.backgroundPanel,
    borderRadius: 6,
    padding: 10,
    marginLeft: 10,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  nodeInfoDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
    fontStyle: "italic",
    lineHeight: 18,
  },
  nodeInfoDetails: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  nodeInfoTagContainer: {
    marginRight: 8,
    marginBottom: 6,
  },
  nodeInfoTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    fontSize: 11,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 2,
    overflow: "hidden",
  },
  nodeInfoTagHint: {
    fontSize: 10,
    color: Colors.textDim,
    paddingLeft: 4,
  },
  nodeInfoText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginRight: 8,
    marginBottom: 4,
  },
  recipeInputs: {
    flex: 1,
    paddingRight: 6,
  },
  recipeArrow: {
    paddingHorizontal: 12,
  },
  arrowText: {
    fontSize: 24,
    color: Colors.textSecondary,
  },
  recipeOutputs: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: Colors.border,
    paddingLeft: 12,
  },
  recipeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  itemColorIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  itemName: {
    fontSize: 13,
    color: Colors.textPrimary,
    flex: 1,
  },
  itemQuantity: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  itemDescription: {
    paddingLeft: 16,
    paddingRight: 4,
    marginBottom: 8,
    paddingTop: 2,
    paddingBottom: 2,
    borderLeftWidth: 2,
    borderLeftColor: Colors.border,
  },
  descriptionText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontStyle: "italic",
    lineHeight: 14,
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});

export default ProgressionTree;
