// Coordinate system utilities for game engine integration
export const TILE_SIZE = 30; // Keep consistent with existing MapGrid
export const VIEWPORT_WIDTH = 11; // tiles
export const VIEWPORT_HEIGHT = 11; // tiles

// Convert grid coordinates to pixel coordinates for game engine
export const gridToPixel = (gridPos) => ({
  x: gridPos.x * TILE_SIZE,
  y: gridPos.y * TILE_SIZE,
});

// Convert pixel coordinates back to grid coordinates
export const pixelToGrid = (pixelPos) => ({
  x: Math.floor(pixelPos.x / TILE_SIZE),
  y: Math.floor(pixelPos.y / TILE_SIZE),
});

// Get distance between two pixel positions
export const getPixelDistance = (pos1, pos2) => {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

// Clamp a value between min and max
export const clamp = (value, min, max) => {
  return Math.max(min, Math.min(max, value));
};

// Linear interpolation for smooth movement
export const lerp = (start, end, factor) => {
  return start + (end - start) * factor;
};