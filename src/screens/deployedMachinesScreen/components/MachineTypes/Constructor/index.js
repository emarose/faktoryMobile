import React from "react";
import { View, TouchableOpacity } from "react-native";
import { items } from "../../../../../data/items";
import { useGame } from "../../../../../contexts/GameContext";
import styles from "../../MachineCard/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "../../../../../components";

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
      <View style={styles.marginVertical10}>
        <TouchableOpacity
          style={styles.assignNodeButton}
          onPress={onOpenModal}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons
            name="factory"
            size={28}
            color="#fff"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.assignNodeText}>
            {isProcessing ? "Change Recipe" : 
             liveMachine.currentRecipeId ? "Change Recipe" : "Assign Recipe"}
          </Text>
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