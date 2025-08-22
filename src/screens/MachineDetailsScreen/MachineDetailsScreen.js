import React, { useState, useMemo, useRef, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal } from "react-native";
import MiniToast from "./MiniToast";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";
import InventoryStyles from "../InventoryScreen/styles";
import { items } from "../../data/items";
import { useGame } from "../../contexts/GameContext";
import useCrafting from "../../hooks/useCrafting";
import { Picker } from '@react-native-picker/picker';
import ProgressBar from "../../components/ProgressBar";
import CraftButton from "./components/CraftButton";

// Helpers to normalize inputs/outputs to arrays of {item, amount}
function normalizeInputs(inputs) {
  if (!inputs) return [];
  if (Array.isArray(inputs)) return inputs;
  if (typeof inputs === 'object') {
    return Object.entries(inputs).map(([item, amount]) => ({ item, amount }));
  }
  return [];
}
function normalizeOutputs(outputs) {
  if (!outputs) return [];
  if (Array.isArray(outputs)) return outputs;
  if (typeof outputs === 'object') {
    return Object.entries(outputs).map(([item, amount]) => ({ item, amount }));
  }
  return [];
}

const MachineDetailsScreen = ({ route }) => {

  const [showConfirm, setShowConfirm] = useState(false);

  const [inventoryModalVisible, setInventoryModalVisible] = useState(false);
  const { machine, node, recipe } = route.params;
  const { allResourceNodes = [], setPlacedMachines, placedMachines, discoveredNodes, inventory, ownedMachines: contextOwnedMachines, addResource, removeResources, canAfford, handleDepleteNode, craftingQueue, addToCraftingQueue, updateCraftingQueue } = useGame();
  const ownedMachines = useMemo(
    () => (contextOwnedMachines || []).map(m => m.type),
    [contextOwnedMachines]
  );
  const { craftItem } = useCrafting(
    inventory,
    ownedMachines,
    addResource,
    removeResources,
    canAfford
  );
  const [selectedNodeId, setSelectedNodeId] = useState(machine.assignedNodeId || null);
  // For non-miner/pump: recipe selection and amount

  // Find all items that can be produced by this machine type
  const availableRecipes = useMemo(() => {
    // Each item in items may have a .machine property matching this machine type
    return Object.values(items)
      .filter(item => item.machine === machine.type)
      .map(item => ({
        id: item.id,
        name: item.name,
        machine: item.machine,
        inputs: normalizeInputs(item.inputs),
        outputs: normalizeOutputs(item.output || item.outputs),
        processingTime: item.processingTime,
      }));
  }, [machine.type]);

  const [selectedRecipeId, setSelectedRecipeId] = useState(availableRecipes[0]?.id || null);

  const selectedRecipe = useMemo(() => {
    const found = availableRecipes.find(r => r.id === selectedRecipeId);
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
    miniToastTimeout.current = setTimeout(() => setMiniToastVisible(false), 700);
  };

  // Progress state for crafting
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef(null);

  // Find the latest machine data from context
  const liveMachine = placedMachines.find(m => m.id === machine.id) || machine;
  const assignedNode = liveMachine.assignedNodeId
    ? allResourceNodes.find(n => n.id === liveMachine.assignedNodeId)
    : null;

  const handleAssignNode = (nodeId) => {
    // Only allow assignment to discovered and non-depleted nodes
    const node = allResourceNodes.find(n => n.id === nodeId);
    if (!node || !discoveredNodes[nodeId] || node.currentAmount <= 0) {
      return;
    }
    if (liveMachine.type === "miner") {
      setPlacedMachines((prevPlaced) => prevPlaced.filter(m => m.id !== liveMachine.id));
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
    setIsProcessing(isMax || amountToCraft > 1 ? 'max' : 'single');
    setProgress(0);

    let crafted = 0;
    for (let i = 0; i < amountToCraft; i++) {
      await new Promise(resolve => {
        let elapsed = 0;
        const step = 50;
        const interval = setInterval(() => {
          elapsed += step / 1000;
          setProgress(i * selectedRecipe.processingTime + Math.min(elapsed, selectedRecipe.processingTime));
          if (elapsed >= selectedRecipe.processingTime) {
            clearInterval(interval);
            resolve();
          }
        }, step);
        progressInterval.current = interval;
      });
      crafted++;
      showMiniToast(`+1 ${items[selectedRecipe.outputs[0].item]?.name || selectedRecipe.outputs[0].item}`);
      const success = craftItem(selectedRecipe, 1);
      if (!success) {
        alert('Crafting failed.');
        break;
      }
    }
    cancelCrafting();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Inventory Modal */}
      <Modal
        visible={inventoryModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setInventoryModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#1a1a2a', borderRadius: 16, padding: 20, width: '92%', maxHeight: '85%' }}>
            <Text style={[InventoryStyles.title, { marginTop: 0 }]}>Your Crafted Items</Text>
            <ScrollView contentContainerStyle={InventoryStyles.scrollViewContent}>
              {Object.values(inventory).filter(item => {
                const itemData = items[item.id];
                return (
                  item.currentAmount > 0 &&
                  itemData &&
                  (itemData.type === "intermediateProduct" || itemData.type === "finalProduct")
                );
              }).sort((a, b) => a.name.localeCompare(b.name)).length > 0 ? (
                <View style={InventoryStyles.inventoryGrid}>
                  {Object.values(inventory)
                    .filter(item => {
                      const itemData = items[item.id];
                      return (
                        item.currentAmount > 0 &&
                        itemData &&
                        (itemData.type === "intermediateProduct" || itemData.type === "finalProduct")
                      );
                    })
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(item => {
                      const itemDetails = items[item.id] || {};
                      return (
                        <TouchableOpacity
                          key={item.id}
                          style={InventoryStyles.gridItem}
                          activeOpacity={0.7}
                        >
                          <View style={InventoryStyles.iconContainer}>
                            {/* <Image source={itemDetails.icon} style={InventoryStyles.itemIcon} /> */}
                            <Text style={InventoryStyles.iconText}>
                              {item.name.charAt(0).toUpperCase()}
                            </Text>
                          </View>
                          <Text style={InventoryStyles.itemName}>{item.name}</Text>
                          <View style={InventoryStyles.amountOverlay}>
                            <Text style={InventoryStyles.itemAmount}>
                              {Math.floor(item.currentAmount)}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                </View>
              ) : (
                <Text style={InventoryStyles.emptyInventoryText}>
                  Your inventory of crafted items is empty. Start building and crafting!
                </Text>
              )}
            </ScrollView>
            <TouchableOpacity
              style={{ marginTop: 18, alignSelf: 'center', backgroundColor: '#444', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 32 }}
              onPress={() => setInventoryModalVisible(false)}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Inventory Button */}
      <TouchableOpacity
        style={{
          backgroundColor: '#2980b9',
          borderRadius: 8,
          paddingVertical: 12,
          marginBottom: 12,
          alignItems: 'center',
          alignSelf: 'center',
          width: '60%',
        }}
        onPress={() => setInventoryModalVisible(true)}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Inventory</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.detailsContent}>
        <Text style={styles.detailsTitle}>{liveMachine.type}</Text>
        <Text style={styles.detailsText}><Text style={{ fontWeight: 'bold' }}>ID:</Text> {liveMachine.id}</Text>
        <Text style={styles.detailsText}><Text style={{ fontWeight: 'bold' }}>Type:</Text> {liveMachine.type}</Text>
        {liveMachine.type === "miner" || liveMachine.type === "pump" ? (
          (() => {
            // Only allow discovered and non-depleted nodes
            const discoveredNodeOptions = allResourceNodes.filter((node) => discoveredNodes[node.id] && (typeof node.currentAmount !== 'number' || node.currentAmount > 0));
            if (discoveredNodeOptions.length === 0) {
              return (
                <Text style={[styles.detailsText, { color: '#ff9800', marginTop: 16 }]}>You must explore the world map and discover a non-depleted node before you can assign this machine.</Text>
              );
            }
            return (
              <View>
                <Text style={styles.detailsText}>Assign to Node:</Text>
                <Picker
                  selectedValue={selectedNodeId}
                  style={{ height: 50, width: '100%', backgroundColor: '#23233a', color: '#fff', marginBottom: 10 }}
                  onValueChange={(itemValue) => handleAssignNode(itemValue)}
                >
                  <Picker.Item label="Select a node..." value={null} />
                  {discoveredNodeOptions.map((node) => (
                    <Picker.Item key={node.id} label={node.name} value={node.id} />
                  ))}
                </Picker>
                {assignedNode && (
                  <>
                    <Text style={[styles.detailsText, { color: '#4CAF50', fontWeight: 'bold' }]}>Miner assigned to: {assignedNode.name}</Text>
                    {/* Show depletion progress */}
                    {typeof assignedNode.currentAmount === 'number' && (
                      <ProgressBar
                        value={assignedNode.currentAmount}
                        max={typeof assignedNode.capacity === 'number' ? assignedNode.capacity : 1000}
                        style={{ marginTop: 8, marginBottom: 8 }}
                      />
                    )}
                    {typeof assignedNode.currentAmount === 'number' && assignedNode.currentAmount <= 0 && (
                      <Text style={{ color: '#c00', fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }}>
                        Node Depleted
                      </Text>
                    )}
                  </>
                )}
              </View>
            );
          })()
        ) : (
          availableRecipes.length > 0 && (
            <View>
              <Text style={styles.detailsText}>Select Recipe:</Text>
              <Picker
                selectedValue={selectedRecipeId}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedRecipeId(itemValue)}
              >
                {availableRecipes.map((recipe) => (
                  <Picker.Item key={recipe.id} label={recipe.name} value={recipe.id} />
                ))}
              </Picker>

              {selectedRecipe && (() => {
                const inputs = Array.isArray(selectedRecipe.inputs) ? selectedRecipe.inputs : [];
                const outputs = Array.isArray(selectedRecipe.outputs) ? selectedRecipe.outputs : [];
                const output = outputs[0];
                const processingTime = selectedRecipe.processingTime || 1;

                let maxCraftable = Infinity;
                inputs.forEach(input => {
                  const inv = inventory[input.item]?.currentAmount || 0;
                  const possible = input.amount > 0 ? Math.floor(inv / input.amount) : 0;
                  if (possible < maxCraftable) maxCraftable = possible;
                });

                const amount = Math.max(1, parseInt(productAmount) || 1);
                const canCraft = amount > 0 && amount <= maxCraftable;

                return (
                  <View style={styles.card}>
                    {/* Progress Bar */}
                    {isProcessing && (
                      <View style={styles.progressContainer}>
                        <ProgressBar
                          value={progress}
                          max={isProcessing === 'max' ? (processingTime * maxCraftable) : processingTime}
                          label={null}
                          color="#4CAF50"
                          backgroundColor="#23233a"
                          height={18}
                          style={{ borderRadius: 8 }}
                        />
                        <Text style={styles.progressText}>
                          {isProcessing === 'max'
                            ? `Processing... ${progress.toFixed(1)}s / ${(processingTime * maxCraftable).toFixed(1)}s`
                            : `Processing... ${progress.toFixed(1)}s / ${processingTime}s`}
                        </Text>
                        <TouchableOpacity onPress={cancelCrafting} style={styles.cancelButton}>
                          <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* Resource Info */}
                    <Text style={styles.sectionTitle}>Required Resources</Text>
                    {inputs.length === 0 ? (
                      <Text style={styles.subText}>None</Text>
                    ) : (
                      inputs.map(input => (
                        <Text key={input.item} style={styles.resourceText}>
                          {input.amount * amount} x {items[input.item]?.name || input.item}
                          <Text style={styles.inventoryText}>
                            (You have: {inventory[input.item]?.currentAmount || 0})
                          </Text>
                        </Text>
                      ))
                    )}

                    {/* Output Info */}
                    <Text style={styles.sectionTitle}>Expected Output</Text>
                    <Text style={styles.outputText}>
                      {output ? output.amount * amount : 0} x {output ? (items[output.item]?.name || output.item) : ''}
                    </Text>

                    {/* Stepper */}
                    <View style={styles.stepperContainer}>
                      <TouchableOpacity onPress={() => setProductAmount(Math.max(1, amount - 1))}>
                        <Text style={styles.stepperButton}>−</Text>
                      </TouchableOpacity>
                      <TextInput
                        style={styles.stepperInput}
                        keyboardType="numeric"
                        value={String(amount)}
                        onChangeText={(val) => setProductAmount(val)}
                      />
                      <TouchableOpacity onPress={() => setProductAmount(Math.min(maxCraftable, amount + 1))}>
                        <Text style={styles.stepperButton}>+</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Craft Buttons */}
                    <View style={styles.buttonRow}>
                      <CraftButton label="Craft 1" onPress={() => startCrafting(1)}/*  disabled={!canCraft || isProcessing}  *//>
                      <CraftButton label="Craft 5" onPress={() => startCrafting(Math.min(5, maxCraftable))} /* disabled={!canCraft || isProcessing} */ />
                      <CraftButton label={`Craft Max (${maxCraftable})`} onPress={() => setShowConfirm(true)} /*disabled={maxCraftable <= 0 || isProcessing} */ />
                    </View>

                    {/* Warning */}
                    {maxCraftable <= 0 && (
                      <Text style={styles.warningText}>Not enough resources.</Text>
                    )}

                    {/* Confirm Modal */}
                    <Modal visible={showConfirm} transparent animationType="fade">
                      <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                          <Text style={styles.modalText}>
                            You're about to craft {maxCraftable} items. This will take {(processingTime * maxCraftable).toFixed(1)}s.
                          </Text>
                          <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={() => { setShowConfirm(false); startCrafting(maxCraftable, true); }}>
                              <Text style={styles.modalConfirm}>Confirm</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowConfirm(false)}>
                              <Text style={styles.modalCancel}>Cancel</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </Modal>
                  </View>
                );
              })()}

            </View>

          )
        )}
      </ScrollView>
      <MiniToast visible={miniToastVisible} message={miniToastMsg} />
    </SafeAreaView>
  );
};

export default MachineDetailsScreen;
