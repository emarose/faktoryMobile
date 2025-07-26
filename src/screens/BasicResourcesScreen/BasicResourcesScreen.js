import React from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
// import { Image } from 'react-native';
import styles from "./styles";
import { useGame } from "../../contexts/GameContext";
import { SafeAreaView } from "react-native-safe-area-context";
import ResourceDisplay from "./components/ResourceDisplay/ResourceDisplay";

const BasicResourcesScreen = () => {
  const { mineableNodes, mineResource } = useGame();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Basic Resources</Text>
      <ScrollView style={styles.scrollViewContent}>
        {mineableNodes.length > 0 ? (
          mineableNodes.map((node) => (
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
              cap={1000}
            />
          ))
        ) : (
          <Text style={styles.noResourcesText}>
            No mineable resources to display.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BasicResourcesScreen;
