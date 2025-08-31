import React from "react";
import MachineCard from "../../MachineCard";
import { items } from "../../../../../data/items";
import RESOURCE_CAP from "../../../../../constants/ResourceCap";
import { useNavigation } from "@react-navigation/native";
import { useGame } from "../../../../../contexts/GameContext";

const Smelter = ({ machine, node }) => {
  const navigation = useNavigation();
  const { pauseMiner, resumeMiner } = useGame();

  // Obtener receta actual si existe
  const recipe = machine.currentRecipeId
    ? items[machine.currentRecipeId]
    : null;

  // Obtener nombre para mostrar
  const displayName = items[machine.type]?.name || machine.type;

  // Estado de la máquina
  let statusText = "Idle";
  if (machine.currentRecipeId && recipe && recipe.inputs) {
    statusText = `Processing ${recipe.name}`;
  }

  return (
    <MachineCard
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
    />
  );
};

export default Smelter;