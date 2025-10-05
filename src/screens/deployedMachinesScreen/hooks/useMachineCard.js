import { useMemo } from 'react';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useMachineColors } from '../../../hooks';
import { items } from '../../../data/items';

// Common machine icon helper
export function getMachineIcon(type, color) {
  switch (type) {
    case "miner":
      return (
        <MaterialCommunityIcons
          name="robot-industrial"
          size={28}
          color={color}
        />
      );
    case "refinery":
      return (
        <MaterialCommunityIcons
          name="chemical-weapon"
          size={28}
          color={color}
        />
      );
    case "smelter":
      return <MaterialCommunityIcons name="factory" size={28} color={color} />;
    case "constructor":
      return <MaterialCommunityIcons name="cog" size={28} color={color} />;
    case "assembler":
      return <MaterialCommunityIcons name="wrench" size={28} color={color} />;
    case "manufacturer":
      return <MaterialCommunityIcons name="factory" size={28} color={color} />;
    case "foundry":
      return <MaterialCommunityIcons name="anvil" size={28} color={color} />;
    case "oilExtractor":
      return <MaterialCommunityIcons name="oil-lamp" size={28} color={color} />;
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