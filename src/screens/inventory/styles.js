// screens/inventory/styles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1a1a2e', // Consistent dark background
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e0e0e0',
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  inventoryItemCard: {
    backgroundColor: '#2a2a4a',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#4a4a6e',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#a0d911', // Greenish for item names
    marginBottom: 5,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemType: {
    fontSize: 14,
    color: '#cccccc',
    fontStyle: 'italic',
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f0f0f0',
  },
  emptyInventoryText: {
    fontSize: 16,
    color: '#aaaaaa',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default styles;