import React from "react";
import { View, Text, StyleSheet } from "react-native";

const PlayerInfoCard = ({ playerPosition, discoveredCount }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Player Info</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Position:</Text>
        <Text style={styles.value}>({playerPosition.x}, {playerPosition.y})</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Discovered Nodes:</Text>
        <Text style={styles.value}>{discoveredCount}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#222',
    borderRadius: 14,
    padding: 16,
    marginVertical: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#444',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 8,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    color: '#aaa',
    fontSize: 15,
    fontWeight: '600',
  },
  value: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default PlayerInfoCard;
