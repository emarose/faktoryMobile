import React, { useEffect, useRef, useState } from 'react';
import { View, Image } from 'react-native';

// Sprite sheet configuration
const SPRITE_SIZE = 8; // Size of each frame in the sprite sheet
const FRAMES_PER_ROW = 4; // Number of frames in each animation row
const ANIMATION_SPEED = 150; // Milliseconds per frame

// Map directions to sprite sheet rows
const DIRECTION_TO_ROW = {
  left: 1,
  right: 0,
  down: 2,
  up: 3,
};

const PlayerSprite = ({ direction = 'down', size = 8 }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const animationInterval = useRef(null);
  const previousDirection = useRef(direction);

  useEffect(() => {
    // Only reset animation if direction actually changed
    if (previousDirection.current !== direction) {
      setCurrentFrame(0);
      previousDirection.current = direction;
    }

    // Clear any existing animation
    if (animationInterval.current) {
      clearInterval(animationInterval.current);
    }

    // Start animation loop
    animationInterval.current = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % FRAMES_PER_ROW);
    }, ANIMATION_SPEED);

    return () => {
      if (animationInterval.current) {
        clearInterval(animationInterval.current);
      }
    };
  }, [direction]);

  const row = DIRECTION_TO_ROW[direction] || 0;
  const scale = size / SPRITE_SIZE;
  
  // Calculate the scaled dimensions
  const spriteSheetWidth = SPRITE_SIZE * FRAMES_PER_ROW * scale;
  const spriteSheetHeight = SPRITE_SIZE * 4 * scale;

  return (
    <View
      style={{
        width: size,
        height: size,
        overflow: 'hidden',
      }}
    >
      <Image
        source={require('../../../../../assets/images/player-sprite.png')}
        style={{
          position: 'absolute',
          width: spriteSheetWidth,
          height: spriteSheetHeight,
          left: -currentFrame * size,
          top: -row * size,
        }}
      />
    </View>
  );
};

export default PlayerSprite;
