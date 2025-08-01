import { useState, useContext, useEffect } from "react";
import { GameContext } from "../contexts/GameContext";

export default function useWorldMapExploration(resourceNodes) {
  const gameContext = useContext(GameContext);
  if (!gameContext) {
    throw new Error("useWorldMapExploration must be used within a GameProvider");
  }
  const {
    playerMapPosition,
    setPlayerMapPosition,
    discoveredNodes,
    setDiscoveredNodes,
  } = gameContext;

  // Directions: 'up', 'down', 'left', 'right'
  const DIRECTION_OFFSETS = {
    up: { x: 0, y: -50 },
    down: { x: 0, y: 50 },
    left: { x: -50, y: 0 },
    right: { x: 50, y: 0 },
  };

  // Explore in a given direction from current position
  const [lastDirection, setLastDirection] = useState(null);
  const [discoveredNodesScout, setDiscoveredNodesScout] = useState({});
  const [discoveredCount, setDiscoveredCount] = useState(0);

  const exploreArea = (centerX, centerY) => {
    setPlayerMapPosition({ x: centerX, y: centerY });
    setDiscoveredNodes((prevDiscovered) => {
      const newDiscovered = { ...prevDiscovered };

      resourceNodes.forEach((node) => {
        const distance = Math.sqrt(
          Math.pow(node.x - centerX, 2) + Math.pow(node.y - centerY, 2)
        );
        if (distance <= 150 && !newDiscovered[node.id]) {
          newDiscovered[node.id] = true;
        }
      });

      setDiscoveredCount(Object.keys(newDiscovered).length);
      return newDiscovered;
    });
  };

  const getDiscoveredNodes = () => {
    return resourceNodes.filter((node) => discoveredNodes[node.id]);
  };

  const exploreDirection = (direction) => {
    const offset = DIRECTION_OFFSETS[direction];
    if (!offset) return;
    const newX = playerMapPosition.x + offset.x;
    const newY = playerMapPosition.y + offset.y;
    exploreArea(newX, newY);
    setLastDirection(direction);
  };

  return {
    discoveredNodes,
    playerMapPosition,
    exploreArea,
    getDiscoveredNodes,
    exploreDirection,
    lastDirection,
    discoveredNodesScout,
    setDiscoveredNodesScout,
    discoveredCount,
  };
}
