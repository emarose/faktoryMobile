import React, { useEffect } from 'react';
import { View, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';

// Sprite sheet configuration
// Sprite sheet: 576x384px total
// Each sprite: 64x64px with 32px spacing between them
// 6 columns x 4 rows
const SPRITE_SIZE = 64; // Size of each individual sprite
const SPRITE_SPACING = 32; // Spacing between sprites
const SPRITE_WIDTH = 576; // Total width of sprite sheet
const SPRITE_HEIGHT = 384; // Total height of sprite sheet
const FRAMES_PER_ROW = 6; // Number of frames in each animation row
const ROWS = 4; // Number of rows
const FRAME_WIDTH = SPRITE_SIZE + SPRITE_SPACING; // 96px (distance between frame origins)
const FRAME_HEIGHT = SPRITE_SIZE + SPRITE_SPACING; // 96px (distance between frame origins)
const ANIMATION_SPEED = 150; // Milliseconds per frame
const SPRITE_ZOOM = 2; // Zoom factor to make sprite larger (adjust this value to your preference)

// Map directions to sprite sheet rows
// Row 0: down, Row 1: left, Row 2: right, Row 3: up
const DIRECTION_TO_ROW = {
  down: 0,
  left: 1,
  right: 2,
  up: 3,
};

const PlayerSprite = ({ direction = 'down', size = 96 }) => {
  const frameIndex = useSharedValue(0);

  useEffect(() => {
    // Reset and restart animation when direction changes
    cancelAnimation(frameIndex);
    frameIndex.value = 0;

    // Animate through frames continuously
    frameIndex.value = withRepeat(
      withTiming(FRAMES_PER_ROW - 0.01, { // Stop just before 6 to avoid showing frame 6
        duration: ANIMATION_SPEED * FRAMES_PER_ROW,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [direction]);

  const row = DIRECTION_TO_ROW[direction] || 0;
  const scale = size / FRAME_WIDTH;
  const zoom = SPRITE_ZOOM;
  
  const scaledSpriteWidth = SPRITE_WIDTH * scale * zoom;
  const scaledSpriteHeight = SPRITE_HEIGHT * scale * zoom;
  const scaledFrameWidth = FRAME_WIDTH * scale * zoom;
  const scaledFrameHeight = FRAME_HEIGHT * scale * zoom;
  
  const offset = (size * (zoom - 1)) / 2;

  const animatedStyle = useAnimatedStyle(() => {
    // Use modulo to ensure we stay within 0-5 range and floor for discrete frames
    const currentFrame = Math.floor(frameIndex.value % FRAMES_PER_ROW);
    
    return {
      position: 'absolute',
      width: scaledSpriteWidth,
      height: scaledSpriteHeight,
      left: -currentFrame * scaledFrameWidth - offset,
      top: -row * scaledFrameHeight - offset,
    };
  });

  return (
    <View
      style={{
        width: size,
        height: size,
        overflow: 'hidden',
      }}
    >
      <Animated.Image
        source={require('../../../../../assets/images/player-sprite.png')}
        style={animatedStyle}
        resizeMode="cover"
      />
    </View>
  );
};

export default PlayerSprite;
