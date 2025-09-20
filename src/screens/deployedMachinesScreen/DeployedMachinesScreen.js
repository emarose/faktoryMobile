import { View, ScrollView, TouchableOpacity } from "react-native";
import { Text } from "../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import styles from "./styles";
import { items } from "../../data/items";
import { useGame } from "../../contexts/GameContext";
import { useNavigation } from "@react-navigation/native";
import RESOURCE_CAP from "../../constants/ResourceCap";
import MachineCard from "./components/MachineCard";
import Miner from "./components/MachineTypes/Miner";
import Smelter from "./components/MachineTypes/Smelter";
import Constructor from "./components/MachineTypes/Constructor";
import Colors from "../../constants/Colors";
import MachineGroup from "./components/MachineGroup";

const machineComponents = {
  miner: Miner,
  smelter: Smelter,
  constructor: Constructor,
};

const DeployedMachinesScreen = () => {
  const {
    placedMachines,
    ownedMachines,
    allResourceNodes = [],
    discoveredNodes = {},
    handleDepleteNode,
    inventory,
    nodeAmounts,
    pauseMiner,
    resumeMiner,
    craftingQueue,
    cancelCrafting,
    pauseCrafting,
    resumeCrafting,
  } = useGame();
  const navigation = useNavigation();

  const allMachines = [
    ...placedMachines,
    ...ownedMachines.filter((m) => !placedMachines.some((p) => p.id === m.id)),
  ];

  // Group all machines by type
  const machinesByType = allMachines.reduce((acc, machine) => {
    const typeName = items[machine.type]?.name || machine.type;
    if (!acc[typeName]) acc[typeName] = [];
    acc[typeName].push(machine);
    return acc;
  }, {});

  // Get available machine types (tabs)
  const availableMachineTypes = Object.keys(machinesByType);
  const [activeTab, setActiveTab] = useState(availableMachineTypes[0] || "All");

  // If activeTab doesn't exist in current machines, switch to first available
  if (!machinesByType[activeTab] && availableMachineTypes.length > 0) {
    setActiveTab(availableMachineTypes[0]);
  }

  // Get machines for current tab
  const currentTabMachines = machinesByType[activeTab] || [];

  // Machine type icons
  const getMachineTypeIcon = (typeName) => {
    const icons = {
      'miner': '⛏️',
      'smelter': '🔥', 
      'constructor': '🔧',
      'assembler': '⚙️',
      'foundry': '🏭',
      'manufacturer': '🏗️',
      'refinery': '⚗️',
      'oilExtractor': '🛢️'
    };
    return icons[typeName] || '🔧';
  };

  const getNodeInfo = (machine) => {
    const nodeId =
      machine.assignedNodeId || machine.nodeId || machine.nodeTargetId;
    if (!nodeId) return null;
    const baseNode = allResourceNodes.find(
      (n) => n.id === nodeId && discoveredNodes[n.id]
    );
    if (!baseNode) return null;
    const currentAmount =
      typeof nodeAmounts?.[nodeId] === "number"
        ? nodeAmounts[nodeId]
        : typeof baseNode.currentAmount === "number"
        ? baseNode.currentAmount
        : baseNode.capacity || 50;
    return { ...baseNode, currentAmount };
  };
/* TODO: NEEDS TO BE UPDATED AND BE SEPARATED ON THE DIFFERENT MACHINE TYPES */
  // Helper to get machine state (depletion aware)
  const getMachineStatusText = (machine, node) => {
    if (machine.type === "miner" || machine.type === "oilExtractor") {
      if (machine.isIdle) {
        if (node) {
          if (typeof node.currentAmount === "number" && node.currentAmount <= 0) {
            return `Depleted: ${node.name}`;
          }
          
          // Check if storage is full for this resource type
          const nodeDefinition = node && node.type ? items[node.type] : null;
          if (nodeDefinition && nodeDefinition.output) {
            const resourceId = Object.keys(nodeDefinition.output)[0];
            const currentAmount = inventory[resourceId]?.currentAmount || 0;
            if (currentAmount >= RESOURCE_CAP) {
              return `Storage Full: ${inventory[resourceId]?.name || resourceId}`;
            }
          }
        }
        return "Idle (Paused)";
      }
      
      if (node) {
        return `Extracting ${node.name}`;
      }
      return "Idle (Not placed)";
    }
    if (machine.currentRecipeId) {
      const recipe = items[machine.currentRecipeId];
      if (!recipe || !recipe.inputs) return "Invalid Recipe";
      return `Processing ${recipe.name}`;
    }
    return "Idle";
  };



  const deployedMachines = ownedMachines.filter((machine) =>
    Object.keys(machineComponents).includes(machine.type)
  );

  const getNodeForMachine = (machine) => {
    return machine.assignedNodeId
      ? allResourceNodes.find((node) => node.id === machine.assignedNodeId)
      : null;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Machine Type Tabs */}
      <View style={styles.filterTabsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabsContent}
        >
          {availableMachineTypes.map((machineType) => (
            <TouchableOpacity
              key={machineType}
              style={[
                styles.machineTab,
                activeTab === machineType && styles.machineTabActive
              ]}
              onPress={() => setActiveTab(machineType)}
            >
              <Text style={styles.machineTabIcon}>
                {getMachineTypeIcon(machineType)}
              </Text>
              <Text style={[
                styles.machineTabText,
                activeTab === machineType && styles.machineTabTextActive
              ]}>
                {machineType}
              </Text>
              <Text style={[
                styles.machineTabCount,
                activeTab === machineType && styles.machineTabCountActive
              ]}>
                ({machinesByType[machineType].length})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {currentTabMachines.length > 0 ? (
          <MachineGroup key={activeTab} typeName={activeTab}>
            {currentTabMachines.map((machine) => {
                const node = getNodeInfo(machine);
                const recipe = machine.currentRecipeId
                  ? items[machine.currentRecipeId]
                  : null;
                const statusText = getMachineStatusText(machine, node);
                const displayName = items[machine.type]?.name || machine.type;
                const SpecificMachineComponent = machineComponents[machine.type];
                return (
                  <MachineCard
                    key={machine.id}
                    machine={{ ...machine, statusText, displayName }}
                    node={node}
                    recipe={recipe}
                    resourceCap={RESOURCE_CAP}
                    navigation={navigation}
                   /*  onPress={() =>
                      navigation.navigate("MachineDetailsScreen", {
                        machine,
                        node,
                        recipe,
                      })
                    } */
                    onPauseResume={() => {
                      if (machine.type === "miner" || machine.type === "oilExtractor") {
                        // Handle miners/extractors
                        machine.isIdle ? resumeMiner(machine.id) : pauseMiner(machine.id);
                      } else {
                        // Handle crafting machines
                        const machineProcesses = craftingQueue.filter(
                          proc => proc.machineId === machine.id
                        );
                        const hasActiveProcesses = machineProcesses.some(proc => proc.status === "pending");
                        const hasPausedProcesses = machineProcesses.some(proc => proc.status === "paused");
                        
                        if (hasActiveProcesses) {
                          pauseCrafting(machine.id);
                        } else if (hasPausedProcesses) {
                          resumeCrafting(machine.id);
                        }
                      }
                    }}
                    onCancelCrafting={() => {
                      if (machine.type !== "miner" && machine.type !== "oilExtractor") {
                        cancelCrafting(machine.id);
                      }
                    }}
                  >
                    {SpecificMachineComponent && (
                      <SpecificMachineComponent machine={machine} node={node} navigation={navigation} />
                    )}
                  </MachineCard>
                );
              })}
            </MachineGroup>
        ) : (
          <Text style={styles.emptyStateText}>
            {activeTab === "All" 
              ? "No machines deployed or owned yet."
              : `No ${activeTab} machines found.`
            }
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DeployedMachinesScreen;
