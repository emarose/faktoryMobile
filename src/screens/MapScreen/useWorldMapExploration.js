import { useMapExploration } from "../../hooks/useMapExploration";

import { useState } from "react";

export default function useWorldMapExploration(resourceNodes) {
  const {
    discoveredNodes,
    playerMapPosition,
    exploreArea,
    getDiscoveredNodes,
  } = useMapExploration(resourceNodes);

  // Track last explored direction for UI feedback
  const [lastDirection, setLastDirection] = useState(null);

  // Directions: 'up', 'down', 'left', 'right'
  const DIRECTION_OFFSETS = {
    up: { x: 0, y: -50 },
    down: { x: 0, y: 50 },
    left: { x: -50, y: 0 },
    right: { x: 50, y: 0 },
  };

  // Explore in a given direction from current position
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
  };
}
