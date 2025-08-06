// /hooks/useWorldMapExploration.js

import { useState, useEffect } from "react";

const CHUNK_SIZE = 11; // Número de tiles por chunk (ancho y alto)
const TILE_SIZE = 30; // Tamaño en px de cada tile

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

  // Pin state managed here
  const [pinnedNodeId, setPinnedNodeId] = useState(null);
  const [isManualPin, setIsManualPin] = useState(false);

  // Move player
  const exploreDirection = (dir) => {
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
      // Reset manual pin on move
      setIsManualPin(false);
      return { x: newX, y: newY };
    });
  };

  // Discover nodes
  useEffect(() => {
    if (!setDiscoveredNodes) return;
    nodes.forEach((node) => {
      const dx = node.x - playerMapPosition.x;
      const dy = node.y - playerMapPosition.y;
      if (dx * dx + dy * dy <= tileRadius * tileRadius) {
        setDiscoveredNodes((prev) =>
          prev[node.id] ? prev : { ...prev, [node.id]: true }
        );
      }
    });
  }, [playerMapPosition, nodes, tileRadius, setDiscoveredNodes]);

  // Auto-pin logic (always overrides manual pin)
  useEffect(() => {
    let closestNodeId = null;
    let minDist = Infinity;
    nodes.forEach((node) => {
      if (discoveredNodes[node.id]) {
        const dx = (playerMapPosition.x - node.x) * TILE_SIZE;
        const dy = (playerMapPosition.y - node.y) * TILE_SIZE;
        const euclideanDist = Math.sqrt(dx * dx + dy * dy);
        if (euclideanDist <= discoveryRadiusPx && euclideanDist < minDist) {
          closestNodeId = node.id;
          minDist = euclideanDist;
        }
      }
    });
    if (closestNodeId && pinnedNodeId !== closestNodeId) {
      setPinnedNodeId(closestNodeId);
      setIsManualPin(false);
    } else if (!closestNodeId && pinnedNodeId) {
      setPinnedNodeId(null);
      setIsManualPin(false);
    }
  }, [
    playerMapPosition,
    nodes,
    discoveredNodes,
    pinnedNodeId,
    discoveryRadiusPx,
  ]);

  // Manual pin handler
  const manualPinNode = (nodeId) => {
    setPinnedNodeId(nodeId);
    setIsManualPin(true);
  };

  return {
    exploreDirection,
    pinnedNodeId,
    isManualPin,
    manualPinNode,
  };
}
