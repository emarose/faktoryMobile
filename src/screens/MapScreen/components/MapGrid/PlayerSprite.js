import React, { useEffect } from 'react';
import { View } from 'react-native';
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
// Per row: 2 idle frames (0-1) + 4 walking frames (2-5)
const SPRITE_SIZE = 64; // Size of each individual sprite
const SPRITE_SPACING = 32; // Spacing between sprites
const SPRITE_WIDTH = 576; // Total width of sprite sheet
const SPRITE_HEIGHT = 384; // Total height of sprite sheet
const FRAMES_PER_ROW = 6; // Number of frames in each animation row
const IDLE_FRAMES = 2; // Frames 0-1 are idle
const WALK_FRAMES = 4; // Frames 2-5 are walking
const WALK_START_FRAME = 2; // Walking animation starts at frame 2
const ROWS = 4; // Number of rows
const FRAME_WIDTH = SPRITE_SIZE + SPRITE_SPACING; // 96px (distance between frame origins)
const FRAME_HEIGHT = SPRITE_SIZE + SPRITE_SPACING; // 96px (distance between frame origins)
const IDLE_ANIMATION_SPEED = 400; // Milliseconds per idle frame (slower)
const WALK_ANIMATION_SPEED = 100; // Milliseconds per walking frame
const SPRITE_ZOOM = 2; // Zoom factor to make sprite larger

// Map directions to sprite sheet rows
// Row 0: down, Row 1: left, Row 2: right, Row 3: up
const DIRECTION_TO_ROW = {
  down: 0,
  left: 1,
  right: 2,
  up: 3,
};

const PlayerSprite = ({ direction = 'down', size = 96, isMoving = false }) => {
  const frameIndex = useSharedValue(0);
  const currentRow = useSharedValue(DIRECTION_TO_ROW[direction] || 0);

  useEffect(() => {
    // Update direction instantly
    const newRow = DIRECTION_TO_ROW[direction] || 0;
    currentRow.value = newRow;
    
    // Reset and restart animation when movement state changes
    cancelAnimation(frameIndex);
    
    if (isMoving) {
      // Walking animation: frames 2-5 (4 frames)
      frameIndex.value = WALK_START_FRAME;
      frameIndex.value = withRepeat(
        withTiming(WALK_START_FRAME + WALK_FRAMES - 0.01, {
          duration: WALK_ANIMATION_SPEED * WALK_FRAMES,
          easing: Easing.linear,
        }),
        -1,
        false
      );
    } else {
      // Idle animation: frames 0-1 (2 frames)
      frameIndex.value = 0;
      frameIndex.value = withRepeat(
        withTiming(IDLE_FRAMES - 0.01, {
          duration: IDLE_ANIMATION_SPEED * IDLE_FRAMES,
          easing: Easing.linear,
        }),
        -1,
        false
      );
    }
  }, [direction, isMoving]);

  const scale = size / FRAME_WIDTH;
  const zoom = SPRITE_ZOOM;
  
  const scaledSpriteWidth = SPRITE_WIDTH * scale * zoom;
  const scaledSpriteHeight = SPRITE_HEIGHT * scale * zoom;
  const scaledFrameWidth = FRAME_WIDTH * scale * zoom;
  const scaledFrameHeight = FRAME_HEIGHT * scale * zoom;
  
  const offset = (size * (zoom - 1)) / 2;

  const animatedStyle = useAnimatedStyle(() => {
    // Calculate current frame based on animation range
    let currentFrame;
    if (isMoving) {
      // Walking: frames 2-5
      currentFrame = Math.floor(frameIndex.value % WALK_FRAMES) + WALK_START_FRAME;
    } else {
      // Idle: frames 0-1
      currentFrame = Math.floor(frameIndex.value % IDLE_FRAMES);
    }
    
    return {
      position: 'absolute',
      width: scaledSpriteWidth,
      height: scaledSpriteHeight,
      left: -currentFrame * scaledFrameWidth - offset,
      top: -currentRow.value * scaledFrameHeight - offset,
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
