import { View, ScrollView, TouchableOpacity } from "react-native";
import { Text, CustomHeader } from "../../components";
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
  const availableMachineTypes = ["All", ...Object.keys(machinesByType)];
  const [activeTab, setActiveTab] = useState("All");

  // Get machines for current tab
  const currentTabMachines = activeTab === "All" 
    ? allMachines 
    : machinesByType[activeTab] || [];

  // Machine type icons
  const getMachineTypeIcon = (typeName) => {
    if (typeName === "All") return '🏭';
    const icons = {
      'Miner': '⛏️',
      'Smelter': '🔥', 
      'Constructor': '🔧',
      'Assembler': '⚙️',
      'Foundry': '🏭',
      'Manufacturer': '🏗️',
      'Refinery': '⚗️',
      'Oil Extractor': '🛢️'
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
      <CustomHeader 
        title="Deployed Machines"
        rightIcon="plus-circle"
        onRightIconPress={() => navigation.navigate("BuildScreen")}
      />
      
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
                ({machineType === "All" ? allMachines.length : (machinesByType[machineType]?.length || 0)})
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
                      console.log("Pause/Resume clicked for machine:", machine.id, machine.type);
                      
                      if (machine.type === "miner" || machine.type === "oilExtractor") {
                        // Handle miners/extractors
                        console.log("Machine isIdle:", machine.isIdle);
                        machine.isIdle ? resumeMiner(machine.id, { user: true }) : pauseMiner(machine.id, { user: true });
                      } else {
                        // Handle crafting machines
                        const machineProcesses = craftingQueue.filter(
                          proc => proc.machineId === machine.id
                        );
                        console.log("Machine processes:", machineProcesses);
                        
                          // Determine the current process (pending or paused) for this machine
                          const currentProc = craftingQueue.find(
                            (proc) => proc.machineId === machine.id && (proc.status === 'pending' || proc.status === 'paused')
                          );

                          if (currentProc) {
                            if (currentProc.status === 'paused') {
                              console.log('Resuming crafting for machine:', machine.id, currentProc.id);
                              resumeCrafting(machine.id);
                            } else {
                              console.log('Pausing crafting for machine:', machine.id, currentProc.id);
                              pauseCrafting(machine.id);
                            }
                          } else {
                            console.log('No active or paused processes found for machine:', machine.id);
                          }
                      }
                    }}
                    onCancelCrafting={() => {
                      console.log("Cancel crafting clicked for machine:", machine.id, machine.type);
                      
                      if (machine.type !== "miner" && machine.type !== "oilExtractor") {
                        const machineProcesses = craftingQueue.filter(
                          proc => proc.machineId === machine.id
                        );
                        console.log("Cancelling processes:", machineProcesses);
                        cancelCrafting(machine.id);
                      } else {
                        console.log("Cannot cancel crafting for miner/oil extractor");
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
