import React from "react";
import { View, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getNodeColor } from "../../../../data/nodeTypes";
import Colors from "../../../../constants/Colors";
//import NodeCard from "../NodeCard";

const MapGrid = ({
  chunkSize,
  tileSize,
  visualPlayerPos,
  allResourceNodes,
  discoveredNodes,
  handleTilePress,
  navigation,
  pinnedNodeId,
}) => {
  
  const renderTiles = () => {
    const rows = [];
    const px = visualPlayerPos.x;
    const py = visualPlayerPos.y;
    const cx = Math.floor(px / chunkSize);
    const cy = Math.floor(py / chunkSize);

    // Para cada tile visible en la grilla
    for (let y = 0; y < chunkSize; y++) {
      const cols = [];
      for (let x = 0; x < chunkSize; x++) {
        const gx = cx * chunkSize + x;
        const gy = cy * chunkSize + y;
        const node = allResourceNodes.find((n) => n.x === gx && n.y === gy);

        const isPlayer = gx === px && gy === py;
        let color = Colors.background;
        let discovered = false;

        if (node && discoveredNodes[node.id]) {
          color = getNodeColor(node.type);
          discovered = true;
        }

        if (isPlayer) {
          cols.push(
            <View
              key={`${gx}-${gy}`}
              style={{
                width: tileSize,
                height: tileSize,
                backgroundColor: color,
                borderWidth: 1,
                borderColor: "#555",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                zIndex: 200,
              }}
            >
              <MaterialCommunityIcons
                name="account-circle"
                size={24}
                color="#FFD700"
              />
            </View>
          );
        } else if (node && discovered) {
          cols.push(
            <TouchableOpacity
              key={`${gx}-${gy}`}
              style={{
                width: tileSize,
                height: tileSize,
                backgroundColor: color,
                borderWidth: pinnedNodeId !== node.id ? 1 : 2,
                borderColor: pinnedNodeId !== node.id ? "#555" : "#FFD700",
                zIndex: 100,
              }}
              onPress={() => handleTilePress(node)}
            />
          );
        } else {
          cols.push(
            <View
              key={`${gx}-${gy}`}
              style={{
                width: tileSize,
                height: tileSize,
                backgroundColor: color,
                borderWidth: 1,
                borderColor: "#555",
              }}
            />
          );
        }
      }
      rows.push(
        <View key={`row-${y}`} style={{ flexDirection: "row" }}>
          {cols}
        </View>
      );
    }
    return rows;
  };

  return (
    <View
      style={{
        flexDirection: "column",
        width: tileSize * chunkSize,
        height: tileSize * chunkSize,
      }}
    >
      {renderTiles()}
    </View>
  );
};

export default React.memo(MapGrid);
