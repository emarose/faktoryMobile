// Simple standalone world generation for the game engine
// This doesn't use existing hooks to avoid conflicts

const TILE_SIZE = 30;

// Simple node types for testing
const SIMPLE_NODE_TYPES = [
  { type: 'iron', name: 'Iron Ore', color: '#d8dadb' },
  { type: 'copper', name: 'Copper Ore', color: '#b88333' },
  { type: 'coal', name: 'Coal', color: '#424040' },
];

// Simple deterministic world generator
function simpleNoise(x, y) {
  return (Math.sin(x * 0.1) * Math.cos(y * 0.1) + 1) / 2;
}

function generateTile(x, y) {
  const noise = simpleNoise(x, y);
  if (noise > 0.7) return 'stone';
  if (noise > 0.4) return 'dirt';
  return 'grass';
}

function shouldHaveNode(x, y) {
  const noise = simpleNoise(x * 1.3, y * 1.7);
  return noise > 0.85; // 15% chance roughly
}

function getNodeType(x, y) {
  const noise = simpleNoise(x * 2.1, y * 1.9);
  if (noise > 0.66) return SIMPLE_NODE_TYPES[2]; // coal
  if (noise > 0.33) return SIMPLE_NODE_TYPES[1]; // copper
  return SIMPLE_NODE_TYPES[0]; // iron
}

// Simple chunk-based world generator
export function generateWorld() {
  // Return a world object with utility functions
  return {
    seed: Date.now(), // Simple seed for consistency
    nodeTypes: SIMPLE_NODE_TYPES
  };
}

export function getVisibleChunks(playerGridPos, chunkRadius = 2) {
  const chunks = [];
  const chunkX = Math.floor(playerGridPos.x / 16);
  const chunkY = Math.floor(playerGridPos.y / 16);
  
  for (let dx = -chunkRadius; dx <= chunkRadius; dx++) {
    for (let dy = -chunkRadius; dy <= chunkRadius; dy++) {
      chunks.push({
        x: chunkX + dx,
        y: chunkY + dy
      });
    }
  }
  
  return chunks;
}

export function getChunkNodes(world, chunkCoord) {
  const nodes = [];
  const chunkStartX = chunkCoord.x * 16;
  const chunkStartY = chunkCoord.y * 16;
  
  // Generate nodes for this chunk
  for (let localX = 0; localX < 16; localX++) {
    for (let localY = 0; localY < 16; localY++) {
      const gridX = chunkStartX + localX;
      const gridY = chunkStartY + localY;
      
      if (shouldHaveNode(gridX, gridY)) {
        const nodeTypeData = getNodeType(gridX, gridY);
        nodes.push({
          x: gridX,
          y: gridY,
          type: nodeTypeData.type,
          name: nodeTypeData.name,
          color: nodeTypeData.color
        });
      }
    }
  }
  
  return nodes;
}

export function generateSimpleWorld(playerX, playerY, radius = 8) {
  const centerGridX = Math.floor(playerX / TILE_SIZE);
  const centerGridY = Math.floor(playerY / TILE_SIZE);
  
  const tiles = [];
  const nodes = [];
  
  for (let dx = -radius; dx <= radius; dx++) {
    for (let dy = -radius; dy <= radius; dy++) {
      const gridX = centerGridX + dx;
      const gridY = centerGridY + dy;
      
      // Generate tile
      const tileType = generateTile(gridX, gridY);
      tiles.push({
        id: `tile_${gridX}_${gridY}`,
        x: gridX * TILE_SIZE,
        y: gridY * TILE_SIZE,
        gridX,
        gridY,
        type: tileType
      });
      
      // Generate node if applicable
      if (shouldHaveNode(gridX, gridY)) {
        const nodeType = getNodeType(gridX, gridY);
        nodes.push({
          id: `node_${gridX}_${gridY}`,
          x: gridX * TILE_SIZE + TILE_SIZE / 2,
          y: gridY * TILE_SIZE + TILE_SIZE / 2,
          gridX,
          gridY,
          ...nodeType
        });
      }
    }
  }
  
  return { tiles, nodes };
}