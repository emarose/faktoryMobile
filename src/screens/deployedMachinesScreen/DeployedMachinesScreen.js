import { Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";
import { items } from "../../data/items";
import { useGame } from "../../contexts/GameContext";
import { useNavigation } from "@react-navigation/native";
import RESOURCE_CAP from "../../constants/ResourceCap";
import MachineCard from "./components/MachineCard";
import Miner from "./components/MachineTypes/Miner";
import Smelter from "./components/MachineTypes/Smelter";
import Colors from "../../constants/Colors";
import MachineGroup from "./components/MachineGroup";

const machineComponents = {
  miner: Miner,
  smelter: Smelter,
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
  } = useGame();
  const navigation = useNavigation();
console.log(  placedMachines,
    ownedMachines,);

  const allMachines = [
    ...placedMachines,
    ...ownedMachines.filter((m) => !placedMachines.some((p) => p.id === m.id)),
  ];

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

  // Helper to get machine state (depletion aware)
  const getMachineStatusText = (machine, node) => {
    if (machine.type === "miner" || machine.type === "pump") {
      if (node) {
        if (typeof node.currentAmount === "number" && node.currentAmount <= 0)
          return `Depleted: ${node.name}`;
        if (
          typeof node.currentAmount === "number" &&
          node.currentAmount < (node.capacity || 50)
        ) {
          return `Extracting ${node.name}`;
        }
        if (
          typeof node.currentAmount === "number" &&
          node.currentAmount >= (node.capacity || 50)
        ) {
          return `Idle (Reached Cap)`;
        }
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

  // Group machines by type for better separation
  const machinesByType = allMachines.reduce((acc, machine) => {
    const typeName = items[machine.type]?.name || machine.type;
    if (!acc[typeName]) acc[typeName] = [];
    acc[typeName].push(machine);
    return acc;
  }, {});

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
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {Object.keys(machinesByType).length > 0 ? (
          Object.keys(machinesByType).map((typeName) => (
            <MachineGroup key={typeName} typeName={typeName}>
              {machinesByType[typeName].map((machine) => {
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
                    onPress={() =>
                      navigation.navigate("MachineDetailsScreen", {
                        machine,
                        node,
                        recipe,
                      })
                    }
                    onPauseResume={() =>
                      machine.isIdle
                        ? resumeMiner(machine.id)
                        : pauseMiner(machine.id)
                    }
                  >
                    {SpecificMachineComponent && (
                      <SpecificMachineComponent machine={machine} node={node} />
                    )}
                  </MachineCard>
                );
              })}
            </MachineGroup>
          ))
        ) : (
          <Text style={styles.emptyStateText}>
            No machines deployed or owned yet.
          </Text>
        )}
        {deployedMachines.length === 0 && (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No deployed machines of this type. Consider placing some!
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DeployedMachinesScreen;
