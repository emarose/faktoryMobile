import React from 'react';
import { View } from 'react-native';
import { getNodeColor } from '../../../data/nodeTypes';

const NodeEntity = ({ position, nodeData, size = { width: 20, height: 20 } }) => {
  const color = getNodeColor(nodeData.type);
  
  return (
    <View
      style={{
        position: 'absolute',
        left: position.x - size.width / 2,
        top: position.y - size.height / 2,
        width: size.width,
        height: size.height,
        backgroundColor: color,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
      }}
    />
  );
};

export default NodeEntity;