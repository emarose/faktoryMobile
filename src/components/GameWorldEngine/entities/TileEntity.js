import React from 'react';
import { View } from 'react-native';

const TileEntity = ({ position, tileType, size = { width: 30, height: 30 } }) => {
  // Different tile colors for variety
  const getTileColor = (type) => {
    switch (type) {
      case 'grass': return '#2a5c2a';
      case 'dirt': return '#8B4513';
      case 'stone': return '#696969';
      case 'sand': return '#F4A460';
      default: return '#2a5c2a';
    }
  };

  return (
    <View
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        backgroundColor: getTileColor(tileType),
        borderWidth: 0.5,
        borderColor: 'rgba(0, 0, 0, 0.1)',
      }}
    />
  );
};

export default TileEntity;