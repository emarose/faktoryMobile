import React from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
// import { Image } from 'react-native';
import styles from "./styles";
import { useGame } from "../../contexts/GameContext";
import { SafeAreaView } from "react-native-safe-area-context";

import ResourceDisplay from "./components/ResourceDisplay/ResourceDisplay";
import RESOURCE_CAP from "../../constants/ResourceCap";
import useWorldMapExploration from "../../hooks/useWorldMapExploration";


const BasicResourcesScreen = () => {
  const { mineableNodes, mineResource, resourceNodes } = useGame();
  // Use the same exploration logic as MapScreen
  const { discoveredNodes } = useWorldMapExploration(resourceNodes);

  // Only show mineable nodes that have been discovered
  const discoveredMineableNodes = mineableNodes.filter((node) => discoveredNodes[node.id]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Basic Resources</Text>
      <ScrollView style={styles.scrollViewContent}>
        {discoveredMineableNodes.length > 0 ? (
          discoveredMineableNodes.map((node) => (
            <ResourceDisplay
              key={node.id}
              id={node.id}
              name={node.name}
              description={node.description}
              currentAmount={node.currentAmount}
              productionRate={node.productionRate}
              outputItemName={node.outputItemName}
              hasMiner={node.hasMiner}
              canManualMine={node.canManualMine}
              onMinePress={() => mineResource(node.id)}
              cap={RESOURCE_CAP}
            />
          ))
        ) : (
          <Text style={styles.noResourcesText}>
            No discovered mineable resources to display.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BasicResourcesScreen;
