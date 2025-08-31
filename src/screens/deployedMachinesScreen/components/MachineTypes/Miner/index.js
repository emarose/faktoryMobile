import React from "react";
import MachineCard from "../../MachineCard";
import { items } from "../../../../../data/items";
import RESOURCE_CAP from "../../../../../constants/ResourceCap";
import { useNavigation } from "@react-navigation/native";
import { useGame } from "../../../../../contexts/GameContext";

const Miner = ({ machine, node }) => {
  const navigation = useNavigation();
  const { pauseMiner, resumeMiner } = useGame();

  // Obtener el recurso que mina este miner
  const minedResource = node?.resourceType
    ? items[node.resourceType]
    : null;

  // Nombre a mostrar
  const displayName = items[machine.type]?.name || machine.type;

  // Estado de la máquina
  let statusText = "Idle";
  if (machine.isMining && minedResource) {
    statusText = `Mining ${minedResource.name}`;
  }

  // Progreso de minería (ejemplo, ajusta según tu modelo)
  const miningProgress = machine.progress || 0;

  return (
    <MachineCard
      machine={{ ...machine, statusText, displayName }}
      node={node}
      resourceCap={RESOURCE_CAP}
      onPress={() =>
        navigation.navigate("MachineDetailsScreen", {
          machine,
          node,
        })
      }
      onPauseResume={() =>
        machine.isIdle
          ? resumeMiner(machine.id)
          : pauseMiner(machine.id)
      }
      // Puedes pasar props adicionales para mostrar progreso, nodo, etc.
      miningProgress={miningProgress}
      minedResource={minedResource}
    >
      {/* Aquí puedes renderizar progreso y detalles del nodo */}
      <View style={{ marginTop: 8 }}>
        <Text style={{ color: "#fff" }}>
          Node: {node?.name || "None"}
        </Text>
        <Text style={{ color: "#fff" }}>
          Progress: {(miningProgress * 100).toFixed(0)}%
        </Text>
      </View>
    </MachineCard>
  );
};

export default Miner;