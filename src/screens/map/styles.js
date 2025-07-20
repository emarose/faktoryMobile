// screens/map/styles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1a1a2e', // Dark background
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e0e0e0', // Light text for titles
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20, // Add some padding at the bottom
  },
  inventorySummary: {
    backgroundColor: '#3a3a5e', // Slightly lighter dark background
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#5a5a7e', // Border to define the summary card
  },
  inventoryStatus: {
    fontSize: 16,
    color: '#cccccc', // Grayish text
    marginBottom: 5,
  },
  nodeCard: {
    backgroundColor: '#2a2a4a', // Card background
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#4a4a6e', // Card border
  },
  nodeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#a0d911', // Green for node names
    marginBottom: 5,
  },
  nodeDescription: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 10,
  },
  nodeCapability: {
    fontSize: 14,
    color: '#f0f0f0',
    fontStyle: 'italic',
    marginBottom: 5,
  },
  requiredMachineText: {
    fontWeight: 'bold',
    color: '#ADD8E6', // Light blue for required machine type
  },
  assignedInfo: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#5a5a7e', // Separator line
  },
  assignedCount: {
    fontSize: 16,
    color: '#ADD8E6', // Light blue for assigned count
    fontWeight: 'bold',
  },
  automatedRate: {
    fontSize: 16,
    color: '#7FFF00', // Bright green for yield
    fontWeight: 'bold',
    marginTop: 5,
  },
  placementActions: {
    marginTop: 15,
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow buttons to wrap to next line
    justifyContent: 'space-around', // Distribute space
    gap: 10, // Spacing between buttons
  },
  placeButton: {
    backgroundColor: '#007bff', // Blue button
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    minWidth: 120, // Ensure buttons have a reasonable minimum width
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeButtonText: {
    color: '#ffffff', // White text for buttons
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noMachineText: {
    color: '#ffc107', // Amber for warnings/info
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
    width: '100%', // Take full width for centered message
  },
  noNodesText: {
    fontSize: 16,
    color: '#aaaaaa', // Gray text
    textAlign: 'center',
    marginTop: 50,
  },
});

export default styles;