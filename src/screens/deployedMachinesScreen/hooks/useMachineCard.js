import { useMemo } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Image, Text } from "react-native";
import { useMachineColors } from "../../../hooks";
import { items } from "../../../data/items";

// Common machine icon helper
export function getMachineIcon(type, color, size = 80) {
  // Define machine icon paths for all machine types
  const machineIcons = {
    smelter: require("../../../../assets/images/icons/smelter.png"),
    miner: require("../../../../assets/images/icons/smelter.png"), // TODO: Replace with actual miner icon
    constructor: require("../../../../assets/images/icons/smelter.png"), // TODO: Replace with actual constructor icon
    assembler: require("../../../../assets/images/icons/smelter.png"), // TODO: Replace with actual assembler icon
    manufacturer: require("../../../../assets/images/icons/smelter.png"), // TODO: Replace with actual manufacturer icon
    foundry: require("../../../../assets/images/icons/smelter.png"), // TODO: Replace with actual foundry icon
    refinery: require("../../../../assets/images/icons/smelter.png"), // TODO: Replace with actual refinery icon
    oilExtractor: require("../../../../assets/images/icons/smelter.png"), // TODO: Replace with actual oilExtractor icon
  };

  // Return image component for machine icon
  const iconSource = machineIcons[type] || machineIcons.smelter;
  return (
    <Image 
      source={iconSource} 
      style={{ width: size, height: size }} 
      resizeMode="contain"
    />
  );
}

// Base hook for common machine functionality
export default function useMachineCard(machine) {
  const { getMachineColor, getMachineColorWithOpacity } = useMachineColors();

  const machineData = useMemo(() => {
    const machineColor = getMachineColor(machine.type);
    const machineColorWithOpacity = getMachineColorWithOpacity(machine.type);
    const displayName = items[machine.type]?.name || machine.type;
    const icon = getMachineIcon(machine.type, machineColor);

    return {
      machineColor,
      machineColorWithOpacity,
      displayName,
      icon,
      type: machine.type,
      id: machine.id,
    };
  }, [machine, getMachineColor, getMachineColorWithOpacity]);

  return machineData;
}
