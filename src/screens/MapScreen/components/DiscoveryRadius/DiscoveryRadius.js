import React from "react";
import { View } from "react-native";

const DiscoveryRadius = ({ 
  tileSize, 
  visualPlayerPos, 
  discoveryRadiusPx,
  chunkSize
}) => {
  const circleLeft = (((visualPlayerPos.x % chunkSize) + chunkSize) % chunkSize) *
    tileSize + tileSize / 2 - discoveryRadiusPx;
  const circleTop = (((visualPlayerPos.y % chunkSize) + chunkSize) % chunkSize) *
    tileSize + tileSize / 2 - discoveryRadiusPx;

  return (
    <View
      style={{
        position: "absolute",
        left: circleLeft,
        top: circleTop,
        width: discoveryRadiusPx * 2,
        height: discoveryRadiusPx * 2,
        borderRadius: discoveryRadiusPx,
        borderWidth: 2,
        borderColor: "#27ae60",
        opacity: 0.15,
        backgroundColor: "#27ae60",
        zIndex: 2,
      }}
    />
  );
};

export default React.memo(DiscoveryRadius);
