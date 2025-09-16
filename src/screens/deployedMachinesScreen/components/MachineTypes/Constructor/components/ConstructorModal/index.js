import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import styles from "../../../Smelter/components/SmelterModal/styles";
import { items } from "../../../../../../../data/items";
import { useGame } from "../../../../../../../contexts/GameContext";
import useCrafting from "../../../../../../../hooks/useCrafting";

// Component imports
import CraftingProgress from "../CraftingProgress";
import ResourceList from "../ResourceList";
import CraftButton from "../CraftButton";
import MiniToast from "../MiniToast";
import QuantityStepper from "../QuantityStepper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "../../../../../../../components";

// Helpers to normalize inputs/outputs to arrays of {item, amount}
function normalizeInputs(inputs) {
  if (!inputs) return [];
  if (Array.isArray(inputs)) return inputs;
  if (typeof inputs === "object") {
    return Object.entries(inputs).map(([item, amount]) => ({ item, amount }));
  }
  return [];
}
function normalizeOutputs(outputs) {
  if (!outputs) return [];
  if (Array.isArray(outputs)) return outputs;
  if (typeof outputs === "object") {
    return Object.entries(outputs).map(([item, amount]) => ({ item, amount }));
  }
  return [];
}

const ConstructorModal = ({
  machine,
  recipe,
  visible,
  onClose,
  onSelectRecipe,
}) => {
  const {
    inventory,
    ownedMachines: contextOwnedMachines,
    addResource,
    removeResources,
    canAfford,
    addToCraftingQueue,
    craftingQueue,
  } = useGame();

  const ownedMachines = useMemo(
    () => (contextOwnedMachines || []).map((m) => m.type),
    [contextOwnedMachines]
  );

  const { craftItem } = useCrafting(
    inventory,
    ownedMachines,
    addResource,
    removeResources,
    canAfford
  );

  // Get constructor recipes
  const availableRecipes = useMemo(() => {
    return Object.values(items)
      .filter((item) => item.machine === "constructor")
      .map((item) => ({
        id: item.id,
        name: item.name,
        machine: item.machine,
        inputs: normalizeInputs(item.inputs),
        outputs: normalizeOutputs(item.output || item.outputs),
        processingTime: item.processingTime,
      }));
  }, []);

  const [selectedRecipeId, setSelectedRecipeId] = useState(
    recipe?.id || machine?.currentRecipeId || availableRecipes[0]?.id || null
  );

  const selectedRecipe = useMemo(() => {
    const found = availableRecipes.find((r) => r.id === selectedRecipeId);
    if (!found) return null;
    return {
      ...found,
      machine: found.machine,
      inputs: normalizeInputs(found.inputs),
      outputs: normalizeOutputs(found.outputs),
    };
  }, [availableRecipes, selectedRecipeId]);

  const [productAmount, setProductAmount] = useState("1");

  // Mini toast state
  const [miniToastVisible, setMiniToastVisible] = useState(false);
  const [miniToastMsg, setMiniToastMsg] = useState("");
  const miniToastTimeout = useRef(null);
  const showMiniToast = (msg) => {
    setMiniToastMsg(msg);
    setMiniToastVisible(true);
    if (miniToastTimeout.current) clearTimeout(miniToastTimeout.current);
    miniToastTimeout.current = setTimeout(
      () => setMiniToastVisible(false),
      700
    );
  };

  // UI state
  const [activeCraftButton, setActiveCraftButton] = useState("1");

  // Check for active crafting processes for this machine
  const machineProcesses = useMemo(() => {
    return craftingQueue.filter(
      (proc) => proc.machineId === machine.id && proc.status === "pending"
    );
  }, [craftingQueue, machine.id]);

  const isProcessing = machineProcesses.length > 0;

  // Crafting logic using global craftingQueue
  const startCrafting = async (amountToCraft, isMax = false) => {
    if (!selectedRecipe) return;
    const totalAmount = Number(amountToCraft) || 1;

    // Check if we can afford the inputs
    const canAffordAll = selectedRecipe.inputs.every((input) => {
      const available = inventory[input.item]?.currentAmount || 0;
      return available >= input.amount * totalAmount;
    });

    if (!canAffordAll) {
      showMiniToast("Insufficient resources!");
      return;
    }

    // Deduct resources immediately
    selectedRecipe.inputs.forEach((input) => {
      removeResources(input.item, input.amount * totalAmount);
    });

    // Add to global crafting queue
    for (let i = 0; i < totalAmount; i++) {
      addToCraftingQueue({
        machineId: machine.id,
        recipeId: selectedRecipe.id,
        itemName: selectedRecipe.name,
        outputs: selectedRecipe.outputs,
        processingTime: selectedRecipe.processingTime,
      });
    }

    showMiniToast(`Added ${totalAmount}x ${selectedRecipe.name} to queue`);
    
    // Reset UI state
    if (activeCraftButton === "max") {
      setActiveCraftButton("1");
      setProductAmount("1");
    }

    // Close modal automatically after starting crafting
    onClose();
  };

  const calculateMaxCraftable = () => {
    if (!selectedRecipe) return 0;
    let maxCraftable = Infinity;
    selectedRecipe.inputs.forEach((input) => {
      const inv = inventory[input.item]?.currentAmount || 0;
      const possible = input.amount > 0 ? Math.floor(inv / input.amount) : 0;
      if (possible < maxCraftable) maxCraftable = possible;
    });
    return maxCraftable === Infinity ? 0 : maxCraftable;
  };

  const maxCraftable = calculateMaxCraftable();
  const amount = Math.max(1, parseInt(productAmount) || 1);
  const canCraft = amount > 0 && amount <= maxCraftable;
  const processingTime = Number(selectedRecipe?.processingTime) || 1;

  useEffect(() => {
    setActiveCraftButton("1");
    setProductAmount("1");
  }, [selectedRecipeId]);

  const handleAssignRecipe = () => {
    if (selectedRecipeId) {
      onSelectRecipe(selectedRecipeId);
      onClose();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={modalStyles.safeArea}>
        <View style={modalStyles.modalContainer}>
          {/* Industrial Header */}
          <View style={modalStyles.header}>
            <Text style={modalStyles.title}>Constructor Interface</Text>
            <TouchableOpacity style={modalStyles.closeButton} onPress={onClose}>
              <MaterialCommunityIcons name="close" size={20} color="#e8f4fd" />
            </TouchableOpacity>
          </View>

          {/* Split Panel Layout */}
          <View style={modalStyles.contentContainer}>
            
            {/* LEFT PANEL - Inputs & Recipe Selection */}
            <ScrollView style={modalStyles.leftPanel} showsVerticalScrollIndicator={false}>
              
              {/* Recipe Selection Panel */}
              <View style={modalStyles.industrialPanel}>
                <View style={modalStyles.panelHeader}>
                  <Text style={modalStyles.panelTitle}>Available Recipes</Text>
                </View>
                <View style={modalStyles.panelContent}>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={modalStyles.recipeScrollContainer}
                  >
                    {availableRecipes.map((recipeItem) => (
                      <TouchableOpacity
                        key={recipeItem.id}
                        style={[
                          modalStyles.recipeButton,
                          selectedRecipeId === recipeItem.id &&
                            modalStyles.selectedRecipeButton,
                        ]}
                        onPress={() => setSelectedRecipeId(recipeItem.id)}
                      >
                        <Text
                          style={[
                            modalStyles.recipeButtonText,
                            selectedRecipeId === recipeItem.id &&
                              modalStyles.selectedRecipeButtonText,
                          ]}
                        >
                          {recipeItem.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>

              {/* Required Resources Panel */}
              {selectedRecipe && (
                <View style={modalStyles.industrialPanel}>
                  <View style={modalStyles.panelHeader}>
                    <Text style={modalStyles.panelTitle}>Required Resources</Text>
                  </View>
                  <View style={modalStyles.panelContent}>
                    {selectedRecipe.inputs.map((input) => {
                      const requiredAmount = input.amount * amount;
                      const currentAmount = inventory[input.item]?.currentAmount || 0;
                      const hasEnough = currentAmount >= requiredAmount;
                      const itemName = items[input.item]?.name || input.item;
                      
                      return (
                        <View key={input.item} style={modalStyles.resourceContainer}>
                          <View style={modalStyles.resourceRow}>
                            <View style={[
                              modalStyles.resourceIcon,
                              { backgroundColor: hasEnough ? "#4a7fa7" : "#a74a4a" }
                            ]}>
                              <MaterialCommunityIcons
                                name="cube-outline"
                                size={16}
                                color="#e8f4fd"
                              />
                            </View>
                            <Text style={modalStyles.resourceText}>
                              {itemName}
                            </Text>
                            <Text style={[
                              modalStyles.resourceAmount,
                              { color: hasEnough ? "#e8f4fd" : "#ff6b6b" }
                            ]}>
                              {requiredAmount}/{currentAmount}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Quantity Control Panel */}
              {selectedRecipe && (
                <View style={modalStyles.industrialPanel}>
                  <View style={modalStyles.panelHeader}>
                    <Text style={modalStyles.panelTitle}>Production Control</Text>
                  </View>
                  <View style={modalStyles.panelContent}>
                    <QuantityStepper
                      amount={productAmount}
                      setAmount={setProductAmount}
                      maxAmount={maxCraftable}
                    />
                    
                    <View style={{ flexDirection: "row", marginTop: 12 }}>
                      <CraftButton
                        isActive={activeCraftButton === "1"}
                        label="1x"
                        onPress={() => {
                          setProductAmount("1");
                          setActiveCraftButton("1");
                        }}
                        disabled={!!isProcessing}
                      />
                      <CraftButton
                        isActive={activeCraftButton === "5"}
                        label="5x"
                        onPress={() => {
                          setProductAmount("5");
                          setActiveCraftButton("5");
                        }}
                        disabled={!!isProcessing || maxCraftable < 5}
                      />
                      <CraftButton
                        isActive={activeCraftButton === "max"}
                        label={`Max (${maxCraftable})`}
                        onPress={() => {
                          setProductAmount(String(maxCraftable));
                          setActiveCraftButton("max");
                        }}
                        disabled={!!isProcessing || maxCraftable <= 0}
                      />
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* RIGHT PANEL - Machine View & Output */}
            <ScrollView style={modalStyles.rightPanel} showsVerticalScrollIndicator={false}>
              
              {/* Machine Display */}
              <View style={modalStyles.machineDisplay}>
                <View style={modalStyles.machineIcon}>
                  <MaterialCommunityIcons
                    name="factory"
                    size={40}
                    color="#6db4f0"
                  />
                </View>
                <Text style={modalStyles.panelTitle}>Constructor</Text>
                
                <View style={modalStyles.machineStatus}>
                  <View style={[
                    modalStyles.statusIndicator,
                    { backgroundColor: isProcessing ? "#4CAF50" : "#6db4f0" }
                  ]} />
                  <Text style={modalStyles.statusText}>
                    {isProcessing ? "Processing..." : "Ready"}
                  </Text>
                </View>
              </View>

              {/* Production Information */}
              {selectedRecipe && (
                <View style={modalStyles.industrialPanel}>
                  <View style={modalStyles.panelHeader}>
                    <Text style={modalStyles.panelTitle}>Production Info</Text>
                  </View>
                  <View style={modalStyles.panelContent}>
                    <View style={modalStyles.productionInfo}>
                      <View style={modalStyles.productionRow}>
                        <Text style={modalStyles.productionLabel}>Recipe:</Text>
                        <Text style={modalStyles.productionValue}>
                          {selectedRecipe.name}
                        </Text>
                      </View>
                      <View style={modalStyles.productionRow}>
                        <Text style={modalStyles.productionLabel}>Processing Time:</Text>
                        <Text style={modalStyles.productionValue}>
                          {processingTime}s per item
                        </Text>
                      </View>
                      <View style={modalStyles.productionRow}>
                        <Text style={modalStyles.productionLabel}>Max Craftable:</Text>
                        <Text style={modalStyles.productionValue}>
                          {maxCraftable} items
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}

              {/* Expected Output */}
              {selectedRecipe && (
                <View style={modalStyles.industrialPanel}>
                  <View style={modalStyles.panelHeader}>
                    <Text style={modalStyles.panelTitle}>Expected Output</Text>
                  </View>
                  <View style={modalStyles.panelContent}>
                    {selectedRecipe.outputs.map((output) => {
                      const outputAmount = output.amount * amount;
                      const itemName = items[output.item]?.name || output.item;
                      const currentInventory = inventory[output.item]?.currentAmount || 0;
                      
                      return (
                        <View key={output.item} style={modalStyles.resourceContainer}>
                          <View style={modalStyles.resourceRow}>
                            <View style={[
                              modalStyles.resourceIcon,
                              { backgroundColor: "#4a7fa7" }
                            ]}>
                              <MaterialCommunityIcons
                                name="package-variant"
                                size={16}
                                color="#e8f4fd"
                              />
                            </View>
                            <Text style={modalStyles.resourceText}>
                              {itemName}
                            </Text>
                            <Text style={modalStyles.resourceAmount}>
                              +{outputAmount} (inv: {currentInventory})
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Progress Display */}
              {isProcessing && (
                <View style={modalStyles.industrialPanel}>
                  <View style={modalStyles.panelHeader}>
                    <Text style={modalStyles.panelTitle}>Processing Status</Text>
                  </View>
                  <View style={modalStyles.panelContent}>
                    <CraftingProgress
                      isProcessing={isProcessing}
                      machineProcesses={machineProcesses}
                      maxCraftable={maxCraftable}
                    />
                  </View>
                </View>
              )}

              {/* Control Section */}
              {selectedRecipe && (
                <View style={modalStyles.controlSection}>
                  <TouchableOpacity
                    style={[
                      modalStyles.craftButton,
                      (!canCraft || !!isProcessing) && modalStyles.craftButtonDisabled,
                    ]}
                    onPress={() => startCrafting(amount)}
                    disabled={!canCraft || !!isProcessing}
                    activeOpacity={0.85}
                  >
                    <MaterialCommunityIcons
                      name="play-circle"
                      size={20}
                      color={canCraft && !isProcessing ? "#e8f4fd" : "#6b7885"}
                    />
                    <Text
                      style={[
                        modalStyles.craftButtonText,
                        (!canCraft || !!isProcessing) && modalStyles.craftButtonTextDisabled,
                      ]}
                    >
                      {isProcessing ? "Processing..." : `Start Production (${amount}x)`}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
          
          <MiniToast visible={miniToastVisible} message={miniToastMsg} />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  // Main container styles - Satisfactory inspired
  safeArea: {
    flex: 1,
    backgroundColor: "rgba(15, 25, 35, 0.95)", // Industrial dark overlay
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#2a3441", // Industrial gray-blue background
    marginTop: 40,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderWidth: 2,
    borderColor: "#4a5866", // Metallic border
    borderTopWidth: 3,
    borderTopColor: "#6db4f0", // Blue accent border
  },
  
  // Header with industrial styling
  header: {
    backgroundColor: "#1f2935", // Darker header background
    borderBottomWidth: 2,
    borderBottomColor: "#4a5866",
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#e8f4fd", // Light blue-white text
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  closeButton: {
    backgroundColor: "#3a4856",
    borderWidth: 1,
    borderColor: "#4a5866",
    borderRadius: 4,
    padding: 10,
  },
  
  // Main content layout - split screen like Satisfactory
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    padding: 0,
  },
  
  // Left panel for inputs and recipe selection
  leftPanel: {
    flex: 1,
    backgroundColor: "#2a3441",
    borderRightWidth: 2,
    borderRightColor: "#4a5866",
    padding: 16,
  },
  
  // Right panel for machine view and outputs
  rightPanel: {
    flex: 1,
    backgroundColor: "#323d4a",
    padding: 16,
  },
  
  // Industrial panels
  industrialPanel: {
    backgroundColor: "#1f2935",
    borderWidth: 1,
    borderColor: "#4a5866",
    borderRadius: 4,
    marginBottom: 12,
    overflow: "hidden",
  },
  
  panelHeader: {
    backgroundColor: "#3a4856",
    borderBottomWidth: 1,
    borderBottomColor: "#4a5866",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  
  panelTitle: {
    color: "#e8f4fd",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  
  panelContent: {
    padding: 12,
  },
  
  // Recipe selection
  recipeScrollContainer: {
    paddingVertical: 8,
  },
  
  recipeButton: {
    backgroundColor: "#3a4856",
    borderWidth: 1,
    borderColor: "#4a5866",
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
    minWidth: 120,
  },
  
  selectedRecipeButton: {
    backgroundColor: "#4a7fa7", // Industrial blue
    borderColor: "#6db4f0",
    borderWidth: 2,
  },
  
  recipeButtonText: {
    color: "#b8c7d1",
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
  },
  
  selectedRecipeButtonText: {
    color: "#e8f4fd",
    fontWeight: "700",
  },
  
  // Machine display area
  machineDisplay: {
    backgroundColor: "#1f2935",
    borderWidth: 2,
    borderColor: "#4a5866",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
    minHeight: 200,
  },
  
  machineIcon: {
    width: 80,
    height: 80,
    backgroundColor: "#3a4856",
    borderWidth: 2,
    borderColor: "#6db4f0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  
  machineStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  
  statusText: {
    color: "#b8c7d1",
    fontSize: 12,
    fontWeight: "500",
  },
  
  // Production info
  productionInfo: {
    backgroundColor: "#1f2935",
    borderWidth: 1,
    borderColor: "#4a5866",
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
  },
  
  productionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  
  productionLabel: {
    color: "#b8c7d1",
    fontSize: 12,
    flex: 1,
  },
  
  productionValue: {
    color: "#e8f4fd",
    fontSize: 12,
    fontWeight: "600",
  },
  
  // Resource display
  resourceContainer: {
    backgroundColor: "#2a3441",
    borderWidth: 1,
    borderColor: "#4a5866",
    borderRadius: 4,
    padding: 8,
    marginVertical: 4,
  },
  
  resourceRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  
  resourceIcon: {
    width: 24,
    height: 24,
    backgroundColor: "#3a4856",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  
  resourceText: {
    flex: 1,
    color: "#b8c7d1",
    fontSize: 12,
  },
  
  resourceAmount: {
    color: "#e8f4fd",
    fontSize: 12,
    fontWeight: "600",
  },
  
  // Control buttons
  controlSection: {
    backgroundColor: "#1f2935",
    borderWidth: 1,
    borderColor: "#4a5866",
    borderRadius: 4,
    padding: 12,
    marginTop: 16,
  },
  
  craftButton: {
    backgroundColor: "#4a7fa7",
    borderWidth: 1,
    borderColor: "#6db4f0",
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "center",
  },
  
  craftButtonDisabled: {
    backgroundColor: "#3a4856",
    borderColor: "#4a5866",
  },
  
  craftButtonText: {
    color: "#e8f4fd",
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 0.5,
    marginLeft: 8,
  },
  
  craftButtonTextDisabled: {
    color: "#6b7885",
  },
});

export default ConstructorModal;
