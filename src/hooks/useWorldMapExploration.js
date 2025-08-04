// /hooks/useWorldMapExploration.js

import { useState, useEffect } from "react";

const CHUNK_SIZE = 11;      // Número de tiles por chunk (ancho y alto)
const TILE_SIZE = 30;       // Tamaño en px de cada tile

export default function useWorldMapExploration(nodes, discoveryRadiusPx, discoveredNodes, setDiscoveredNodes) {
  // Posición inicial: centro del chunk 0,0
  const initialPos = {
    x: Math.floor(CHUNK_SIZE / 2),  
    y: Math.floor(CHUNK_SIZE / 2),
  };

  const [playerMapPosition, setPlayerMapPosition] = useState(initialPos);

  // Convertimos el radio de descubrimiento de px a tiles
  const tileRadius = Math.ceil(discoveryRadiusPx / TILE_SIZE);

  // Función para mover al jugador en la dirección indicada
  const exploreDirection = (dir) => {
    setPlayerMapPosition((pos) => {
      const deltas = {
        up:    { x:  0, y: -1 },
        down:  { x:  0, y:  1 },
        left:  { x: -1, y:  0 },
        right: { x:  1, y:  0 },
      };

      const delta = deltas[dir] || { x: 0, y: 0 };
      const newX = pos.x + delta.x;
      const newY = pos.y + delta.y;

      // Evitamos coordenadas negativas
      return {
        x: newX < 0 ? 0 : newX,
        y: newY < 0 ? 0 : newY,
      };
    });
  };

  // Cada vez que el jugador se mueve, descubrimos nodos dentro del radio
  useEffect(() => {
    if (!setDiscoveredNodes) return;
    nodes.forEach((node) => {
      const dx = node.x - playerMapPosition.x;
      const dy = node.y - playerMapPosition.y;

      // Comparamos distancia al cuadrado para evitar sqrt
      if (dx * dx + dy * dy <= tileRadius * tileRadius) {
        setDiscoveredNodes((prev) =>
          prev[node.id]
            ? prev
            : { ...prev, [node.id]: true }
        );
      }
    });
  }, [playerMapPosition, nodes, tileRadius, setDiscoveredNodes]);

  return {
    playerMapPosition,
    exploreDirection,
  };
}