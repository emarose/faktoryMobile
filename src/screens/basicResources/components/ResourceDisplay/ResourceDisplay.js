import { Text, View, TouchableOpacity } from "react-native";
import styles from "./styles";
import { useGame } from "../../../../contexts/GameContext";
import { items } from "../../../../data/items";

const ResourceDisplay = ({
  id,
  name,
  description,
  currentAmount,
  productionRate,
  outputItemName,
  hasMiner,
  canManualMine,
  onMinePress,
}) => {
  const { placeMachine } = useGame();

  const resourceTypeId = Object.keys(items).find(
    (key) => items[key].name === outputItemName
  );

  const displayName =
    items[resourceTypeId]?.displayName || outputItemName || "Item";
  const fetchedDescription =
    description ||
    items[resourceTypeId]?.description ||
    "No description available.";
  const machineType = items[resourceTypeId]?.machine;

  const handlePlaceMiner = () => {
    if (machineType) {
      placeMachine(machineType, id, resourceTypeId);
    } else {
      console.warn(`No machine type defined for resource: ${resourceTypeId}`);
    }
  };

  const handleUpgradeMiner = () => {
    console.log(`Attempting to upgrade miner on node: ${displayName}`);
    // TODO: implement upgradeMachine(id);
  };

  return (
    <View style={styles.resourceCard}>
      <View style={styles.resourceInfo}>
        <Text style={styles.resourceName}>{name}</Text>
        <Text style={styles.resourceDescription}>{fetchedDescription}</Text>

        <Text style={styles.resourceStats}>
          Your Inventory: {currentAmount} {displayName}
        </Text>

        <Text style={styles.resourceStats}>
          Automated Rate: +{productionRate}/s {displayName}
        </Text>

        {hasMiner && (
          <Text style={styles.resourceHint}>Miner Status: PLACED</Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        {canManualMine && (
          <TouchableOpacity style={styles.mineButton} onPress={onMinePress}>
            <Text style={styles.mineButtonText}>Manual Mine</Text>
          </TouchableOpacity>
        )}

        {!hasMiner && (
          <TouchableOpacity
            style={styles.placeMinerButton}
            onPress={handlePlaceMiner}
          >
            <Text style={styles.placeMinerButtonText}>Place Miner</Text>
          </TouchableOpacity>
        )}

        {hasMiner && (
          <TouchableOpacity
            style={styles.upgradeMinerButton}
            onPress={handleUpgradeMiner}
          >
            <Text style={styles.upgradeMinerButtonText}>Upgrade Miner</Text>
          </TouchableOpacity>
        )}

        {!canManualMine && !hasMiner && (
          <Text style={styles.resourceHint}>Requires a Miner to extract</Text>
        )}
      </View>
    </View>
  );
};

export default ResourceDisplay;
