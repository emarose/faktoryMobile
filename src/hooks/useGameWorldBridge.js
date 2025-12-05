import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useMining } from './useMining';

/**
 * Bridge hook to connect the GameWorldEngine with existing game logic
 */
export const useGameWorldBridge = (gameContext) => {
  // Extract needed values from game context
  const {
    allResourceNodes,
    discoveredNodes: contextDiscoveredNodes,
    setDiscoveredNodes, // Use setDiscoveredNodes instead of addDiscoveredNode
    inventory,
    placedMachines,
    addResource, // Use addResource instead of addResourceCallback
    setPlayerMapPosition // To sync player position with existing system
  } = gameContext;

  // Mining functionality
  const { mineResource } = useMining(
    addResource,
    allResourceNodes,
    placedMachines,
    inventory
  );

  // Player world position for chunk generation
  const [playerWorldPosition, setPlayerWorldPosition] = useState({ x: 0, y: 0 });
  
  // Force discover some nodes near spawn for testing
  useEffect(() => {
    if (allResourceNodes && allResourceNodes.length > 0) {
      const nearbyNodes = allResourceNodes.filter(node => {
        const distance = Math.sqrt(node.x * node.x + node.y * node.y);
        return distance <= 3; // Nodes within 3 tiles of spawn
      });
      
      if (nearbyNodes.length > 0) {
        const newDiscoveries = {};
        nearbyNodes.forEach(node => {
          if (!contextDiscoveredNodes[node.id]) {
            newDiscoveries[node.id] = true;
          }
        });
        
        if (Object.keys(newDiscoveries).length > 0) {
          console.log('Auto-discovering nearby nodes:', Object.keys(newDiscoveries));
          setDiscoveredNodes(prev => ({ ...prev, ...newDiscoveries }));
        }
      }
    }
  }, [allResourceNodes.length]); // Only run when nodes first load

  // Throttled position sync - only update when player moves significantly
  const lastSyncedPosition = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const gridX = Math.round(playerWorldPosition.x / 60);
    const gridY = Math.round(playerWorldPosition.y / 60);
    
    // Only sync if moved more than 2 tiles to avoid constant updates
    const distanceMoved = Math.abs(gridX - lastSyncedPosition.current.x) + 
                          Math.abs(gridY - lastSyncedPosition.current.y);
    
    if (distanceMoved >= 2) {
      lastSyncedPosition.current = { x: gridX, y: gridY };
      setPlayerMapPosition({ x: gridX, y: gridY });
    }
  }, [Math.floor(playerWorldPosition.x / 120), Math.floor(playerWorldPosition.y / 120), setPlayerMapPosition]); // Update less frequently

  // Convert discovered nodes from context (object) to Set for game engine
  const discoveredNodesSet = useMemo(() => {
    const nodeSet = new Set();
    if (contextDiscoveredNodes && typeof contextDiscoveredNodes === 'object') {
      Object.keys(contextDiscoveredNodes).forEach(nodeId => {
        // Extract grid coordinates from node ID or find in allResourceNodes
        const node = allResourceNodes.find(n => n.id === nodeId);
        if (node) {
          nodeSet.add(`${node.x}_${node.y}`);
        }
      });
    }
    return nodeSet;
  }, [contextDiscoveredNodes, allResourceNodes]);

  // Convert allResourceNodes to world coordinates - simplified and optimized
  const worldNodes = useMemo(() => {
    if (!allResourceNodes || allResourceNodes.length === 0) {
      return [];
    }

    // Convert all nodes to world coordinates once
    return allResourceNodes.map(node => ({
      id: node.id,
      worldX: node.x * 60, // Scale up for game engine visibility
      worldY: node.y * 60,
      gridX: node.x,
      gridY: node.y,
      type: node.type,
      name: node.name,
      capacity: node.capacity,
      originalNode: node // Keep reference to original node data
    }));
  }, [allResourceNodes]);

  // Get visible nodes for current player position
  const getWorldNodes = useCallback((playerGridPos, radius = 10) => {
    return worldNodes.filter(node => {
      const distance = Math.sqrt(
        Math.pow(node.gridX - playerGridPos.x, 2) + 
        Math.pow(node.gridY - playerGridPos.y, 2)
      );
      return distance <= radius;
    });
  }, [worldNodes]);

  // Discovery function that integrates with game context
  const discoverNode = useCallback((gridX, gridY) => {
    // Find the node at this grid position
    const node = allResourceNodes.find(n => n.x === gridX && n.y === gridY);
    if (node && !contextDiscoveredNodes[node.id]) {
      // Use the same pattern as MapScreen - merge with existing discoveries
      setDiscoveredNodes(prev => ({ ...prev, [node.id]: true }));
      return true;
    }
    return false;
  }, [allResourceNodes, contextDiscoveredNodes, setDiscoveredNodes]);

  // Mine resource at grid position
  const mineAtPosition = useCallback((gridX, gridY) => {
    const node = allResourceNodes.find(n => n.x === gridX && n.y === gridY);
    if (node && contextDiscoveredNodes[node.id]) {
      return mineResource(node.id);
    }
    return false;
  }, [allResourceNodes, contextDiscoveredNodes, mineResource]);

  return {
    // World state
    playerWorldPosition,
    setPlayerWorldPosition,
    
    // World generation
    getWorldNodes,
    
    // Discovery system
    discoveredNodesSet,
    discoverNode,
    
    // Mining system
    mineAtPosition,
    
    // Game context bridge
    inventory,
    allResourceNodes
  };
};

export default useGameWorldBridge;