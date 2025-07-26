// screens/map/styles.js
import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  fullScreenContainer: { // New style for the SafeAreaView, allows ScrollView to take full height
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scrollViewContentWrapper: { // New style for ScrollView's contentContainerStyle
    paddingTop: 10,
    paddingHorizontal: 15,
    paddingBottom: 20, // Ensure content isn't cut off at bottom
  },
  title: {
    fontSize: 26, // Slightly smaller title
    fontWeight: 'bold',
    color: '#e0e0e0',
    textAlign: 'center',
    marginBottom: 15, // Reduced margin
  },
  // --- Map Legend Styles ---
  mapLegend: {
    backgroundColor: '#2a2a4a',
    borderRadius: 8, // Slightly less rounded
    padding: 10, // Reduced padding
    marginBottom: 15, // Reduced margin
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 }, // Smaller shadow
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  mapLegendTitle: {
    fontSize: 16, // Smaller font
    fontWeight: 'bold',
    color: '#e0e0e0',
    marginBottom: 8, // Reduced margin
    textAlign: 'center',
  },
  mapLegendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  mapLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4, // Reduced margin
    marginHorizontal: 6, // Reduced space
  },
  mapLegendColorBox: {
    width: 14, // Smaller color box
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#555',
    marginRight: 4, // Reduced margin
  },
  mapLegendText: {
    color: '#c0c0c0',
    fontSize: 12, // Smaller font
  },
  machineIconLegend: {
    fontSize: 12, // Smaller icon
    color: '#e0e0e0',
    marginRight: 4,
  },
  // --- Map Visualization Section Styles ---
  mapVisualContainer: {
    backgroundColor: '#0f0f1c',
    borderWidth: 1,
    borderColor: '#3a3a5a',
    borderRadius: 8, // Slightly less rounded
    padding: 3, // Reduced padding
    marginBottom: 20, // Reduced margin
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, // Smaller shadow
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 8,
  },
  mapGrid: {
    backgroundColor: '#0a0a15',
    position: 'relative',
    overflow: 'hidden',
  },
  mapNodeDot: {
    position: 'absolute',
    width: 12, // Smaller node dots
    height: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1, // Thinner border
    borderColor: '#ccc',
    transform: [{ translateX: -6 }, { translateY: -6 }], // Center the smaller dot
  },
  machineIcon: {
    fontSize: 10, // Smaller icon
    color: '#e0e0e0',
    fontWeight: 'bold',
  },
  // --- Grid Lines & Axis Labels ---
  gridLine: {
    position: 'absolute',
    backgroundColor: '#3a3a5a',
    opacity: 0.4, // Slightly more transparent grid lines
  },
  axisLabelX: {
    position: 'absolute',
    color: '#c0c0c0',
    fontSize: 9, // Smaller font for labels
    fontWeight: 'bold',
    backgroundColor: 'rgba(10, 10, 21, 0.7)',
    paddingHorizontal: 2, // Reduced padding
    borderRadius: 2,
  },
  axisLabelY: {
    position: 'absolute',
    color: '#c0c0c0',
    fontSize: 9, // Smaller font for labels
    fontWeight: 'bold',
    backgroundColor: 'rgba(10, 10, 21, 0.7)',
    paddingVertical: 1, // Reduced padding
    borderRadius: 2,
  },
  // --- Player Position ---
  playerPositionDot: {
    position: 'absolute',
    width: 16, // Slightly smaller player dot
    height: 16,
    borderRadius: 8,
    backgroundColor: '#00FF00',
    borderWidth: 1.5, // Thinner border
    borderColor: '#fff',
    zIndex: 100,
    transform: [{ translateX: -8 }, { translateY: -8 }], // Center the smaller dot
  },
  playerPositionLabel: {
    position: 'absolute',
    color: '#fff',
    fontSize: 10, // Smaller font
    fontWeight: 'bold',
    zIndex: 101,
  },
  // --- Resource Node List Section Styles ---
  subtitle: {
    fontSize: 20, // Slightly smaller subtitle
    fontWeight: 'bold',
    color: '#e0e0e0',
    marginTop: 15,
    marginBottom: 15,
    textAlign: 'center',
  },
  inventorySummary: {
    backgroundColor: '#2a2a4a',
    padding: 12, // Reduced padding
    borderRadius: 8,
    marginBottom: 15, // Reduced margin
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  inventoryStatus: {
    color: '#e0e0e0',
    fontSize: 15, // Slightly smaller font
    marginBottom: 4,
    fontWeight: '600',
  },
  nodeCard: {
    backgroundColor: '#2a2a4a',
    borderRadius: 8,
    padding: 12, // Reduced padding
    marginBottom: 12, // Reduced margin
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  nodeName: {
    fontSize: 18, // Slightly smaller font
    fontWeight: 'bold',
    color: '#c0c0c0',
    marginBottom: 4,
  },
  nodeDescription: {
    fontSize: 13, // Smaller font
    color: '#a0a0a0',
    marginBottom: 8,
  },
  nodeCapability: {
    fontSize: 13, // Smaller font
    color: '#90EE90',
    marginBottom: 4,
  },
  requiredMachineText: {
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  assignedInfo: {
    marginTop: 8, // Reduced margin
    paddingTop: 6, // Reduced padding
    borderTopWidth: 1,
    borderTopColor: '#4a4a6a',
  },
  assignedCount: {
    fontSize: 14, // Smaller font
    color: '#ADD8E6',
    marginBottom: 2,
  },
  automatedRate: {
    fontSize: 14, // Smaller font
    color: '#ADD8E6',
  },
  placementActions: {
    marginTop: 8,
    flexDirection: 'column',
  },
  placeButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10, // Reduced padding
    paddingHorizontal: 15,
    borderRadius: 6, // Slightly less rounded
    alignItems: 'center',
    marginBottom: 6, // Reduced space
  },
  placeButtonText: {
    color: 'white',
    fontSize: 14, // Smaller font
    fontWeight: 'bold',
  },
  mineButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 6,
  },
  mineButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noMachineText: {
    color: '#FF6347',
    fontSize: 13, // Smaller font
    textAlign: 'center',
    marginTop: 8,
  },
  alreadyAssignedText: {
    color: '#FFA07A',
    fontSize: 13, // Smaller font
    textAlign: 'center',
    marginTop: 8,
  },
  noNodesText: {
    color: '#a0a0a0',
    textAlign: 'center',
    marginTop: 30, // Reduced margin
    fontSize: 14, // Smaller font
  }
});

export default styles;