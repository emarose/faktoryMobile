// components/MachineAssemblyPanel/styles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  machinePanel: {
    backgroundColor: '#3a3a5a', // Darker background than recipes, but lighter than screen
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 7,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#5a5a7a',
  },
  machineTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e0e0e0',
    textAlign: 'center',
    marginBottom: 5,
  },
  machineSubtitle: {
    fontSize: 16,
    color: '#a0a0a0',
    textAlign: 'center',
    marginBottom: 15,
  },
  noRecipesText: {
    color: '#a0a0a0',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 10,
  },
});

export default styles;