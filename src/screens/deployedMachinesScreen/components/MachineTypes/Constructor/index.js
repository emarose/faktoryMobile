import React from "react";
import { View, TouchableOpacity } from "react-native";
import { items } from "../../../../../data/items";
import { useGame } from "../../../../../contexts/GameContext";
import styles from "../../MachineCard/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "../../../../../components";
import Colors from "../../../../../constants/Colors";

const Constructor = ({ machine, onOpenModal }) => {
  const { placedMachines, craftingQueue } = useGame();

  const liveMachine =
    placedMachines.find((m) => m.id === machine.id) || machine;

  const recipe = liveMachine.currentRecipeId
    ? items[liveMachine.currentRecipeId]
    : null;

  // Check if machine is currently crafting
  const isProcessing = craftingQueue.some(
    (proc) => proc.machineId === machine.id && proc.status === "pending"
  );

  return (
    <>
      <View style={[styles.rowSpaceBetween, styles.marginVertical10]}>
        <View style={styles.machineIconContainer}>
          <MaterialCommunityIcons name="factory" size={28} color="#fff" />
        </View>
        <Text style={styles.machineName}>{machine.name}</Text>
        <TouchableOpacity
          onPress={onOpenModal}
          activeOpacity={0.85}
          style={{ padding: 6 }}
        >
          <MaterialCommunityIcons
            name={isProcessing || liveMachine.currentRecipeId ? "playlist-edit" : "plus-circle"}
            size={28}
            color={isProcessing || liveMachine.currentRecipeId ? "#fff" : Colors.accentGreen}
          />
        </TouchableOpacity>
      </View>
      {recipe && (
        <View>
          <Text style={{ color: "white" }}>Recipe: {recipe.name}</Text>
        </View>
      )}
    </>
  );
};

export default Constructor;