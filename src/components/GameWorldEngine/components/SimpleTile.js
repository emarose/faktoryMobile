import React from 'react';
import { View } from 'react-native';

const SimpleTile = ({ tile }) => {
  const getTileColor = (type) => {
    switch (type) {
      case 'grass': return '#2a5c2a';
      case 'dirt': return '#8B4513';
      case 'stone': return '#696969';
      default: return '#2a5c2a';
    }
  };

  return (
    <View
      style={{
        position: 'absolute',
        left: tile.x,
        top: tile.y,
        width: 30,
        height: 30,
        backgroundColor: getTileColor(tile.type),
        borderWidth: 0.5,
        borderColor: 'rgba(0, 0, 0, 0.1)',
      }}
    />
  );
};

export default SimpleTile;