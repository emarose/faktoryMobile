import React from 'react';
import { View } from 'react-native';

const Player = ({ position, size = { width: 24, height: 24 } }) => {
  return (
    <View
      style={{
        position: 'absolute',
        left: position.x - size.width / 2,
        top: position.y - size.height / 2,
        width: size.width,
        height: size.height,
        backgroundColor: '#4CAF50',
        borderRadius: size.width / 2,
        borderWidth: 2,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
      }}
    />
  );
};

export default Player;