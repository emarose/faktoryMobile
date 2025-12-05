import { gridToPixel, getPixelDistance, TILE_SIZE } from '../../../utils/GameEngineUtils';

const WorldGenerationSystem = (entities, { playerPosition }) => {
  if (!playerPosition) return entities;

  // Convert player pixel position to grid position  
  const playerGridX = Math.floor(playerPosition.x / TILE_SIZE);
  const playerGridY = Math.floor(playerPosition.y / TILE_SIZE);

  // Generate tiles around player (simple 11x11 grid for now)
  const tileRadius = 5;
  const newEntities = { ...entities };

  // Clear old tiles/nodes that are too far
  Object.keys(newEntities).forEach(key => {
    if (key.startsWith('tile_') || key.startsWith('node_')) {
      const entity = newEntities[key];
      if (entity.gridPosition) {
        const distance = Math.abs(entity.gridPosition.x - playerGridX) + Math.abs(entity.gridPosition.y - playerGridY);
        if (distance > tileRadius + 2) {
          delete newEntities[key];
        }
      }
    }
  });

  // Generate new tiles around player
  for (let dx = -tileRadius; dx <= tileRadius; dx++) {
    for (let dy = -tileRadius; dy <= tileRadius; dy++) {
      const gridX = playerGridX + dx;
      const gridY = playerGridY + dy;
      const tileKey = `tile_${gridX}_${gridY}`;

      if (!newEntities[tileKey]) {
        // Simple procedural tile type based on position
        const noise = Math.sin(gridX * 0.1) * Math.cos(gridY * 0.1);
        let tileType = 'grass';
        if (noise > 0.3) tileType = 'dirt';
        else if (noise < -0.3) tileType = 'stone';

        const pixelPos = gridToPixel({ x: gridX, y: gridY });
        
        newEntities[tileKey] = {
          gridPosition: { x: gridX, y: gridY },
          position: pixelPos,
          tileType,
          renderer: require('../entities/TileEntity').default,
        };
      }
    }
  }

  return newEntities;
};

export default WorldGenerationSystem;