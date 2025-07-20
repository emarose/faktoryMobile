// components/ResourceDisplay/ResourceDisplay.js (or wherever it's located)
import React from 'react';
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
// Make sure to import Image if you're using icons in ResourceDisplay
// import { Image } from 'react-native';
import styles from "./styles"; // Assuming styles are in the same directory or a subfolder
import { useGame } from '../../contexts/GameContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const ResourceDisplay = ({
  name,
  description,
  currentAmount, // This is now the inventory amount of the output item
  productionRate, // This is the automated rate from placed miners
  outputItemName, // Name of the resource this node produces
  onMinePress,
  hasMiner,      // New prop: boolean indicating if a miner is on this node
  canManualMine, // New prop: boolean if it can be manually mined
}) => {
  // Ensure numeric values are safe before calling toFixed or Math.floor
  const displayCurrentAmount = typeof currentAmount === 'number' ? Math.floor(currentAmount) : 0;
  const displayProductionRate = typeof productionRate === 'number' ? productionRate.toFixed(1) : '0.0';

  return (
    <View style={styles.resourceCard}>
      <View style={styles.resourceInfo}>
        <Text style={styles.resourceName}>{name}</Text>
        <Text style={styles.resourceDescription}>{description}</Text>
        {/* Display the inventory amount of the *output* item */}
        <Text style={styles.resourceStats}>
          Your Inventory: {displayCurrentAmount} {outputItemName || 'items'}
        </Text>
        {/* Display the automated production rate if any */}
        <Text style={styles.resourceStats}>
          Automated Rate: +{displayProductionRate}/s {outputItemName || 'items'}
        </Text>
        {hasMiner && <Text style={styles.resourceStats}>Miner: PLACED</Text>}
      </View>
      {canManualMine && ( // Only show manual mine button if node is manually mineable
        <TouchableOpacity style={styles.mineButton} onPress={onMinePress}>
          <Text style={styles.mineButtonText}>Manual Mine</Text>
        </TouchableOpacity>
      )}
      {!canManualMine && !hasMiner && ( // If not manual and no miner, hint about machine required
        <Text style={styles.resourceHint}>Requires a Miner to extract</Text>
      )}
    </View>
  );
};

// This component remains the same, but now passes the correct props
const BasicResourcesScreen = () => {
  const { mineableNodes, mineResource } = useGame();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Mineable Raw Materials</Text>
      <ScrollView style={styles.scrollViewContent}>
        {mineableNodes.length > 0 ? (
          mineableNodes.map((node) => (
            <ResourceDisplay
              key={node.id}
              name={node.name}
              description={node.description}
              // Pass the new enriched properties from mineableNodes
              currentAmount={node.currentAmount}
              productionRate={node.productionRate}
              outputItemName={node.outputItemName}
              hasMiner={node.hasMiner}
              canManualMine={node.canManualMine}
              onMinePress={() => mineResource(node.id)}
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