import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useGame } from "../../contexts/GameContext";
import Miner from "./components/MachineTypes/Miner";
import Smelter from "./components/MachineTypes/Smelter";
import Colors from "../../constants/Colors";

const DeployedMachinesScreen = () => {
  const { ownedMachines, resourceNodes } = useGame();

  // Puedes ajustar este filtro según tu lógica de qué máquinas mostrar
  const deployedMachines = ownedMachines.filter(
    (machine) => machine.type === "miner" || machine.type === "smelter"
  );

  // Busca el nodo asignado a cada máquina (si aplica)
  const getNodeForMachine = (machine) =>
    resourceNodes.find((node) => node.id === machine.assignedNodeId);

  // Renderiza el componente adecuado según el tipo de máquina
  const renderMachine = (machine) => {
    const node = getNodeForMachine(machine);
    switch (machine.type) {
      case "miner":
        return <Miner key={machine.id} machine={machine} node={node} />;
      case "smelter":
        return <Smelter key={machine.id} machine={machine} node={node} />;
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {deployedMachines.map(renderMachine)}
        {deployedMachines.length === 0 && (
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Text style={{ color: "#bbb" }}>No machines deployed yet.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default DeployedMachinesScreen;