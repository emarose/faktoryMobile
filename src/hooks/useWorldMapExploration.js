import { useState, useEffect, useCallback, useMemo } from "react";

const CHUNK_SIZE = 11;
const TILE_SIZE = 30;

export default function useWorldMapExploration(
  nodes,
  discoveryRadiusPx,
  discoveredNodes,
  setDiscoveredNodes,
  playerMapPosition,
  setPlayerMapPosition,
  onMove
) {
  const tileRadius = Math.ceil(discoveryRadiusPx / TILE_SIZE);
  const [pinnedNodeId, setPinnedNodeId] = useState(null);
  const [isManualPin, setIsManualPin] = useState(false);

  // Memoize nodes in discovery range to avoid recalculating
  const nodesInRange = useMemo(() => {
    const radiusSquared = (tileRadius - 1) * (tileRadius - 1);
    return nodes.filter((node) => {
      const dx = node.x - playerMapPosition.x;
      const dy = node.y - playerMapPosition.y;
      return dx * dx + dy * dy <= radiusSquared;
    });
  }, [nodes, playerMapPosition.x, playerMapPosition.y, tileRadius]);

  // Debounced discovery to prevent rapid updates
  const [discoveryTimer, setDiscoveryTimer] = useState(null);

  const exploreDirection = useCallback((dir) => {
    setPlayerMapPosition((pos) => {
      const deltas = {
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
        right: { x: 1, y: 0 },
      };
      const delta = deltas[dir] || { x: 0, y: 0 };
      const newX = pos.x + delta.x;
      const newY = pos.y + delta.y;
      
      if (onMove) {
        onMove();
      }
      setIsManualPin(false);
      return { x: newX, y: newY };
    });
  }, [setPlayerMapPosition, onMove]);

  // Optimized discovery with debouncing and batching
  useEffect(() => {
    if (!setDiscoveredNodes || nodesInRange.length === 0) return;

    // Clear existing timer
    if (discoveryTimer) {
      clearTimeout(discoveryTimer);
    }

    // Debounce discovery updates
    const timer = setTimeout(() => {
      const undiscoveredNodes = nodesInRange.filter(node => !discoveredNodes[node.id]);
      
      if (undiscoveredNodes.length > 0) {
        // Batch update to prevent multiple renders
        setDiscoveredNodes((prev) => {
          const updated = { ...prev };
          undiscoveredNodes.forEach((node) => {
            updated[node.id] = true;
          });
          return updated;
        });
      }
    }, 50); // 50ms debounce

    setDiscoveryTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [nodesInRange, discoveredNodes, setDiscoveredNodes]);

  // Optimized auto-pin logic
  const closestDiscoveredNode = useMemo(() => {
    let closestNode = null;
    let minDist = Infinity;

    nodesInRange.forEach((node) => {
      if (discoveredNodes[node.id]) {
        const dx = (playerMapPosition.x - node.x) * TILE_SIZE;
        const dy = (playerMapPosition.y - node.y) * TILE_SIZE;
        const euclideanDist = Math.sqrt(dx * dx + dy * dy);
        
        if (euclideanDist <= discoveryRadiusPx && euclideanDist < minDist) {
          closestNode = node;
          minDist = euclideanDist;
        }
      }
    });

    return closestNode;
  }, [nodesInRange, discoveredNodes, playerMapPosition, discoveryRadiusPx]);

  // Update pinned node only when closest changes
  useEffect(() => {
    const newPinnedId = closestDiscoveredNode?.id || null;
    if (pinnedNodeId !== newPinnedId) {
      setPinnedNodeId(newPinnedId);
      setIsManualPin(false);
    }
  }, [closestDiscoveredNode, pinnedNodeId]);

  const manualPinNode = useCallback((nodeId) => {
    setPinnedNodeId(nodeId);
    setIsManualPin(true);
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (discoveryTimer) {
        clearTimeout(discoveryTimer);
      }
    };
  }, [discoveryTimer]);

  return {
    exploreDirection,
    pinnedNodeId,
    isManualPin,
    manualPinNode,
  };
}