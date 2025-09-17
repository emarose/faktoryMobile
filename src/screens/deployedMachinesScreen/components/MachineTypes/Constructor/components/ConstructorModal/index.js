import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
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
  const [activeTab, setActiveTab] = useState("recipe");

  // Check for active crafting processes for this machine - memoized
  const machineProcesses = useMemo(() => {
    return craftingQueue.filter(
      (proc) => proc.machineId === machine.id && proc.status === "pending"
    );
  }, [craftingQueue, machine.id]);

  const isProcessing = useMemo(() => machineProcesses.length > 0, [machineProcesses]);

  // Crafting logic using global craftingQueue
  const startCrafting = useCallback(async (amountToCraft, isMax = false) => {
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
    const deductionData = {};
    selectedRecipe.inputs.forEach((input) => {
      deductionData[input.item] = input.amount * totalAmount;
    });
    
    const success = removeResources(deductionData);
    if (!success) {
      showMiniToast("Failed to deduct resources!");
      return;
    }

    // Add to global crafting queue
    addToCraftingQueue({
      machineId: machine.id,
      recipeId: selectedRecipe.id,
      amount: totalAmount,
      processingTime: selectedRecipe.processingTime,
      itemName: selectedRecipe.name,
    });

    showMiniToast(`Added ${totalAmount}x ${selectedRecipe.name} to queue`);
    
    // Reset UI state
    if (activeCraftButton === "max") {
      setActiveCraftButton("1");
      setProductAmount("1");
    }

    // Close modal automatically after starting crafting
    onClose();
  }, [selectedRecipe, inventory, removeResources, addToCraftingQueue, machine.id, activeCraftButton, setActiveCraftButton, setProductAmount, onClose, showMiniToast]);

  // Memoize expensive calculations
  const maxCraftable = useMemo(() => {
    if (!selectedRecipe) return 0;
    let maxCraftable = Infinity;
    selectedRecipe.inputs.forEach((input) => {
      const inv = inventory[input.item]?.currentAmount || 0;
      const possible = input.amount > 0 ? Math.floor(inv / input.amount) : 0;
      if (possible < maxCraftable) maxCraftable = possible;
    });
    return maxCraftable === Infinity ? 0 : maxCraftable;
  }, [selectedRecipe, inventory]);

  const amount = useMemo(() => Math.max(1, parseInt(productAmount) || 1), [productAmount]);
  const canCraft = useMemo(() => amount > 0 && amount <= maxCraftable, [amount, maxCraftable]);
  const processingTime = useMemo(() => Number(selectedRecipe?.processingTime) || 1, [selectedRecipe]);

  useEffect(() => {
    setActiveCraftButton("1");
    setProductAmount("1");
  }, [selectedRecipeId]);

  const handleAssignRecipe = useCallback(() => {
    if (selectedRecipeId) {
      onSelectRecipe(selectedRecipeId);
      onClose();
    }
  }, [selectedRecipeId, onSelectRecipe, onClose]);

  // Optimize tab handlers
  const handleRecipeTab = useCallback(() => setActiveTab("recipe"), []);
  const handleProductionTab = useCallback(() => setActiveTab("production"), []);

  // Optimize quantity button handlers
  const handleSet1 = useCallback(() => {
    setProductAmount("1");
    setActiveCraftButton("1");
  }, []);

  const handleSet5 = useCallback(() => {
    setProductAmount("5");
    setActiveCraftButton("5");
  }, []);

  const handleSetMax = useCallback(() => {
    setProductAmount(String(maxCraftable));
    setActiveCraftButton("max");
  }, [maxCraftable]);

  // Optimize start crafting handler
  const handleStartCrafting = useCallback(() => {
    startCrafting(amount);
  }, [startCrafting, amount]);

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

          {/* Tab Navigation */}
          <View style={modalStyles.tabContainer}>
            <TouchableOpacity
              style={[
                modalStyles.tabButton,
                activeTab === "recipe" && modalStyles.activeTabButton
              ]}
              onPress={handleRecipeTab}
            >
              <MaterialCommunityIcons
                name="book-open-variant"
                size={18}
                color={activeTab === "recipe" ? "#e8f4fd" : "#b8c7d1"}
              />
              <Text style={[
                modalStyles.tabButtonText,
                activeTab === "recipe" && modalStyles.activeTabButtonText
              ]}>
                Recipe
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                modalStyles.tabButton,
                activeTab === "production" && modalStyles.activeTabButton
              ]}
              onPress={handleProductionTab}
            >
              <MaterialCommunityIcons
                name="factory"
                size={18}
                color={activeTab === "production" ? "#e8f4fd" : "#b8c7d1"}
              />
              <Text style={[
                modalStyles.tabButtonText,
                activeTab === "production" && modalStyles.activeTabButtonText
              ]}>
                Production
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          <View style={modalStyles.contentContainer}>
            {activeTab === "recipe" ? (
              // RECIPE TAB - Vertical scroll of recipes
              <ScrollView style={modalStyles.recipeTab} showsVerticalScrollIndicator={false}>
                <View style={modalStyles.industrialPanel}>
                  <View style={modalStyles.panelHeader}>
                    <Text style={modalStyles.panelTitle}>Available Recipes</Text>
                  </View>
                  <View style={modalStyles.panelContent}>
                    {availableRecipes.map((recipeItem) => (
                      <TouchableOpacity
                        key={recipeItem.id}
                        style={[
                          modalStyles.recipeCard,
                          selectedRecipeId === recipeItem.id && modalStyles.selectedRecipeCard,
                        ]}
                        onPress={() => setSelectedRecipeId(recipeItem.id)}
                      >
                        <View style={modalStyles.recipeCardHeader}>
                          <View style={modalStyles.recipeIconContainer}>
                            <MaterialCommunityIcons
                              name="cog"
                              size={24}
                              color={selectedRecipeId === recipeItem.id ? "#e8f4fd" : "#b8c7d1"}
                            />
                          </View>
                          <View style={modalStyles.recipeInfo}>
                            <Text style={[
                              modalStyles.recipeCardTitle,
                              selectedRecipeId === recipeItem.id && modalStyles.selectedRecipeCardTitle
                            ]}>
                              {recipeItem.name}
                            </Text>
                            <Text style={modalStyles.recipeCardTime}>
                              {recipeItem.processingTime}s processing time
                            </Text>
                          </View>
                          {selectedRecipeId === recipeItem.id && (
                            <MaterialCommunityIcons
                              name="check-circle"
                              size={20}
                              color="#4CAF50"
                            />
                          )}
                        </View>
                        
                        {/* Recipe Details */}
                        <View style={modalStyles.recipeDetails}>
                          <View style={modalStyles.recipeInputsOutputs}>
                            <View style={modalStyles.recipeInputs}>
                              <Text style={modalStyles.recipeDetailLabel}>Inputs:</Text>
                              {recipeItem.inputs.map((input, idx) => (
                                <Text key={idx} style={modalStyles.recipeDetailText}>
                                  {input.amount}x {items[input.item]?.name || input.item}
                                </Text>
                              ))}
                            </View>
                            <MaterialCommunityIcons
                              name="arrow-right"
                              size={16}
                              color="#6db4f0"
                              style={modalStyles.arrowIcon}
                            />
                            <View style={modalStyles.recipeOutputs}>
                              <Text style={modalStyles.recipeDetailLabel}>Outputs:</Text>
                              {recipeItem.outputs.map((output, idx) => (
                                <Text key={idx} style={modalStyles.recipeDetailText}>
                                  {output.amount}x {items[output.item]?.name || output.item}
                                </Text>
                              ))}
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </ScrollView>
            ) : (
              // PRODUCTION TAB - Single scroll with Satisfactory-like layout
              <ScrollView style={modalStyles.productionTab} showsVerticalScrollIndicator={false}>
                {/* Main Production Area - Similar to Satisfactory interface */}
                <View style={modalStyles.productionMainArea}>
                  
                  {/* Input/Output Flow Section */}
                  {selectedRecipe && (
                    <View style={modalStyles.flowSection}>
                      {/* Input Side */}
                      <View style={modalStyles.inputSection}>
                        <View style={modalStyles.flowLabel}>
                          <Text style={modalStyles.flowLabelText}>INPUT</Text>
                        </View>
                        <View style={modalStyles.inputSlots}>
                          {selectedRecipe.inputs.map((input, index) => {
                            const requiredAmount = input.amount * amount;
                            const currentAmount = inventory[input.item]?.currentAmount || 0;
                            const hasEnough = currentAmount >= requiredAmount;
                            const itemName = items[input.item]?.name || input.item;
                            
                            return (
                              <View key={input.item} style={modalStyles.resourceSlot}>
                                <View style={[
                                  modalStyles.slotIcon,
                                  { backgroundColor: hasEnough ? "#4a7fa7" : "#a74a4a" }
                                ]}>
                                  <MaterialCommunityIcons
                                    name="cube-outline"
                                    size={20}
                                    color="#e8f4fd"
                                  />
                                </View>
                                <Text style={modalStyles.slotAmount}>{requiredAmount}</Text>
                                <Text style={modalStyles.slotName}>{itemName}</Text>
                                <Text style={[
                                  modalStyles.slotInventory,
                                  { color: hasEnough ? "#4CAF50" : "#ff6b6b" }
                                ]}>
                                  {currentAmount}/{requiredAmount}
                                </Text>
                              </View>
                            );
                          })}
                        </View>
                      </View>

                      {/* Arrow */}
                      <View style={modalStyles.arrowSection}>
                        <MaterialCommunityIcons
                          name="arrow-right"
                          size={32}
                          color="#6db4f0"
                        />
                      </View>

                      {/* Output Side */}
                      <View style={modalStyles.outputSection}>
                        <View style={modalStyles.flowLabel}>
                          <Text style={modalStyles.flowLabelText}>OUTPUT</Text>
                        </View>
                        <View style={modalStyles.outputSlots}>
                          {selectedRecipe.outputs.map((output, index) => {
                            const outputAmount = output.amount * amount;
                            const itemName = items[output.item]?.name || output.item;
                            const currentInventory = inventory[output.item]?.currentAmount || 0;
                            
                            return (
                              <View key={output.item} style={modalStyles.resourceSlot}>
                                <View style={[
                                  modalStyles.slotIcon,
                                  { backgroundColor: "#4a7fa7" }
                                ]}>
                                  <MaterialCommunityIcons
                                    name="package-variant"
                                    size={20}
                                    color="#e8f4fd"
                                  />
                                </View>
                                <Text style={modalStyles.slotAmount}>{outputAmount}</Text>
                                <Text style={modalStyles.slotName}>{itemName}</Text>
                                <Text style={modalStyles.slotInventory}>
                                  Current: {currentInventory}
                                </Text>
                              </View>
                            );
                          })}
                        </View>
                      </View>
                    </View>
                  )}

                  {/* Machine Status & Recipe Info */}
                  {selectedRecipe && (
                    <View style={modalStyles.machineStatusSection}>
                      <View style={modalStyles.machineInfoCard}>
                        <View style={modalStyles.machineHeader}>
                          <View style={modalStyles.machineIcon}>
                            <MaterialCommunityIcons
                              name="factory"
                              size={28}
                              color="#6db4f0"
                            />
                          </View>
                          <View style={modalStyles.machineInfo}>
                            <Text style={modalStyles.machineTitle}>Constructor</Text>
                            <Text style={modalStyles.recipeTitle}>{selectedRecipe.name}</Text>
                          </View>
                          <View style={modalStyles.machineStatus}>
                            <View style={[
                              modalStyles.statusIndicator,
                              { backgroundColor: isProcessing ? "#4CAF50" : "#6db4f0" }
                            ]} />
                            <Text style={modalStyles.statusText}>
                              {isProcessing ? "Processing" : "Ready"}
                            </Text>
                          </View>
                        </View>
                        
                        <View style={modalStyles.productionStats}>
                          <View style={modalStyles.statItem}>
                            <Text style={modalStyles.statLabel}>Processing Time</Text>
                            <Text style={modalStyles.statValue}>{processingTime}s</Text>
                          </View>
                          <View style={modalStyles.statItem}>
                            <Text style={modalStyles.statLabel}>Max Craftable</Text>
                            <Text style={modalStyles.statValue}>{maxCraftable}</Text>
                          </View>
                          <View style={modalStyles.statItem}>
                            <Text style={modalStyles.statLabel}>Total Time</Text>
                            <Text style={modalStyles.statValue}>{processingTime * amount}s</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  )}

                  {/* Progress Display */}
                  {isProcessing && (
                    <View style={modalStyles.progressSection}>
                      <CraftingProgress
                        isProcessing={isProcessing}
                        machineProcesses={machineProcesses}
                        maxCraftable={maxCraftable}
                      />
                    </View>
                  )}

                  {/* Production Controls */}
                  {selectedRecipe && (
                    <View style={modalStyles.controlsSection}>
                      <View style={modalStyles.quantityControls}>
                        <Text style={modalStyles.controlLabel}>Production Quantity</Text>
                        <QuantityStepper
                          amount={productAmount}
                          setAmount={setProductAmount}
                          maxAmount={maxCraftable}
                        />
                        
                        <View style={modalStyles.quickButtons}>
                          <CraftButton
                            isActive={activeCraftButton === "1"}
                            label="1x"
                            onPress={handleSet1}
                            disabled={!!isProcessing}
                          />
                          <CraftButton
                            isActive={activeCraftButton === "5"}
                            label="5x"
                            onPress={handleSet5}
                            disabled={!!isProcessing || maxCraftable < 5}
                          />
                          <CraftButton
                            isActive={activeCraftButton === "max"}
                            label={`Max (${maxCraftable})`}
                            onPress={handleSetMax}
                            disabled={!!isProcessing || maxCraftable <= 0}
                          />
                        </View>
                      </View>

                      {/* Start Production Button */}
                      <TouchableOpacity
                        style={[
                          modalStyles.startProductionButton,
                          (!canCraft || !!isProcessing) && modalStyles.startProductionButtonDisabled,
                        ]}
                        onPress={handleStartCrafting}
                        disabled={!canCraft || !!isProcessing}
                        activeOpacity={0.85}
                      >
                        <MaterialCommunityIcons
                          name={isProcessing ? "cog" : "play-circle"}
                          size={24}
                          color={canCraft && !isProcessing ? "#e8f4fd" : "#6b7885"}
                        />
                        <Text
                          style={[
                            modalStyles.startProductionButtonText,
                            (!canCraft || !!isProcessing) && modalStyles.startProductionButtonTextDisabled,
                          ]}
                        >
                          {isProcessing ? "Processing..." : `Start Production (${amount}x)`}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </ScrollView>
            )}
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

  // Tab Navigation
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#1f2935",
    borderBottomWidth: 2,
    borderBottomColor: "#4a5866",
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#2a3441",
    borderRightWidth: 1,
    borderRightColor: "#4a5866",
  },
  activeTabButton: {
    backgroundColor: "#4a7fa7",
    borderBottomWidth: 3,
    borderBottomColor: "#6db4f0",
  },
  tabButtonText: {
    color: "#b8c7d1",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  activeTabButtonText: {
    color: "#e8f4fd",
    fontWeight: "700",
  },
  
  // Main content layout - now supports tabs
  contentContainer: {
    flex: 1,
  },

  // Recipe Tab Styles
  recipeTab: {
    flex: 1,
    padding: 16,
  },
  recipeCard: {
    backgroundColor: "#1f2935",
    borderWidth: 1,
    borderColor: "#4a5866",
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
  },
  selectedRecipeCard: {
    borderColor: "#6db4f0",
    borderWidth: 2,
    backgroundColor: "#2a3441",
  },
  recipeCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  recipeIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#3a4856",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeCardTitle: {
    color: "#b8c7d1",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  selectedRecipeCardTitle: {
    color: "#e8f4fd",
    fontWeight: "700",
  },
  recipeCardTime: {
    color: "#6b7885",
    fontSize: 12,
  },
  recipeDetails: {
    marginTop: 8,
  },
  recipeInputsOutputs: {
    flexDirection: "row",
    alignItems: "center",
  },
  recipeInputs: {
    flex: 1,
  },
  recipeOutputs: {
    flex: 1,
  },
  arrowIcon: {
    marginHorizontal: 12,
  },
  recipeDetailLabel: {
    color: "#6db4f0",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  recipeDetailText: {
    color: "#b8c7d1",
    fontSize: 11,
    marginBottom: 2,
  },

  // Production Tab Styles - Satisfactory-like layout
  productionTab: {
    flex: 1,
    backgroundColor: "#2a3441",
  },
  productionMainArea: {
    padding: 16,
  },

  // Input/Output Flow Section
  flowSection: {
    backgroundColor: "#1f2935",
    borderWidth: 2,
    borderColor: "#4a5866",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  inputSection: {
    flex: 1,
    alignItems: "center",
  },
  outputSection: {
    flex: 1,
    alignItems: "center",
  },
  arrowSection: {
    paddingHorizontal: 20,
    alignItems: "center",
  },
  flowLabel: {
    backgroundColor: "#3a4856",
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
  },
  flowLabelText: {
    color: "#e8f4fd",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
  inputSlots: {
    alignItems: "center",
  },
  outputSlots: {
    alignItems: "center",
  },
  resourceSlot: {
    alignItems: "center",
    marginBottom: 8,
  },
  slotIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
    borderWidth: 2,
    borderColor: "#4a5866",
  },
  slotAmount: {
    color: "#e8f4fd",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  slotName: {
    color: "#b8c7d1",
    fontSize: 11,
    textAlign: "center",
    marginBottom: 2,
  },
  slotInventory: {
    fontSize: 10,
    fontWeight: "600",
  },

  // Machine Status Section
  machineStatusSection: {
    marginBottom: 16,
  },
  machineInfoCard: {
    backgroundColor: "#1f2935",
    borderWidth: 1,
    borderColor: "#4a5866",
    borderRadius: 8,
    padding: 16,
  },
  machineHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  machineInfo: {
    flex: 1,
    marginLeft: 12,
  },
  recipeTitle: {
    color: "#6db4f0",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
  },
  productionStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#2a3441",
    borderRadius: 6,
    padding: 12,
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    color: "#b8c7d1",
    fontSize: 11,
    marginBottom: 4,
  },
  statValue: {
    color: "#e8f4fd",
    fontSize: 14,
    fontWeight: "700",
  },

  // Progress Section
  progressSection: {
    backgroundColor: "#1f2935",
    borderWidth: 1,
    borderColor: "#4a5866",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },

  // Controls Section
  controlsSection: {
    backgroundColor: "#1f2935",
    borderWidth: 1,
    borderColor: "#4a5866",
    borderRadius: 8,
    padding: 16,
  },
  quantityControls: {
    marginBottom: 16,
  },
  controlLabel: {
    color: "#e8f4fd",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  quickButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  startProductionButton: {
    backgroundColor: "#4a7fa7",
    borderWidth: 2,
    borderColor: "#6db4f0",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  startProductionButtonDisabled: {
    backgroundColor: "#3a4856",
    borderColor: "#4a5866",
  },
  startProductionButtonText: {
    color: "#e8f4fd",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
    marginLeft: 8,
    textTransform: "uppercase",
  },
  startProductionButtonTextDisabled: {
    color: "#6b7885",
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
  
  // Machine display components
  machineIcon: {
    width: 48,
    height: 48,
    backgroundColor: "#3a4856",
    borderWidth: 2,
    borderColor: "#6db4f0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  machineTitle: {
    color: "#e8f4fd",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  
  machineStatus: {
    alignItems: "center",
  },
  
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  
  statusText: {
    color: "#b8c7d1",
    fontSize: 11,
    fontWeight: "500",
  },

});

export default React.memo(ConstructorModal);
