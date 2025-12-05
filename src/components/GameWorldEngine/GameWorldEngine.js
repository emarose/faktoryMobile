import React, { useState, useCallback, useEffect, useMemo, useContext } from 'react';
import { View, Dimensions, TouchableWithoutFeedback, Text } from 'react-native';
import Player from './entities/Player';
import SimpleTile from './components/SimpleTile';
import SimpleNode from './components/SimpleNode';
import { clamp, pixelToGrid } from '../../utils/GameEngineUtils';
import { GameContext } from '../../contexts/GameContext';
import useGameWorldBridge from '../../hooks/useGameWorldBridge';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const GameWorldEngine = ({ style }) => {
  // Get game context
  const gameContext = useContext(GameContext);
  
  // Bridge to existing game logic
  const {
    playerWorldPosition,
    setPlayerWorldPosition,
    getWorldNodes,
    discoveredNodesSet,
    discoverNode,
    mineAtPosition,
    inventory
  } = useGameWorldBridge(gameContext);
  
  const [targetWorldPosition, setTargetWorldPosition] = useState(null);
  
  // Zoom state
  const [zoomFactor, setZoomFactor] = useState(0.7);
  
  // Camera offset to follow player with zoom
  const cameraOffset = useMemo(() => {
    return {
      x: screenWidth / 2 - (playerWorldPosition.x * zoomFactor),
      y: screenHeight / 2 - (playerWorldPosition.y * zoomFactor)
    };
  }, [playerWorldPosition, zoomFactor]);
  
  // Zoom functions
  const zoomIn = useCallback(() => {
    setZoomFactor(prev => Math.min(prev + 0.1, 1.5)); // Max zoom in
  }, []);
  
  const zoomOut = useCallback(() => {
    setZoomFactor(prev => Math.max(prev - 0.1, 0.3)); // Max zoom out
  }, []);

  // Get real world nodes from game logic - optimized with less frequent updates
  const gameNodes = useMemo(() => {
    const playerGrid = {
      x: Math.round(playerWorldPosition.x / 60),
      y: Math.round(playerWorldPosition.y / 60)
    };
    return getWorldNodes(playerGrid, 8); // Larger radius for better coverage
  }, [Math.floor(playerWorldPosition.x / 180), Math.floor(playerWorldPosition.y / 180), getWorldNodes]); // Update every 3 tiles
  
  // Get only visible nodes (no tiles to render) with zoom
  const visibleNodes = useMemo(() => {
    return gameNodes.filter(node => {
      const screenX = (node.worldX * zoomFactor) + cameraOffset.x;
      const screenY = (node.worldY * zoomFactor) + cameraOffset.y;
      return screenX >= -60 && screenX <= screenWidth + 60 && 
             screenY >= -60 && screenY <= screenHeight + 60;
    });
  }, [gameNodes, cameraOffset, zoomFactor]);

  // Throttled discovery logic for better performance
  useEffect(() => {
    if (targetWorldPosition) return; // Don't check while moving
    
    const discoveryCheck = () => {
      const playerGrid = {
        x: Math.round(playerWorldPosition.x / 60),
        y: Math.round(playerWorldPosition.y / 60)
      };
      
      const DISCOVERY_RADIUS = 3; // Simplified radius in tiles
      
      // Use simpler discovery logic for performance
      gameNodes.forEach(node => {
        const dx = Math.abs(node.gridX - playerGrid.x);
        const dy = Math.abs(node.gridY - playerGrid.y);
        
        if (dx <= DISCOVERY_RADIUS && dy <= DISCOVERY_RADIUS) {
          discoverNode(node.gridX, node.gridY);
        }
      });
    };
    
    // Throttle discovery checks
    const timeoutId = setTimeout(discoveryCheck, 100);
    return () => clearTimeout(timeoutId);
  }, [targetWorldPosition, Math.floor(playerWorldPosition.x / 60), Math.floor(playerWorldPosition.y / 60), gameNodes, discoverNode]);

  // Simple movement animation loop in world coordinates
  useEffect(() => {
    if (!targetWorldPosition) return;

    const animate = () => {
      setPlayerWorldPosition(currentPos => {
        const dx = targetWorldPosition.x - currentPos.x;
        const dy = targetWorldPosition.y - currentPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 3) {
          // Reached target
          setTargetWorldPosition(null);
          return targetWorldPosition;
        }

        // Move towards target
        const speed = 4;
        const moveX = (dx / distance) * speed;
        const moveY = (dy / distance) * speed;

        return {
          x: currentPos.x + moveX,
          y: currentPos.y + moveY
        };
      });
    };

    const interval = setInterval(animate, 16); // ~60fps
    return () => clearInterval(interval);
  }, [targetWorldPosition]);

  const handleScreenTap = useCallback((event) => {
    const { locationX, locationY } = event.nativeEvent;
    
    // Calculate how far from center the tap is
    const centerX = screenWidth / 2;
    const centerY = screenHeight / 2;
    const deltaX = locationX - centerX;
    const deltaY = locationY - centerY;
    
    // Move player relative to current position
    const newWorldX = playerWorldPosition.x + deltaX;
    const newWorldY = playerWorldPosition.y + deltaY;
    
    console.log('Tap delta:', { deltaX, deltaY }, 'New world pos:', { x: newWorldX, y: newWorldY });
    setTargetWorldPosition({ x: newWorldX, y: newWorldY });
  }, [playerWorldPosition]);

  // Calculate player screen position (always centered)
  const playerScreenPosition = {
    x: screenWidth / 2,
    y: screenHeight / 2
  };

  return (
    <TouchableWithoutFeedback onPress={handleScreenTap}>
      <View style={[{ flex: 1, backgroundColor: '#0d2818' }, style]}>
        {/* Dynamic grid lines based on player position */}
        {(() => {
          const gridSize = 60;
          const gridLines = [];
          
          // Calculate which grid lines are visible
          const startGridX = Math.floor((-cameraOffset.x - gridSize) / gridSize);
          const endGridX = Math.ceil((screenWidth - cameraOffset.x) / gridSize);
          const startGridY = Math.floor((-cameraOffset.y - gridSize) / gridSize);
          const endGridY = Math.ceil((screenHeight - cameraOffset.y) / gridSize);
          
          // Vertical lines
          for (let i = startGridX; i <= endGridX; i++) {
            const lineX = i * gridSize + cameraOffset.x;
            if (lineX >= -2 && lineX <= screenWidth + 2) {
              gridLines.push(
                <View key={`v-${i}`} style={{
                  position: 'absolute',
                  left: lineX,
                  top: 0,
                  width: 1,
                  height: screenHeight,
                  backgroundColor: 'rgba(255, 255, 255, 0.08)'
                }} />
              );
            }
          }
          
          // Horizontal lines
          for (let i = startGridY; i <= endGridY; i++) {
            const lineY = i * gridSize + cameraOffset.y;
            if (lineY >= -2 && lineY <= screenHeight + 2) {
              gridLines.push(
                <View key={`h-${i}`} style={{
                  position: 'absolute',
                  left: 0,
                  top: lineY,
                  width: screenWidth,
                  height: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.08)'
                }} />
              );
            }
          }
          
          return gridLines;
        })()}
        
        {/* Render discovered nodes only with zoom */}
        {visibleNodes.map(node => {
          const nodeKey = `${node.gridX}_${node.gridY}`;
          const isDiscovered = discoveredNodesSet.has(nodeKey);
          
          // Debug: log first few nodes to see what's happening
          if (visibleNodes.indexOf(node) < 3) {
            console.log('Node:', node.id, 'Discovered:', isDiscovered, 'Key:', nodeKey, 'DiscoveredSet:', Array.from(discoveredNodesSet).slice(0, 5));
          }
          
          return isDiscovered ? (
            <TouchableWithoutFeedback 
              key={node.id}
              onPress={(e) => {
                e.stopPropagation();
                console.log('Mining node:', node.id);
                mineAtPosition(node.gridX, node.gridY);
              }}
            >
              <View>
                <SimpleNode 
                  zoomFactor={zoomFactor}
                  node={{
                    ...node,
                    x: (node.worldX * zoomFactor) + cameraOffset.x,
                    y: (node.worldY * zoomFactor) + cameraOffset.y
                  }} 
                />
              </View>
            </TouchableWithoutFeedback>
          ) : null;
        })}
        
        {/* Player rendering - always at screen center */}
        <Player position={playerScreenPosition} />
        
        {/* Target indicator in world coordinates with zoom */}
        {targetWorldPosition && (
          <View style={{
            position: 'absolute',
            left: (targetWorldPosition.x * zoomFactor + cameraOffset.x) - 10,
            top: (targetWorldPosition.y * zoomFactor + cameraOffset.y) - 10,
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: 'rgba(255, 255, 0, 0.7)',
            borderWidth: 2,
            borderColor: '#fff',
          }} />
        )}

        {/* Zoom Controls */}
        <View style={{
          position: 'absolute',
          right: 20,
          bottom: 100,
          flexDirection: 'column',
          gap: 10,
        }}>
          <TouchableWithoutFeedback onPress={zoomIn}>
            <View style={{
              width: 50,
              height: 50,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              borderRadius: 25,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 2,
              borderColor: 'rgba(255, 255, 255, 0.3)'
            }}>
              <Text style={{
                color: 'white',
                fontSize: 24,
                fontWeight: 'bold'
              }}>+</Text>
            </View>
          </TouchableWithoutFeedback>
          
          <TouchableWithoutFeedback onPress={zoomOut}>
            <View style={{
              width: 50,
              height: 50,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              borderRadius: 25,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 2,
              borderColor: 'rgba(255, 255, 255, 0.3)'
            }}>
              <Text style={{
                color: 'white',
                fontSize: 28,
                fontWeight: 'bold',
                marginTop: -3
              }}>−</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>

        {/* Simple UI Overlay */}
        <View style={{
          position: 'absolute',
          top: 50,
          left: 20,
          right: 20,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 15,
          borderRadius: 10,
        }}>
          <Text style={{
            color: 'white',
            fontSize: 16,
            textAlign: 'center',
            fontWeight: 'bold'
          }}>🎮 Game World</Text>
          <Text style={{
            color: 'white',
            fontSize: 12,
            textAlign: 'center',
            marginTop: 5
          }}>World: ({Math.round(playerWorldPosition.x)}, {Math.round(playerWorldPosition.y)})</Text>
          <Text style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: 12,
            textAlign: 'center',
            marginTop: 5
          }}>Zoom: {Math.round(zoomFactor * 100)}% • Discovered: {discoveredNodesSet.size} nodes</Text>
          <Text style={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: 10,
            textAlign: 'center',
            marginTop: 2
          }}>Nodes: {gameNodes.length} total, {visibleNodes.length} visible • Grid: {Math.round(playerWorldPosition.x / 60)}, {Math.round(playerWorldPosition.y / 60)}</Text>
          <Text style={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: 10,
            textAlign: 'center',
            marginTop: 2
          }}>Tap to move • Use +/- to zoom</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default GameWorldEngine;