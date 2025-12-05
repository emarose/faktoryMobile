import { useState, useEffect, useContext } from 'react';
import { GameContext } from '../contexts/GameContext';
import { useMapNodes } from './useGeneratedMapNodes';
import { gridToPixel, pixelToGrid, TILE_SIZE } from '../utils/GameEngineUtils';

export const useGameWorld = (playerPosition) => {
  const { discoveredNodes = [] } = useContext(GameContext);
  const [worldEntities, setWorldEntities] = useState({});
  const [lastGridPos, setLastGridPos] = useState({ x: 0, y: 0 });
  
  // Convert player position to grid coordinates
  const playerGridPos = playerPosition ? pixelToGrid(playerPosition) : { x: 0, y: 0 };
  
  // Use your existing world generation hook
  const { allResourceNodes } = useMapNodes(playerGridPos);

  useEffect(() => {
    if (!playerPosition) return;

    // Only regenerate if player moved to a different grid tile
    if (lastGridPos.x === playerGridPos.x && lastGridPos.y === playerGridPos.y) {
      return;
    }
    
    setLastGridPos({ x: playerGridPos.x, y: playerGridPos.y });

    // Get nodes from the generation system
    const visibleNodes = allResourceNodes || [];
    
    // Convert to game engine entities
    const newEntities = {};
    
    // Add tiles (background)
    const tileRadius = 8;
    for (let dx = -tileRadius; dx <= tileRadius; dx++) {
      for (let dy = -tileRadius; dy <= tileRadius; dy++) {
        const gridX = playerGridPos.x + dx;
        const gridY = playerGridPos.y + dy;
        const tileKey = `tile_${gridX}_${gridY}`;
        
        // Simple procedural tile generation
        const noise = Math.sin(gridX * 0.1) * Math.cos(gridY * 0.1);
        let tileType = 'grass';
        if (noise > 0.3) tileType = 'dirt';
        else if (noise < -0.3) tileType = 'stone';
        
        const pixelPos = gridToPixel({ x: gridX, y: gridY });
        
        newEntities[tileKey] = {
          gridPosition: { x: gridX, y: gridY },
          position: pixelPos,
          tileType,
          renderer: 'TileEntity',
        };
      }
    }
    
    // Add resource nodes
    visibleNodes.forEach(node => {
      const nodeKey = `node_${node.x}_${node.y}`;
      const pixelPos = gridToPixel({ x: node.x, y: node.y });
      
      // Only show discovered nodes or nodes very close to player
      const distance = Math.abs(node.x - playerGridPos.x) + Math.abs(node.y - playerGridPos.y);
      const isDiscovered = Array.isArray(discoveredNodes) && discoveredNodes.some(d => d.x === node.x && d.y === node.y);
      
      if (isDiscovered || distance <= 2) {
        newEntities[nodeKey] = {
          gridPosition: { x: node.x, y: node.y },
          position: pixelPos,
          nodeData: node,
          renderer: 'NodeEntity',
        };
      }
    });
    
    setWorldEntities(newEntities);
  }, [playerGridPos.x, playerGridPos.y, discoveredNodes.length, allResourceNodes.length]);

  return worldEntities;
};