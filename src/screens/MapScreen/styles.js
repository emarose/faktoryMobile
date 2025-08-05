import { StyleSheet, Dimensions } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  scrollViewContentWrapper: {
    paddingTop: 10,
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#e0e0e0",
    textAlign: "center",
    marginBottom: 15,
  },
  // --- Map Legend Styles ---
  mapLegend: {
    backgroundColor: "#2a2a4a",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  mapLegendTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e0e0e0",
    marginBottom: 8,
    textAlign: "center",
  },
  mapLegendItems: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  mapLegendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    marginHorizontal: 6,
  },
  mapLegendColorBox: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#555",
    marginRight: 4,
  },
  mapLegendText: {
    color: "#c0c0c0",
    fontSize: 12,
  },
  machineIconLegend: {
    fontSize: 12,
    color: "#e0e0e0",
    marginRight: 4,
  },
  // --- Map Visualization Section Styles ---
  mapVisualContainer: {
    //width: screenWidth * 0.9,
    alignSelf: "center",
    backgroundColor: "#0f0f1c",
    borderWidth: 1,
    borderColor: "#3a3a5a",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 8,
  },
  mapGrid: {
    backgroundColor: "#0a0a15",
    position: "relative",
    overflow: "hidden",
  },
  mapNodeDot: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    transform: [{ translateX: -6 }, { translateY: -6 }],
  },
  machineIcon: {
    fontSize: 10,
    color: "#e0e0e0",
    fontWeight: "bold",
  },
  // --- Grid Lines & Axis Labels ---
  gridLine: {
    position: "absolute",
    backgroundColor: "#3a3a5a",
    opacity: 0.4, // Slightly more transparent grid lines
  },
  axisLabelX: {
    position: "absolute",
    color: "#c0c0c0",
    fontSize: 9, // Smaller font for labels
    fontWeight: "bold",
    backgroundColor: "rgba(10, 10, 21, 0.7)",
    paddingHorizontal: 2, // Reduced padding
    borderRadius: 2,
  },
  axisLabelY: {
    position: "absolute",
    color: "#c0c0c0",
    fontSize: 9, // Smaller font for labels
    fontWeight: "bold",
    backgroundColor: "rgba(10, 10, 21, 0.7)",
    paddingVertical: 1, // Reduced padding
    borderRadius: 2,
  },
  // --- Player Position ---
  playerPositionDot: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#00FF00",
    borderWidth: 1.5,
    borderColor: "#fff",
    zIndex: 100,
    transform: [{ translateX: -8 }, { translateY: -8 }],
  },
  playerPositionLabel: {
    position: "absolute",
    color: "#fff",
    fontSize: 10, // Smaller font
    fontWeight: "bold",
    zIndex: 101,
  },
  // --- Resource Node List Section Styles ---
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e0e0e0",
    marginTop: 15,
    marginBottom: 15,
    textAlign: "center",
  },
  inventorySummary: {
    backgroundColor: "#2a2a4a",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  inventoryStatus: {
    color: "#e0e0e0",
    fontSize: 15,
    marginBottom: 4,
    fontWeight: "600",
  },
  nodeCard: {
    backgroundColor: "#23272a",
    borderRadius: 14,
    padding: 16,
    marginVertical: 10,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#444",
  },
  nodeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#27ae60",
    marginBottom: 4,
  },
  nodeDescription: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 4,
  },
  nodeCapability: {
    color: "#f1c40f",
    fontSize: 13,
    marginBottom: 2,
  },
  requiredMachineText: {
    color: "#e67e22",
    fontWeight: "bold",
  },
  assignedInfo: {
    marginTop: 6,
    marginBottom: 6,
  },
  assignedCount: {
    color: "#fff",
    fontSize: 13,
  },
  automatedRate: {
    color: "#27ae60",
    fontSize: 13,
  },
  placementActions: {
    marginTop: 10,
    flexDirection: "column",
    alignItems: "center",
  },
  mineButton: {
    backgroundColor: "#27ae60",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginBottom: 6,
  },
  mineButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  placeButton: {
    backgroundColor: "#2980b9",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginBottom: 6,
  },
  placeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  noMachineText: {
    color: "#c0392b",
    fontSize: 13,
    marginTop: 4,
    textAlign: "center",
  },
  alreadyAssignedText: {
    color: "#aaa",
    fontSize: 13,
    marginTop: 4,
    textAlign: "center",
  },
  nodeList: {
    paddingHorizontal: 4,
    marginTop: 8,
  },
  noNodesText: {
    color: "#a0a0a0",
    textAlign: "center",
    marginTop: 30,
    fontSize: 14,
  },
});

export default styles;
