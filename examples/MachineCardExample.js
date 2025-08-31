import React from 'react';
import { View, StyleSheet } from 'react-native';
import MinerCard from '../MachineTypes/MinerCard';


// Si agregas nuevas máquinas, crea un archivo bajo ./machineTypes/ y regístralo aquí
const machineComponents = {
  miner: MinerCard,
  smelter: SmelterCard,
//...
};

const DefaultMachineCard = ({ machine }) => (
  <View style={styles.defaultContainer}>
    {/* Puedes personalizar la vista por defecto */}
  </View>
);

const MachineCard = ({ machine, node, onPress }) => {
  // Escoge el componente específico o el fallback
  const SpecificCard = machineComponents[machine.type] || DefaultMachineCard;

  return (
    <View style={styles.wrapper}>
      <SpecificCard
        machine={machine}
        node={node}
        onPress={onPress}
      />
    </View>
  );
};

export default MachineCard;

const styles = StyleSheet.create({
//styles...
});