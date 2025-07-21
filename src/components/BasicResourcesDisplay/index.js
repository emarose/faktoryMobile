import { View, Text } from "react-native";
import { useGame } from "../../contexts/GameContext";
import styles from "./styles";

const BasicResourcesSummary = () => {
  const { inventory } = useGame();
  const summaryResourceIds = ["ironOre", "copperOre", "coal", "limestone"];

  return (
    <View style={styles.container}>
      {summaryResourceIds.map((resourceId) => {
        const item = inventory[resourceId];
        const currentAmount = item?.currentAmount ?? 0;
        if (!item) return null;

        return (
          <View key={resourceId} style={styles.resourceLine}>
            <Text style={styles.resourceName}>{item.name}:</Text>
            <Text style={styles.resourceAmount}>
              {Math.floor(currentAmount)}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default BasicResourcesSummary;
