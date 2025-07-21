import React from 'react';
import { TouchableOpacity, Text, View, Image, StyleSheet } from 'react-native';
import { items } from '../../data/items'; // Assuming items is accessible like this, or pass it as prop

const MachineGridItem = ({ machineId, onPress }) => {
  const machine = items[machineId];
  if (!machine) {
    return null; // Or some placeholder if machine data is missing
  }

  // Placeholder for machine icon - you'd replace this with actual image paths
  // const icon = machine.icon || require('../../assets/icons/default_machine.png');

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(machineId)}>
      {/* <Image source={icon} style={styles.icon} /> */}
      <View style={styles.iconPlaceholder}>
        <Text style={styles.iconText}>{machine.name.charAt(0)}</Text>
      </View>
      <Text style={styles.name}>{machine.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '45%', // Roughly half width for 2 columns, adjust for spacing
    aspectRatio: 1, // Make it square
    margin: '2.5%', // Spacing between items
    backgroundColor: '#3a3a3a',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: 8,
    resizeMode: 'contain',
  },
  name: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default MachineGridItem;