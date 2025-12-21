import { useMemo } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Image, Text } from "react-native";
import { useMachineColors } from "../../../hooks";
import { items } from "../../../data/items";
import { GameAssets } from "../../../components/AppLoader";

// Common machine icon helper - uses preloaded assets from GameAssets
export function getMachineIcon(type, color, size = 80) {
  // Map machine types to preloaded GameAssets
  const machineIcons = {
    smelter: GameAssets.icons.smelter,
    miner: GameAssets.icons.miner,
    constructor: GameAssets.icons.constructor,
    assembler: GameAssets.icons.assembler,
    manufacturer: GameAssets.icons.manufacturer,
    foundry: GameAssets.icons.foundry,
    refinery: GameAssets.icons.refinery,
    extractor: GameAssets.icons.extractor,
  };
  
  // Return image component for machine icon
  const iconSource = machineIcons[type] || GameAssets.icons.default;
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
