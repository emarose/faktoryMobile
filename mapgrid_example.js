import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const TILE_SIZE   = 30;
const CHUNK_SIZE  = 10;
const VIEW_SIZE   = CHUNK_SIZE;

const COLORS = {
  grass: '#a4d077',
  forest: '#4a773c',
  water: '#6ca0dc',
  player: 'red',
};

// Genera un chunk con tiles aleatorios
function generateChunk(cx, cy) {
  const tiles = [];
  for (let y = 0; y < CHUNK_SIZE; y++) {
    tiles[y] = [];
    for (let x = 0; x < CHUNK_SIZE; x++) {
        // this should be according to the idea of having the ore nodes coordinates, not random
        const rand = Math.random();
      const type = rand > 0.7 ? 'water' : rand > 0.4 ? 'forest' : 'grass';
      tiles[y][x] = { type };
    }
  }
  return { cx, cy, tiles };
}

export default function App() {
  const [player, setPlayer] = useState({ x: 0, y: 0 });
  const [chunks, setChunks] = useState({});

  // Cargar el chunk inicial
  useEffect(() => {
    const cx = Math.floor(player.x / CHUNK_SIZE);
    const cy = Math.floor(player.y / CHUNK_SIZE);
    const key = `${cx},${cy}`;
    if (!chunks[key]) {
      setChunks(prev => ({ ...prev, [key]: generateChunk(cx, cy) }));
    }
  }, []);

  const movePlayer = (dx, dy) => {
    const nx = player.x + dx;
    const ny = player.y + dy;

    const currentChunkX = Math.floor(player.x / CHUNK_SIZE);
    const currentChunkY = Math.floor(player.y / CHUNK_SIZE);
    const nextChunkX    = Math.floor(nx / CHUNK_SIZE);
    const nextChunkY    = Math.floor(ny / CHUNK_SIZE);

    // Si sigue en el mismo chunk, simplemente mover
    if (currentChunkX === nextChunkX && currentChunkY === nextChunkY) {
      setPlayer({ x: nx, y: ny });
      return;
    }

    // Si cambia de chunk, generar si no existe
    const nextKey = `${nextChunkX},${nextChunkY}`;
    if (!chunks[nextKey]) {
      setChunks(prev => ({ ...prev, [nextKey]: generateChunk(nextChunkX, nextChunkY) }));
    }

    // Reubicar al jugador al borde opuesto del nuevo chunk
    const localX = dx > 0 ? 0 : dx < 0 ? CHUNK_SIZE - 1 : nx % CHUNK_SIZE;
    const localY = dy > 0 ? 0 : dy < 0 ? CHUNK_SIZE - 1 : ny % CHUNK_SIZE;

    const newX = nextChunkX * CHUNK_SIZE + localX;
    const newY = nextChunkY * CHUNK_SIZE + localY;

    setPlayer({ x: newX, y: newY });
  };

  const renderTiles = () => {
    const tiles = [];

    const cx = Math.floor(player.x / CHUNK_SIZE);
    const cy = Math.floor(player.y / CHUNK_SIZE);
    const chunkKey = `${cx},${cy}`;
    const chunk = chunks[chunkKey];

    if (!chunk) return tiles;

    for (let y = 0; y < CHUNK_SIZE; y++) {
      for (let x = 0; x < CHUNK_SIZE; x++) {
        const gx = cx * CHUNK_SIZE + x;
        const gy = cy * CHUNK_SIZE + y;
        const isPlayer = gx === player.x && gy === player.y;
        const color = isPlayer ? COLORS.player : COLORS[chunk.tiles[y][x].type];

        tiles.push(
          <View
            key={`${gx}-${gy}`}
            style={{
              width: TILE_SIZE,
              height: TILE_SIZE,
              backgroundColor: color,
              borderWidth: 1,
              borderColor: '#999',
            }}
          />
        );
      }
    }

    return tiles;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.info}>Jugador: ({player.x}, {player.y})</Text>

      <View style={styles.grid}>
        {renderTiles()}
      </View>

      <View style={styles.controls}>
        <View style={styles.row}>
          <Button title="↑" onPress={() => movePlayer(0, -1)} />
        </View>
        <View style={styles.row}>
          <Button title="←" onPress={() => movePlayer(-1, 0)} />
          <View style={{ width: 20 }} />
          <Button title="→" onPress={() => movePlayer(1, 0)} />
        </View>
        <View style={styles.row}>
          <Button title="↓" onPress={() => movePlayer(0, 1)} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef',
    alignItems: 'center',
    paddingTop: 40,
  },
  info: {
    marginBottom: 10,
    fontSize: 16,
  },
  grid: {
    width: TILE_SIZE * VIEW_SIZE,
    height: TILE_SIZE * VIEW_SIZE,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#ccc',
  },
  controls: {
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
});