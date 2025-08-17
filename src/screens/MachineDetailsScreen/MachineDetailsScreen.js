import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
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
                return (
                  <View style={{ marginBottom: 12 }}>
                    <Text style={styles.detailsText}>Required Resources:</Text>
                    {inputs.length === 0 ? (
                      <Text style={styles.detailsText}>None</Text>
                    ) : (
                      inputs.map(input => (
                        <Text key={input.item} style={styles.detailsText}>
                          {input.amount * amount} x {items[input.item]?.name || input.item} (You have: {inventory[input.item]?.currentAmount || 0})
                        </Text>
                      ))
                    )}
                    <Text style={styles.detailsText}>Expected Output:</Text>
                    <Text style={styles.detailsText}>
                      {output ? output.amount * amount : 0} x {output ? (items[output.item]?.name || output.item) : ''}
                    </Text>
                    <Text style={styles.detailsText}>Amount to craft:</Text>
                    <TextInput
                      style={{ backgroundColor: '#fff', color: '#222', borderRadius: 6, padding: 6, marginBottom: 8, width: 80 }}
                      keyboardType="numeric"
                      value={String(productAmount)}
                      onChangeText={val => setProductAmount(val.replace(/[^0-9]/g, ""))}
                    />
                    <TouchableOpacity
                      style={{
                        backgroundColor: canCraft ? '#27ae60' : '#aaa',
                        borderRadius: 6,
                        paddingVertical: 10,
                        paddingHorizontal: 24,
                        alignItems: 'center',
                        marginTop: 6,
                      }}
                      disabled={!canCraft}
                      onPress={() => {
                        if (selectedRecipe && canCraft) {
                          // Pass the full recipe object, not just the id
                          const success = craftItem(selectedRecipe, amount);
                          if (success) {
                            alert('Crafted successfully!');
                          } else {
                            alert('Crafting failed.');
                          }
                        }
                      }}
                    >
                      <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                        Craft {amount} {output ? (items[output.item]?.name || output.item) : ''}
                      </Text>
                    </TouchableOpacity>
                    {!canCraft && (
                      <Text style={{ color: '#e53935', marginTop: 4 }}>Not enough resources or invalid amount.</Text>
                    )}
                  </View>
                );
              })()}
            </View>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MachineDetailsScreen;
