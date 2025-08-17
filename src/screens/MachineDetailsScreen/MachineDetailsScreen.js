import React, { useState, useMemo, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import MiniToast from "./MiniToast";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";
import { items } from "../../data/items";
import { useGame } from "../../contexts/GameContext";
import useCrafting from "../../hooks/useCrafting";
import { Picker } from '@react-native-picker/picker';
import ProgressBar from "../../components/ProgressBar";

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
  const { machine, node, recipe } = route.params;
  const { allResourceNodes = [], setPlacedMachines, placedMachines, discoveredNodes, inventory, ownedMachines: contextOwnedMachines, addResource, removeResources, canAfford, handleDepleteNode } = useGame();
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
  // Progress state for crafting
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef(null);
  // Mini toast state
  const [miniToastVisible, setMiniToastVisible] = useState(false);
  const [miniToastMsg, setMiniToastMsg] = useState("");
  const miniToastTimeout = useRef(null);
  const showMiniToast = (msg) => {
    setMiniToastVisible(false); // reset to trigger re-mount
    setTimeout(() => {
      setMiniToastMsg(msg);
      setMiniToastVisible(true);
      if (miniToastTimeout.current) clearTimeout(miniToastTimeout.current);
      miniToastTimeout.current = setTimeout(() => setMiniToastVisible(false), 700);
    }, 10); // short delay to force re-render
  };

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

  return (
    <SafeAreaView style={styles.container}>
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
                        max={typeof assignedNode.capacity === 'number' ? assignedNode.capacity : 50}
                        label={"Node Depletion"}
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
                style={{ height: 50, width: '100%', backgroundColor: '#23233a', color: '#fff', marginBottom: 10 }}
                onValueChange={(itemValue) => setSelectedRecipeId(itemValue)}
              >
                {availableRecipes.map((recipe) => (
                  <Picker.Item key={recipe.id} label={recipe.name} value={recipe.id} />
                ))}
              </Picker>
              {selectedRecipe && (() => {
                // Always treat inputs/outputs as arrays
                const inputs = Array.isArray(selectedRecipe.inputs) ? selectedRecipe.inputs : (selectedRecipe.inputs ? [selectedRecipe.inputs] : []);
                const outputs = Array.isArray(selectedRecipe.outputs) ? selectedRecipe.outputs : (selectedRecipe.outputs ? [selectedRecipe.outputs] : []);
                let maxCraftable = Infinity;
                inputs.forEach(input => {
                  const inv = inventory[input.item]?.currentAmount || 0;
                  const possible = input.amount > 0 ? Math.floor(inv / input.amount) : 0;
                  if (possible < maxCraftable) maxCraftable = possible;
                });
                // Output info
                const output = outputs[0];
                // Can craft?
                const amount = Math.max(1, parseInt(productAmount) || 1);
                const canCraft = amount > 0 && amount <= maxCraftable;
                // ProgressBar logic
                const processingTime = selectedRecipe.processingTime || 1;
                return (
                  <View style={{
                    marginBottom: 20,
                    backgroundColor: '#23233a',
                    borderRadius: 12,
                    padding: 16,
                    shadowColor: '#000',
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 2,
                  }}>
                    {isProcessing && (
                      <View style={{ marginTop: 8, marginBottom: 16, alignSelf: 'stretch' }}>
                        <ProgressBar
                          value={progress}
                          max={isProcessing === 'max' ? (processingTime * maxCraftable) : processingTime}
                          label={null}
                          color="#4CAF50"
                          backgroundColor="#23233a"
                          height={18}
                          style={{ opacity: 1, borderRadius: 8 }}
                        />
                        <Text style={{ color: '#ffe082', fontSize: 14, textAlign: 'center', marginTop: 4, fontWeight: 'bold', letterSpacing: 0.5 }}>
                          {isProcessing === 'max'
                            ? `Processing... ${(progress).toFixed(1)}s / ${(processingTime * maxCraftable).toFixed(1)}s`
                            : `Processing... ${(progress).toFixed(1)}s / ${processingTime}s`}
                        </Text>
                      </View>
                    )}
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, marginBottom: 6 }}>Required Resources</Text>
                    {inputs.length === 0 ? (
                      <Text style={{ color: '#bbb', fontSize: 14, marginBottom: 4 }}>None</Text>
                    ) : (
                      inputs.map(input => (
                        <Text key={input.item} style={{ color: '#fff', fontSize: 14, marginBottom: 2 }}>
                          {input.amount * amount} x {items[input.item]?.name || input.item} 
                          <Text style={{ color: '#aaa', fontSize: 13 }}>
                            (You have: {inventory[input.item]?.currentAmount || 0})
                          </Text>
                        </Text>
                      ))
                    )}
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, marginTop: 10, marginBottom: 2 }}>Expected Output</Text>
                    <Text style={{ color: '#fff', fontSize: 15, marginBottom: 10 }}>
                      {output ? output.amount * amount : 0} x {output ? (items[output.item]?.name || output.item) : ''}
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                      <TouchableOpacity
                        style={{
                          flex: 1,
                          backgroundColor: canCraft && !isProcessing ? '#27ae60' : '#aaa',
                          borderRadius: 8,
                          paddingVertical: 16,
                          marginRight: 8,
                          alignItems: 'center',
                          shadowColor: '#000',
                          shadowOpacity: 0.08,
                          shadowRadius: 4,
                          elevation: 1,
                        }}
                        disabled={!!(!canCraft || isProcessing)}
                        onPress={() => {
                          if (selectedRecipe && canCraft && !isProcessing) {
                            setIsProcessing('single');
                            setProgress(0);
                            if (progressInterval.current) clearInterval(progressInterval.current);
                            const interval = setInterval(() => {
                              setProgress(prev => {
                                if (prev + 0.1 >= processingTime) {
                                  clearInterval(interval);
                                  setIsProcessing(false);
                                  setProgress(0);
                                  const success = craftItem(selectedRecipe, 1);
                                  if (!success) {
                                    alert('Crafting failed.');
                                  }
                                  return processingTime;
                                }
                                return prev + 0.1;
                              });
                            }, 100);
                            progressInterval.current = interval;
                          }
                        }}
                      >
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 0.5 }}>
                          Craft 1 {output ? (items[output.item]?.name || output.item) : ''}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          flex: 1,
                          backgroundColor: maxCraftable > 0 && !isProcessing ? '#2980b9' : '#aaa',
                          borderRadius: 8,
                          paddingVertical: 16,
                          marginLeft: 8,
                          alignItems: 'center',
                          shadowColor: '#000',
                          shadowOpacity: 0.08,
                          shadowRadius: 4,
                          elevation: 1,
                        }}
                        disabled={!!(maxCraftable <= 0 || isProcessing)}
                        onPress={async () => {
                          if (selectedRecipe && maxCraftable > 0 && !isProcessing) {
                            setIsProcessing('max');
                            setProgress(0);
                            let crafted = 0;
                            for (let i = 0; i < maxCraftable; i++) {
                              // Barra de progreso animada
                              await new Promise(resolve => {
                                let elapsed = 0;
                                const step = 50; // ms
                                const interval = setInterval(() => {
                                  elapsed += step / 1000;
                                  setProgress(i * processingTime + Math.min(elapsed, processingTime));
                                  if (elapsed >= processingTime) {
                                    clearInterval(interval);
                                    resolve();
                                  }
                                }, step);
                              });
                              crafted++;
                              showMiniToast(`+1 ${output ? (items[output.item]?.name || output.item) : ''}`);
                              const success = craftItem(selectedRecipe, 1);
                              if (crafted >= maxCraftable) {
                                setIsProcessing(false);
                                setProgress(0);
                                if (!success) {
                                  alert('Crafting failed.');
                                }
                              }
                            }
                          }
                        }}
                      >
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 0.5 }}>
                          Craft Max ({maxCraftable}) {output ? (items[output.item]?.name || output.item) : ''}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {maxCraftable <= 0 && (
                      <Text style={{ color: '#e53935', marginTop: 4 }}>Not enough resources.</Text>
                    )}
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
