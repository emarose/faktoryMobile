import { useMemo } from "react";
// Map grid and coordinate logic

export function useMapGrid({ screenWidth }) {
  const HALF_WORLD_EXTENT = 300;
  const WORLD_MIN_X = -HALF_WORLD_EXTENT;
  const WORLD_MAX_X = HALF_WORLD_EXTENT;
  const WORLD_MIN_Y = -HALF_WORLD_EXTENT;
  const WORLD_MAX_Y = HALF_WORLD_EXTENT;
  const MAP_WIDTH_GAME_UNITS = WORLD_MAX_X - WORLD_MIN_X;
  const MAP_HEIGHT_GAME_UNITS = WORLD_MAX_Y - WORLD_MIN_Y;
  const MAP_DISPLAY_SIZE = screenWidth * 0.75;
  const PLAYER_DISPLAY_X = MAP_DISPLAY_SIZE / 2;
  const PLAYER_DISPLAY_Y = MAP_DISPLAY_SIZE / 2;
  const currentPlayerGameX = 0;
  const currentPlayerGameY = 0;
  const offsetX =
    PLAYER_DISPLAY_X -
    ((currentPlayerGameX - WORLD_MIN_X) / MAP_WIDTH_GAME_UNITS) *
      MAP_DISPLAY_SIZE;
  const offsetY =
    PLAYER_DISPLAY_Y -
    ((currentPlayerGameY - WORLD_MIN_Y) / MAP_HEIGHT_GAME_UNITS) *
      MAP_DISPLAY_SIZE;
  const GRID_SPACING = 50;

  const getDisplayCoords = (gameX, gameY) => {
    const scaledX =
      ((gameX - WORLD_MIN_X) / MAP_WIDTH_GAME_UNITS) * MAP_DISPLAY_SIZE;
    const scaledY =
      ((gameY - WORLD_MIN_Y) / MAP_HEIGHT_GAME_UNITS) * MAP_DISPLAY_SIZE;
    return {
      x: scaledX + offsetX,
      y: scaledY + offsetY,
    };
  };

  const gridLines = useMemo(() => {
    const lines = [];
    for (let x = WORLD_MIN_X; x <= WORLD_MAX_X; x += GRID_SPACING) {
      const { x: displayX } = getDisplayCoords(x, WORLD_MIN_Y);
      lines.push({ type: "vertical", x: displayX, label: x });
    }
    for (let y = WORLD_MIN_Y; y <= WORLD_MAX_Y; y += GRID_SPACING) {
      const { y: displayY } = getDisplayCoords(WORLD_MIN_X, y);
      lines.push({ type: "horizontal", y: displayY, label: y });
    }
    return lines;
  }, [
    MAP_DISPLAY_SIZE,
    WORLD_MIN_X,
    WORLD_MAX_X,
    WORLD_MIN_Y,
    WORLD_MAX_Y,
    GRID_SPACING,
    offsetX,
    offsetY,
  ]);

  return {
    HALF_WORLD_EXTENT,
    WORLD_MIN_X,
    WORLD_MAX_X,
    WORLD_MIN_Y,
    WORLD_MAX_Y,
    MAP_WIDTH_GAME_UNITS,
    MAP_HEIGHT_GAME_UNITS,
    MAP_DISPLAY_SIZE,
    PLAYER_DISPLAY_X,
    PLAYER_DISPLAY_Y,
    currentPlayerGameX,
    currentPlayerGameY,
    offsetX,
    offsetY,
    GRID_SPACING,
    getDisplayCoords,
    gridLines,
  };
}
