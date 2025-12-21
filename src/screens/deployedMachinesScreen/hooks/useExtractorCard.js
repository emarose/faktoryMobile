import { useMemo } from 'react';
import { useGame } from '../../../contexts/GameContext';
import { useMachineColors } from '../../../hooks';
import { items } from '../../../data/items';
import { getNodeTypeDefinition } from '../../../data/nodeTypes';
import RESOURCE_CAP from '../../../constants/ResourceCap';

export default function useExtractorCard(machine) {
  const {
    placedMachines,
    allResourceNodes,
    discoveredNodes,
    nodeAmounts,
    pauseMiner,
    resumeMiner,
    detachMachine,
    inventory,
  } = useGame();

  const { getMachineColor } = useMachineColors();

  // Get the live machine state
  const liveMachine = useMemo(() => {
    return placedMachines.find((m) => m.id === machine.id) || machine;
  }, [placedMachines, machine]);

  // Get assigned node info
  const assignedNode = useMemo(() => {
    if (!liveMachine.assignedNodeId) return null;
    const node = allResourceNodes.find((n) => n.id === liveMachine.assignedNodeId);
    if (!node || !discoveredNodes[node.id]) return null;
    
    const currentAmount = nodeAmounts[node.id] ?? (node.capacity || 1000);
    return { ...node, currentAmount };
  }, [liveMachine.assignedNodeId, allResourceNodes, discoveredNodes, nodeAmounts]);

  // Calculate node depletion data
  const nodeDepletionData = useMemo(() => {
    if (!assignedNode) return null;

    try {
      const assignedMachines = placedMachines.filter(
        (m) =>
          m &&
          m.type === "extractor" &&
          m.assignedNodeId === assignedNode.id
      );

      const nodeCap = typeof assignedNode.capacity === "number" ? assignedNode.capacity : 1000;
      const currentAmount = assignedNode.currentAmount;
      const minedAmount = nodeCap - currentAmount;
      const depletionProgress = nodeCap > 0 ? (minedAmount / nodeCap) * 100 : 0;

      const activeMachines = assignedMachines.filter((m) => !m.isIdle);
      const totalMiningRate = activeMachines.reduce((total, m) => {
        const efficiency = m.efficiency || 1;
        return total + efficiency;
      }, 0);

      const timeToDepletionMinutes =
        totalMiningRate > 0 ? Math.ceil(currentAmount / (totalMiningRate * 60)) : Infinity;

      return {
        progress: Math.min(depletionProgress, 100),
        currentAmount,
        maxAmount: nodeCap,
        assignedCount: assignedMachines.length,
        activeCount: activeMachines.length,
        maxAllowed: 4,
        combinedRate: totalMiningRate,
        timeToDepletion: timeToDepletionMinutes,
        isDepleted: currentAmount <= 0,
        isNearDepletion: depletionProgress > 80,
        canAddMore: assignedMachines.length < 4,
      };
    } catch (err) {
      console.error("Extractor nodeDepletionData error:", err);
      return null;
    }
  }, [assignedNode, placedMachines]);

  // Calculate machine status
  const status = useMemo(() => {
    const isIdle = liveMachine.isIdle;
    let statusText = "Idle";
    let statusColor = "#666";

    if (isIdle) {
      if (assignedNode) {
        if (assignedNode.currentAmount <= 0) {
          statusText = `Depleted: ${assignedNode.name}`;
          statusColor = "#ff6b6b";
        } else {
          // Check if storage is full
          const nodeDefinition = assignedNode.type ? items[assignedNode.type] : null;
          if (nodeDefinition && nodeDefinition.output) {
            const resourceId = Object.keys(nodeDefinition.output)[0];
            const currentAmount = inventory[resourceId]?.currentAmount || 0;
            if (currentAmount >= RESOURCE_CAP) {
              statusText = `Storage Full: ${inventory[resourceId]?.name || resourceId}`;
              statusColor = "#ff9800";
            } else {
              statusText = "Idle (Paused)";
              statusColor = "#ff9800";
            }
          } else {
            statusText = "Idle (Paused)";
            statusColor = "#ff9800";
          }
        }
      } else {
        statusText = "Idle (Not assigned)";
        statusColor = "#666";
      }
    } else if (assignedNode) {
      statusText = `Extracting ${assignedNode.name}`;
      statusColor = "#4CAF50";
    }

    return {
      text: statusText,
      color: statusColor,
      isIdle,
      isActive: !isIdle && assignedNode,
      isDepleted: assignedNode?.currentAmount <= 0,
      isStorageFull: false, // TODO: implement storage full check
    };
  }, [liveMachine.isIdle, assignedNode, inventory]);

  // Action handlers
  const handlePauseResume = () => {
    if (status.isIdle) {
      resumeMiner(liveMachine.id, { user: true });
    } else {
      pauseMiner(liveMachine.id, { user: true });
    }
  };

  const handleDetachNode = () => {
    detachMachine(liveMachine.id);
  };

  return {
    liveMachine,
    assignedNode,
    nodeDepletionData,
    status,
    machineColor: getMachineColor(machine.type) || "#D76B00",
    displayName: items[machine.type]?.name || machine.type,
    actions: {
      handlePauseResume,
      handleDetachNode,
    },
  };
}