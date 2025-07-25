import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2a', // Dark background for the whole screen
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    paddingVertical: 20,
    marginTop: 10, // Adjust for SafeAreaView
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  emptyStateText: {
    color: '#b0b0b0',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  machineGroup: {
    marginBottom: 20, // Space between different machine type groups
  },
  groupTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#a0d911', // Green for group titles
    marginBottom: 10,
    marginLeft: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#444455',
    paddingBottom: 5,
  },
  machineCard: {
    backgroundColor: '#2a2a3a',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#444455',
    flexDirection: 'row', // Info on left, button on right
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  machineInfo: {
    flex: 1, // Allows info to take up available space
    marginRight: 10,
  },
  machineName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  machineDescription: {
    fontSize: 13,
    color: '#b0b0b0',
    marginBottom: 5,
  },
  machineDetail: {
    fontSize: 14,
    color: '#e0e0e0',
    marginBottom: 2,
  },
  upgradeButton: {
    backgroundColor: '#007bff', // Blue for upgrade
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  upgradeButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default styles;