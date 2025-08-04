// NodeDetailScreen.js

import React from "react";
import { ScrollView, Text, StyleSheet } from "react-native";
import NodeCard from "../MapScreen/components/NodeCard/NodeCard";

export default function NodeDetailScreen({ route }) {
  const { node } = route.params;

  // Reemplaza con tus hooks/estados reales
  const inventory = {};
  const placedMachines = [];

  const onMineResource = (nodeId) => {
    console.log("Mining resource on node", nodeId);
    // TODO: implementar minería manual
  };

  const onPlaceMachine = (machineType, nodeId) => {
    console.log("Placing machine", machineType, "on node", nodeId);
    // TODO: implementar colocación de máquinas
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Detalle del Nodo</Text>
      <NodeCard
        node={node}
        inventory={inventory}
        placedMachines={placedMachines}
        onMineResource={onMineResource}
        onPlaceMachine={onPlaceMachine}
        styles={styles}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 20,
    marginBottom: 12,
    textAlign: "center",
  },
  // Puedes agregar más estilos para NodeCard aquí
});