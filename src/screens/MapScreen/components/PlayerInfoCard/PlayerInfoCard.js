import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const PlayerInfoCard = ({ playerPosition, discoveredCount }) => {
  return (
    <View style={styles.card}>
      <View style={styles.infoItem}>
        <MaterialIcons name="my-location" size={18} color="#FFD700" style={{ marginRight: 4, opacity: 0.7 }} />
        <Text style={styles.value}>({playerPosition.x}, {playerPosition.y})</Text>
      </View>
     {/*  <View style={styles.divider} />
      <View style={styles.infoItem}>
        <FontAwesome5 name="map-marker-alt" size={16} color="#27ae60" style={{ marginRight: 4 }} />
        <Text style={[styles.value, { color: '#27ae60' }]}>{discoveredCount}</Text>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23233a',
    borderRadius: 14,
    paddingVertical: 7,
    paddingHorizontal: 14,
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#333a4a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 2,
    elevation: 2,
    minHeight: 36,
    justifyContent: 'center',
    opacity: 0.93,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  divider: {
    width: 1.5,
    height: 22,
    backgroundColor: '#444',
    marginHorizontal: 8,
    borderRadius: 1,
    opacity: 0.6,
  },
  value: {
    color: '#e0e0e0',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.2,
  },
});

export default PlayerInfoCard;
