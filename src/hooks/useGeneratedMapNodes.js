// /hooks/useMapNodes.js

import { useMemo, useState, useCallback, useEffect } from "react";
import { NODE_TYPES_MAP } from "../data/nodeTypes";
import { NODE_SPAWN_RATES, CHUNK_SIZE } from "../data/nodeGeneration";


// Generador determinista robusto (mulberry32)
function mulberry32(a) {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

function generateNodesForChunk(cx, cy, seed) {
  const nodes = [];
  // TEST SEED: fuerza todos los tipos de nodos en la primera fila del chunk central
  const TEST_SEED = 123456789;
  if (seed === TEST_SEED && cx === 0 && cy === 0) {
    const types = Object.entries(NODE_SPAWN_RATES);
    for (let x = 0; x < types.length && x < CHUNK_SIZE; x++) {
      const [type, data] = types[x];
      nodes.push({
        id: `${type}_${x}_0`,
        name: data.name,
        type: type,
        x: x,
        y: 0,
        capacity: data.capacity,
      });
    }
    // El resto del chunk se genera normalmente (sin nodos extra en la primera fila)
    for (let x = 0; x < CHUNK_SIZE; x++) {
      for (let y = 1; y < CHUNK_SIZE; y++) {
        const globalX = cx * CHUNK_SIZE + x;
        const globalY = cy * CHUNK_SIZE + y;
        const chunkSeed = ((seed & 0xFFFFF) ^ (cx * 73856093) ^ (cy * 19349663)) >>> 0;
        const cellSeed = (chunkSeed ^ (x * 83492791) ^ (y * 1234567)) >>> 0;
        const rand = mulberry32(cellSeed);
        const randValue = rand();
        const spawnChance = 0.05;
        if (randValue < spawnChance) {
          const totalRatio = Object.values(NODE_SPAWN_RATES).reduce((sum, rate) => sum + rate.ratio, 0);
          let currentRatio = 0;
          const typeRand = rand();
          for (const [type, data] of Object.entries(NODE_SPAWN_RATES)) {
            currentRatio += data.ratio;
            if (typeRand < currentRatio / totalRatio) {
              nodes.push({
                id: `${type}_${globalX}_${globalY}`,
                name: data.name,
                type: type,
                x: globalX,
                y: globalY,
                capacity: data.capacity,
              });
              break;
            }
          }
        }
      }
    }
    return nodes;
  }
  // Procedural normal para otros casos
  const chunkSeed = ((seed & 0xFFFFF) ^ (cx * 73856093) ^ (cy * 19349663)) >>> 0;
  for (let x = 0; x < CHUNK_SIZE; x++) {
    for (let y = 0; y < CHUNK_SIZE; y++) {
      const globalX = cx * CHUNK_SIZE + x;
      const globalY = cy * CHUNK_SIZE + y;
      const cellSeed = (chunkSeed ^ (x * 83492791) ^ (y * 1234567)) >>> 0;
      const rand = mulberry32(cellSeed);
      const randValue = rand();
      const spawnChance = 0.05;
      if (randValue < spawnChance) {
        const totalRatio = Object.values(NODE_SPAWN_RATES).reduce((sum, rate) => sum + rate.ratio, 0);
        let currentRatio = 0;
        const typeRand = rand();
        for (const [type, data] of Object.entries(NODE_SPAWN_RATES)) {
          currentRatio += data.ratio;
          if (typeRand < currentRatio / totalRatio) {
            nodes.push({
              id: `${type}_${globalX}_${globalY}`,
              name: data.name,
              type: type,
              x: globalX,
              y: globalY,
              capacity: data.capacity,
            });
            break;
          }
        }
      }
    }
  }
  return nodes;
}

export function useMapNodes(playerMapPosition) {
  const [allResourceNodes, setAllResourceNodes] = useState([]);
  // Usar un seed entero grande para mayor variabilidad
  const [seed, setSeedInternal] = useState(() => Math.floor(Math.random() * 1e9));
  
  // Expose setSeed to external components for save/load
  const setSeed = useCallback((newSeed) => {
    setSeedInternal(newSeed);
  }, []);

  useEffect(() => {
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

  // Función para regenerar el seed (nuevo seed entero grande)
  const regenerateSeed = useCallback(() => {
    setSeedInternal(Math.floor(Math.random() * 1e9));
  }, []);

  // Función para setear un seed de test fijo
  const setTestSeed = useCallback(() => {
    setSeedInternal(123456789); // Puedes ajustar este valor si quieres otro patrón
  }, []);

  return { 
    allResourceNodes, 
    NODE_TYPES_MAP, 
    regenerateSeed, 
    setTestSeed, 
    seed, 
    setSeed 
  };
}