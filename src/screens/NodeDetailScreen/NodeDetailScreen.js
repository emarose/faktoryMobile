// NodeDetailScreen.js

import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Text } from "../../components";
import NodeCard from "../MapScreen/components/NodeCard/NodeCard";

export default function NodeDetailScreen({ route }) {
  const { node } = route.params;

  // Reemplaza con tus hooks/estados reales
  const inventory = {};
  const placedMachines = [];



  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Detalle del Nodo</Text>
      <NodeCard
        node={node}
        inventory={inventory}
        placedMachines={placedMachines}
        //onMineResource={onMineResource}
        //onPlaceMachine={onPlaceMachine}
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