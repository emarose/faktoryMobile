// In hooks/useInventory.js or a new hooks/useMapExploration.js
// For simplicity, let's add it to useInventory for now,
// or better, create a new useMapExploration.js for this specific concern.

// hooks/useMapExploration.js (New File)
import { useState, useCallback, useMemo } from "react";
import { items } from "../data/items"; // If needed for node definitions

const EXPLORATION_RADIUS = 150; // Pixels or game units

export const useMapExploration = (allResourceNodes) => {
  const [discoveredNodes, setDiscoveredNodes] = useState(() => {
    // Optionally, start with one or two nodes discovered for tutorial purposes
    const initialDiscovered = {};
    // Example: Discover ironNode1 and copperNode1 initially
    // if (allResourceNodes.length > 0) {
    //   initialDiscovered[allResourceNodes[0].id] = true;
    //   if (allResourceNodes.length > 1) {
    //     initialDiscovered[allResourceNodes[1].id] = true;
    //   }
    // }
    return initialDiscovered;
  });

  // Simulate player's current map position (e.g., center of screen, or a character's position)
  const [playerMapPosition, setPlayerMapPosition] = useState({ x: 0, y: 0 }); // Initial position

  const exploreArea = useCallback(
    (centerX, centerY) => {
      setPlayerMapPosition({ x: centerX, y: centerY });

      setDiscoveredNodes((prevDiscovered) => {
        const newDiscovered = { ...prevDiscovered };
        allResourceNodes.forEach((node) => {
          // Calculate distance between player position and node position
          const distance = Math.sqrt(
            Math.pow(node.x - centerX, 2) + Math.pow(node.y - centerY, 2)
          );
          if (distance <= EXPLORATION_RADIUS && !newDiscovered[node.id]) {
            newDiscovered[node.id] = true;
            console.log(`Discovered node: ${node.name} (${node.id})`);
          }
        });
        return newDiscovered;
      });
    },
    [allResourceNodes]
  );

  const getDiscoveredNodes = useCallback(() => {
    return allResourceNodes.filter((node) => discoveredNodes[node.id]);
  }, [allResourceNodes, discoveredNodes]);

  return {
    discoveredNodes, 
    playerMapPosition,
    exploreArea, 
    getDiscoveredNodes,
  };
};
