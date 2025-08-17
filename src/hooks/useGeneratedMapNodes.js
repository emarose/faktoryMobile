// /hooks/useMapNodes.js

import { useMemo, useState } from "react";
import { NODE_TYPES_MAP } from "../data/nodeTypes";
import { NODE_SPAWN_RATES, CHUNK_SIZE } from "../data/nodeGeneration";

function seededRandom(seed) {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function generateNodesForChunk(cx, cy, seed) {
  const nodes = [];
  const combinedSeed = (cx + cy * 1000) * seed; // Usamos un seed combinado para unicidad

  // Iteramos sobre cada celda del chunk
  for (let x = 0; x < CHUNK_SIZE; x++) {
    for (let y = 0; y < CHUNK_SIZE; y++) {
      const globalX = cx * CHUNK_SIZE + x;
      const globalY = cy * CHUNK_SIZE + y;
      
      const tileSeed = combinedSeed + x + y * CHUNK_SIZE;
      const randValue = seededRandom(tileSeed); // Valor aleatorio determinista para la celda

      // Generamos un número aleatorio que determina si aparece un nodo
      const spawnChance = 0.05; // 5% de probabilidad base de que aparezca CUALQUIER nodo
      if (randValue < spawnChance) {
        // Si un nodo puede aparecer, determinamos qué tipo de nodo será
        const totalRatio = Object.values(NODE_SPAWN_RATES).reduce((sum, rate) => sum + rate.ratio, 0);
        let currentRatio = 0;
        const typeRand = seededRandom(tileSeed + 1); // Otro valor aleatorio para el tipo

        for (const [type, data] of Object.entries(NODE_SPAWN_RATES)) {
          currentRatio += data.ratio;
          if (typeRand < currentRatio / totalRatio) {
            nodes.push({
              id: `${type}_${globalX}_${globalY}`, // ID único
              name: data.name,
              type: type,
              x: globalX,
              y: globalY,
              capacity: data.capacity,
            });
            break; // Salir del bucle una vez que se ha elegido un tipo
          }
        }
      }
    }
  }
  return nodes;
}

export function useMapNodes(playerMapPosition) {
  const [allResourceNodes, setAllResourceNodes] = useState([]);
  const seed = useMemo(() => Math.random(), []); // Solo generamos un seed al inicio

  useMemo(() => {
    if (!playerMapPosition || typeof playerMapPosition.x !== 'number' || typeof playerMapPosition.y !== 'number') {
      setAllResourceNodes([]);
      return;
    }
    // Generamos los nodos para el chunk actual y los vecinos
    const cx = Math.floor(playerMapPosition.x / CHUNK_SIZE);
    const cy = Math.floor(playerMapPosition.y / CHUNK_SIZE);
    const nodesInView = [];
    // Generamos los chunks 3x3 alrededor del jugador para que no se vea vacío
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        nodesInView.push(...generateNodesForChunk(cx + i, cy + j, seed));
      }
    }
    setAllResourceNodes(nodesInView);
  }, [playerMapPosition, seed]);

  return { allResourceNodes, NODE_TYPES_MAP };
}