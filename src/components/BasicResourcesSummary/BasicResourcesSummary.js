import { View, Text, StyleSheet } from 'react-native';
import { useGame } from '../../contexts/GameContext';

const BasicResourcesSummary = () => {
  const { inventory } = useGame();

  // Define the basic raw materials you want to summarize here
  const basicRawMaterials = [
    'ironOre', 'copperOre', 'coal', 'limestone', 'oil'
  ];

  return (
    <View style={styles.summaryContainer}>
      {basicRawMaterials.map(resourceId => {
        const item = inventory[resourceId];
        if (!item || item.currentAmount === undefined) return null;

        return (
          <View key={item.id} style={styles.resourceLine}>
            <Text style={styles.resourceName}>{item.name}:</Text>
            <Text style={styles.resourceAmount}>{Math.floor(item.currentAmount)}</Text>
            {item.productionRate > 0 && (
              <Text style={styles.productionRate}> (+{item.productionRate.toFixed(1)}/s)</Text>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  summaryContainer: {
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  resourceLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  resourceName: {
    fontSize: 16,
    color: '#f0f0f0',
  },
  resourceAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#a0d911',
  },
  productionRate: {
    fontSize: 14,
    color: '#7FFF00', // Green for positive rates
    marginLeft: 5,
    fontStyle: 'italic',
  },
});

export default BasicResourcesSummary;