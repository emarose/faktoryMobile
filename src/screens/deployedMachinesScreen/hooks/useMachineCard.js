import { useMemo } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Image, Text } from "react-native";
import { useMachineColors } from "../../../hooks";
import { items } from "../../../data/items";

// Common machine icon helper
export function getMachineIcon(type, color) {
  // Define machine icon paths
  const machineIcons = {
    smelter: require("../../../../assets/images/icons/smelter.png"),
    // Add more machine icons here as they become available
    // Example:
    // miner: require('../../../../assets/images/icons/miner.png'),
    // constructor: require('../../../../assets/images/icons/constructor.png'),
  };

  // If we have a specific icon for this machine type
  if (machineIcons[type]) {
    return (
      <Image source={machineIcons[type]} style={{ width: 80, height: 80 }} />
    );
  }

  // Fallbacks using emoji-style icons for machines without specific images yet
  switch (type) {
    case "miner":
      return <Text style={{ fontSize: 24, color }}>⛏️</Text>;
    case "refinery":
      return <Text style={{ fontSize: 24, color }}>⚗️</Text>;
    case "constructor":
      return <Text style={{ fontSize: 24, color }}>🔧</Text>;
    case "assembler":
      return <Text style={{ fontSize: 24, color }}>⚙️</Text>;
    case "manufacturer":
      return <Text style={{ fontSize: 24, color }}>🏭</Text>;
    case "foundry":
      return <Text style={{ fontSize: 24, color }}>🔥</Text>;
    case "oilExtractor":
      return <Text style={{ fontSize: 24, color }}>🛢️</Text>;
    default:
      return <MaterialIcons name="build" size={28} color={color || "#aaa"} />;
  }
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
