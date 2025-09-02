import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { items } from "../../../../../data/items";
import { useGame } from "../../../../../contexts/GameContext";
import styles from "../../MachineCard/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Constructor = ({ machine, onOpenModal }) => {
  const { placedMachines } = useGame();

  const liveMachine =
    placedMachines.find((m) => m.id === machine.id) || machine;

  const recipe = liveMachine.currentRecipeId
    ? items[liveMachine.currentRecipeId]
    : null;

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
            {liveMachine.currentRecipeId ? "Change Recipe" : "Assign Recipe"}
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