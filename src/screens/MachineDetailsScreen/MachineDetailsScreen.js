import React, { useState, useMemo, useRef, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MiniToast from "./components/MiniToast";
import styles from "./styles";
import { items } from "../../data/items";
import { useGame } from "../../contexts/GameContext";
import useCrafting from "../../hooks/useCrafting";

// Component imports
import InventoryModal from "./components/InventoryModal";
import NodeSelector from "./components/NodeSelector";
import RecipeSelector from "./components/RecipeSelector";
import CraftingProgress from "./components/CraftingProgress";
import ResourceList from "./components/ResourceList";
import QuantityStepper from "./components/QuantityStepper";
import CraftButton from "./components/CraftButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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

const MachineDetailsScreen = ({ route }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [inventoryModalVisible, setInventoryModalVisible] = useState(false);
  const { machine, node, recipe } = route.params;
  const {
    allResourceNodes = [],
    setPlacedMachines,
    placedMachines,
    discoveredNodes,
    inventory,
    ownedMachines: contextOwnedMachines,
    addResource,
    removeResources,
    canAfford,
    /*     handleDepleteNode,
    craftingQueue,
    addToCraftingQueue,
    updateCraftingQueue, */
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

  const [selectedNodeId, setSelectedNodeId] = useState(
    machine.assignedNodeId || null
  );

  // For non-miner/pump: recipe selection and amount
  const availableRecipes = useMemo(() => {
    // Each item in items may have a .machine property matching this machine type
    return Object.values(items)
      .filter((item) => item.machine === machine.type)
      .map((item) => ({
        id: item.id,
        name: item.name,
        machine: item.machine,
        inputs: normalizeInputs(item.inputs),
        outputs: normalizeOutputs(item.output || item.outputs),
        processingTime: item.processingTime,
      }));
  }, [machine.type]);

  const [selectedRecipeId, setSelectedRecipeId] = useState(
    availableRecipes[0]?.id || null
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

  // Progress state for crafting
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef(null);
  const [currentCraftAmount, setCurrentCraftAmount] = useState(1);

  // Find the latest machine data from context
  const liveMachine =
    placedMachines.find((m) => m.id === machine.id) || machine;
  const assignedNode = liveMachine.assignedNodeId
    ? allResourceNodes.find((n) => n.id === liveMachine.assignedNodeId)
    : null;

  const handleAssignNode = (nodeId) => {
    // Only allow assignment to discovered and non-depleted nodes
    const node = allResourceNodes.find((n) => n.id === nodeId);
    if (!node || !discoveredNodes[nodeId] || node.currentAmount <= 0) {
      return;
    }
    if (liveMachine.type === "miner") {
      setPlacedMachines((prevPlaced) =>
        prevPlaced.filter((m) => m.id !== liveMachine.id)
      );
      setTimeout(() => {
        setPlacedMachines((prevPlaced) => [
          ...prevPlaced,
          {
            id: liveMachine.id,
            type: "miner",
            assignedNodeId: nodeId,
            efficiency: liveMachine.efficiency || 1,
          },
        ]);
      }, 0);
    } else {
      setPlacedMachines((prevPlaced) =>
        prevPlaced.map((m) =>
          m.id === machine.id ? { ...m, assignedNodeId: nodeId } : m
        )
      );
    }
    setSelectedNodeId(nodeId);
    console.log(`Assigned node ${nodeId} to machine ${machine.id}`);
  };

  const cancelCrafting = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
    setIsProcessing(false);
    setProgress(0);
  };

  // Crafting logic: always animate per unit, show mini-toast per unit, as before
  const startCrafting = async (amountToCraft, isMax = false) => {
    if (!selectedRecipe || isProcessing) return;
    const totalAmount = Number(amountToCraft) || 1;
    const unitProcessingTime = Number(selectedRecipe.processingTime) || 1;
    setIsProcessing(isMax || totalAmount > 1 ? "max" : "single");
    setCurrentCraftAmount(totalAmount);
    setProgress(0);

    let crafted = 0;
    let totalElapsed = 0;
    const outputAmount = selectedRecipe.outputs[0]?.amount || 1;
    const outputItem = selectedRecipe.outputs[0]?.item;

    for (let i = 0; i < totalAmount; i++) {
      await new Promise((resolve) => {
        let elapsed = 0;
        const step = 50;
        const interval = setInterval(() => {
          elapsed += step / 1000;
          totalElapsed += step / 1000;
          setProgress(totalElapsed);
          if (elapsed >= unitProcessingTime) {
            clearInterval(interval);
            resolve();
          }
        }, step);
        progressInterval.current = interval;
      });
      crafted++;
      // Suma progresiva: suma 1 vez por iteración
      const success = craftItem(selectedRecipe, 1);
      if (!success) {
        alert("Crafting failed.");
        break;
      }
      showMiniToast(
        `+${outputAmount} ${items[outputItem]?.name || outputItem}`
      );
    }
    cancelCrafting();
    setCurrentCraftAmount(1);
  };

  // Calculate max craftable amount
  const calculateMaxCraftable = () => {
    if (!selectedRecipe) return 0;

    let maxCraftable = Infinity;
    selectedRecipe.inputs.forEach((input) => {
      const inv = inventory[input.item]?.currentAmount || 0;
      const possible = input.amount > 0 ? Math.floor(inv / input.amount) : 0;
      if (possible < maxCraftable) maxCraftable = possible;
    });

    return maxCraftable;
  };

  const maxCraftable = calculateMaxCraftable();
  const amount = Math.max(1, parseInt(productAmount) || 1);
  const canCraft = amount > 0 && amount <= maxCraftable;
  const processingTime = Number(selectedRecipe?.processingTime) || 1;

  // Filter for resource node options
  const discoveredNodeOptions = useMemo(
    () =>
      allResourceNodes.filter(
        (node) =>
          discoveredNodes[node.id] &&
          (typeof node.currentAmount !== "number" || node.currentAmount > 0)
      ),
    [allResourceNodes, discoveredNodes]
  );

  //TODO: fix CANCEL in progress bar
  // when finished crafting "max" it should reset the craft amount to 1

  return (
    <SafeAreaView style={styles.container}>
      {/* Inventory Modal */}
      {/* {inventoryModalVisible && (
        <InventoryModal
          visible={inventoryModalVisible}
          inventory={inventory}
          onClose={() => setInventoryModalVisible(false)}
        />
      )} */}

      {/* Inventory Button */}
      {/*  <TouchableOpacity
        style={styles.inventoryButton}
        onPress={() => setInventoryModalVisible(true)}
        activeOpacity={0.85}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
          Inventory
        </Text>
      </TouchableOpacity>
 */}
      <ScrollView contentContainerStyle={styles.detailsContent}>
        <Text style={styles.detailsTitle}>{liveMachine.type}</Text>

        {/* Miner/Pump specific controls */}
        {liveMachine.type === "miner" || liveMachine.type === "pump" ? (
          <NodeSelector
            discoveredNodeOptions={discoveredNodeOptions}
            selectedNodeId={selectedNodeId}
            handleAssignNode={handleAssignNode}
            assignedNode={assignedNode}
          />
        ) : (
          availableRecipes.length > 0 && (
            <View>
              {/* Recipe Selector */}
              <RecipeSelector
                availableRecipes={availableRecipes}
                selectedRecipeId={selectedRecipeId}
                setSelectedRecipeId={setSelectedRecipeId}
              />

              {selectedRecipe && (
                <View style={styles.card}>
                  {/* Floating Progress Bar */}
                  {isProcessing && (
                    <View
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 10,
                        alignItems: "center",
                        width: "100%",
                      }}
                      pointerEvents="box-none"
                    >
                      <CraftingProgress
                        isProcessing={isProcessing}
                        progress={progress}
                        processingTime={processingTime * currentCraftAmount}
                        maxCraftable={maxCraftable}
                        onCancel={cancelCrafting}
                        totalAmount={currentCraftAmount}
                      />
                    </View>
                  )}

                  {/* Resource Lists */}
                  <ResourceList
                    inputs={selectedRecipe.inputs}
                    outputs={selectedRecipe.outputs}
                    amount={amount}
                    inventory={inventory}
                  />

                  {/* Quantity Stepper */}
                  {/* TODO IMPLEMENT SLIDER */}
                  {/*   <QuantityStepper
                    amount={amount}
                    setAmount={handleSetProductAmount}
                    maxAmount={maxCraftable}
                  /> */}

                  {/* Craft Amount Buttons */}
                  <View style={styles.buttonRow}>
                    <CraftButton
                      label="Craft 1"
                      onPress={() => setProductAmount(1)}
                      disabled={!!isProcessing}
                      icon="numeric-1-circle"
                    />
                    <CraftButton
                      label="Craft 5"
                      onPress={() =>
                        setProductAmount(Math.min(5, maxCraftable))
                      }
                      disabled={!!isProcessing || maxCraftable < 5}
                      icon="numeric-5-circle"
                      style={maxCraftable < 5 ? { opacity: 0.5 } : {}}
                    />
                    <CraftButton
                      label={`Craft Max (${maxCraftable})`}
                      onPress={() => setProductAmount(maxCraftable)}
                      disabled={!!isProcessing}
                      icon="numeric"
                    />
                  </View>

                  {/* Start Crafting Button */}
                  <TouchableOpacity
                    style={[
                      {
                        backgroundColor:
                          canCraft && !isProcessing ? "#4CAF50" : "#35354a",
                        borderRadius: 8,
                        paddingVertical: 8,
                        alignItems: "center",
                        marginTop: 20,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.18,
                        shadowRadius: 8,
                        elevation: 4,
                        opacity: canCraft && !isProcessing ? 1 : 0.6,
                        flexDirection: "row",
                        justifyContent: "center",
                      },
                    ]}
                    onPress={() => startCrafting(amount)}
                    /*   disabled={!canCraft || isProcessing} */
                    activeOpacity={0.85}
                  >
                    <MaterialCommunityIcons
                      name="hammer-screwdriver"
                      size={26}
                      color={canCraft && !isProcessing ? "#fff" : "#888"}
                      style={{ marginRight: 10 }}
                    />
                    <Text
                      style={{
                        color: canCraft && !isProcessing ? "#fff" : "#888",
                        fontWeight: "bold",
                        fontSize: 18,
                        letterSpacing: 0.5,
                      }}
                    >
                      Start Crafting {amount}{" "}
                      {selectedRecipe.outputs[0].item
                        ? items[selectedRecipe.outputs[0].item]?.name ||
                          selectedRecipe.outputs[0].item
                        : ""}
                    </Text>
                  </TouchableOpacity>

                  {/* Warning */}
                  {maxCraftable <= 0 && (
                    <Text style={styles.warningText}>
                      Not enough resources.
                    </Text>
                  )}
                </View>
              )}
            </View>
          )
        )}
      </ScrollView>

      {/* Mini Toast for crafting feedback */}
      <MiniToast visible={miniToastVisible} message={miniToastMsg} />
    </SafeAreaView>
  );
};

export default MachineDetailsScreen;