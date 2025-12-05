import { clamp, lerp, getPixelDistance } from '../../../utils/GameEngineUtils';

const MovementSystem = (entities, { targetPosition }) => {
  if (!entities.player) return entities;

  const player = entities.player;
  const speed = 4; // pixels per frame
  
  // Move towards target position if one is set
  if (targetPosition && player.targetPosition) {
    const distance = getPixelDistance(player.position, player.targetPosition);
    
    if (distance > 2) { // Close enough threshold
      // Calculate direction vector
      const dx = player.targetPosition.x - player.position.x;
      const dy = player.targetPosition.y - player.position.y;
      const normalizedDistance = Math.sqrt(dx * dx + dy * dy);
      
      // Move towards target
      player.position.x += (dx / normalizedDistance) * speed;
      player.position.y += (dy / normalizedDistance) * speed;
      
      // Update movement direction for animations
      player.direction = {
        x: dx > 0 ? 1 : dx < 0 ? -1 : 0,
        y: dy > 0 ? 1 : dy < 0 ? -1 : 0,
      };
      
      player.isMoving = true;
    } else {
      // Reached target
      player.targetPosition = null;
      player.isMoving = false;
    }
  } else {
    player.isMoving = false;
  }

  return entities;
};

export default MovementSystem;