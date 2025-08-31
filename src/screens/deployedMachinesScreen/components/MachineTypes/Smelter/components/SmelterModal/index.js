import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import styles from "../../../../../../MachineDetailsScreen/styles";
import { items } from "../../../../../../../data/items";
import { useGame } from "../../../../../../../contexts/GameContext";
import useCrafting from "../../../../../../../hooks/useCrafting";

// Component imports
import RecipeSelector from "../RecipeSelector";
import CraftingProgress from "../CraftingProgress";
import ResourceList from "../ResourceList";
import CraftButton from "../CraftButton";
import MiniToast from "../MiniToast";
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

const SmelterModal = ({
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

  const availableRecipes = useMemo(() => {
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
    recipe?.id || availableRecipes[0]?.id || null
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
  const [activeCraftButton, setActiveCraftButton] = useState("1");

  const cancelCrafting = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
    setIsProcessing(false);
    setProgress(0);
  };

  // Crafting logic
  const startCrafting = async (amountToCraft, isMax = false) => {
    if (!selectedRecipe || isProcessing) return;
    const totalAmount = Number(amountToCraft) || 1;
    const unitProcessingTime = Number(selectedRecipe.processingTime) || 1;

    // Always clear any previous interval before starting
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }

    setProgress(0);
    setIsProcessing(isMax || totalAmount > 1 ? "max" : "single");
    setCurrentCraftAmount(totalAmount);

    let crafted = 0;
    let totalElapsed = 0;
    const outputAmount = selectedRecipe.outputs[0]?.amount || 1;
    const outputItem = selectedRecipe.outputs[0]?.item;

    for (let i = 0; i < totalAmount; i++) {
      const success = craftItem(selectedRecipe, 1);
      if (!success) {
        alert("Crafting failed.");
        break;
      }
      await new Promise((resolve) => {
        let elapsed = 0;
        const step = 50;
        setProgress(0); // <-- Ensure progress is 0 at the start of each craft
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
          progressInterval.current = null;
        }
        const interval = setInterval(() => {
          elapsed += step / 1000;
          totalElapsed += step / 1000;
          setProgress(elapsed); // <-- Use elapsed, not totalElapsed, for per-craft progress
          if (elapsed >= unitProcessingTime) {
            clearInterval(interval);
            resolve();
          }
        }, step);
        progressInterval.current = interval;
      });
      crafted++;
      showMiniToast(
        `+${outputAmount} ${items[outputItem]?.name || outputItem}`
      );
    }
    cancelCrafting();
    setCurrentCraftAmount(1);

    if (activeCraftButton === "max") {
      setActiveCraftButton("1");
      setProductAmount("1");
    }
  };

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

  useEffect(() => {
    setActiveCraftButton("1");
    setProductAmount("1");
  }, [selectedRecipeId]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={modalStyles.safeArea}>
        <View style={modalStyles.modalContainer}>
          <TouchableOpacity style={modalStyles.closeButton} onPress={onClose}>
            <Text style={modalStyles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <ScrollView contentContainerStyle={styles.detailsContent}>
            <Text style={styles.detailsTitle}>{machine.type}</Text>

            {availableRecipes.length > 0 && (
              <View>
                <RecipeSelector
                  availableRecipes={availableRecipes}
                  selectedRecipeId={selectedRecipeId}
                  setSelectedRecipeId={setSelectedRecipeId}
                />

                {selectedRecipe && (
                  <View style={styles.card}>
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

                    <ResourceList
                      inputs={selectedRecipe.inputs}
                      outputs={selectedRecipe.outputs}
                      amount={amount}
                      inventory={inventory}
                    />

                    <View style={styles.buttonRow}>
                      <CraftButton
                        isActive={activeCraftButton === "1"}
                        label="Craft 1"
                        onPress={() => {
                          setProductAmount(1);
                          setActiveCraftButton("1");
                        }}
                        disabled={!!isProcessing}
                      />
                      <CraftButton
                        isActive={activeCraftButton === "5"}
                        label="Craft 5"
                        onPress={() => {
                          setProductAmount(5);
                          setActiveCraftButton("5");
                        }}
                        disabled={!!isProcessing || maxCraftable < 5}
                        style={maxCraftable < 5 ? { opacity: 0.5 } : {}}
                      />
                      <CraftButton
                        isActive={activeCraftButton === "max"}
                        label={`Craft Max (${maxCraftable})`}
                        onPress={() => {
                          setProductAmount(maxCraftable);
                          setActiveCraftButton("max");
                        }}
                        disabled={!!isProcessing || maxCraftable <= 0}
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
                      disabled={!canCraft || !!isProcessing}
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
                  </View>
                )}
              </View>
            )}
          </ScrollView>
          <MiniToast visible={miniToastVisible} message={miniToastMsg} />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 8,
  },
  closeButtonText: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SmelterModal;
