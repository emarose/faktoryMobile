import React from 'react';
import { View } from 'react-native';
import { Text } from '../../../components';

const SimpleNode = ({ node, zoomFactor = 1 }) => {
  const getNodeColor = (type) => {
    switch (type) {
      case 'iron': return '#CD7F32';
      case 'copper': return '#B87333';
      case 'coal': return '#36454F';
      case 'stone': return '#708090';
      default: return '#888888';
    }
  };

  const getNodeSymbol = (type) => {
    switch (type) {
      case 'iron': return 'Fe';
      case 'copper': return 'Cu';
      case 'coal': return 'C';
      case 'stone': return 'S';
      default: return '?';
    }
  };

  // Calculate size based on zoom - at max zoom (1.5), node should fill a 60px grid tile
  const baseSize = 60; // Grid tile size
  const nodeSize = Math.max(20, baseSize * zoomFactor); // Minimum 20px, scales with zoom
  const fontSize = Math.max(8, 12 * zoomFactor); // Scale text too
  const borderWidth = Math.max(1, 2 * zoomFactor); // Scale border

  return (
    <View
      style={{
        position: 'absolute',
        left: node.x - nodeSize / 2, // Center the node
        top: node.y - nodeSize / 2,
        width: nodeSize,
        height: nodeSize,
        backgroundColor: getNodeColor(node.type),
        borderWidth: borderWidth,
        borderColor: '#fff',
        borderRadius: nodeSize * 0.15, // Proportional border radius
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{
        fontSize: fontSize,
        color: '#fff',
        fontWeight: 'bold',
      }}>
        {getNodeSymbol(node.type)}
      </Text>
    </View>
  );
};

export default SimpleNode;