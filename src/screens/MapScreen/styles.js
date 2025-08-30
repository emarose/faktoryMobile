import { StyleSheet, Dimensions } from "react-native";
import Colors from "../../constants/Colors";

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollViewContentWrapper: {
    paddingTop: 10,
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 15,
  },

  // --- Map Visualization Section Styles ---
  mapVisualContainer: {
    alignSelf: "center",
    backgroundColor: Colors.backgroundPanel,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 8,
    padding: 16,
    marginVertical: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 10,
  },
  mapGrid: {
    backgroundColor: "#0a0a15",
    position: "relative",
    overflow: "hidden",
  },
  machineIcon: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: "bold",
  },
  nodeCard: {
    backgroundColor: Colors.backgroundPanel,
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
    borderColor: Colors.accentGreen,
  },
  nodeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.accentGreen,
    marginBottom: 4,
  },
  nodeDescription: {
    color: Colors.textMuted,
    fontSize: 14,
    marginBottom: 4,
  },
  nodeCapability: {
    color: Colors.accentGold,
    fontSize: 13,
    marginBottom: 2,
  },
  requiredMachineText: {
    color: Colors.accentOrange,
    fontWeight: "bold",
  },
  assignedInfo: {
    marginTop: 6,
    marginBottom: 6,
  },
  assignedCount: {
    color: Colors.textPrimary,
    fontSize: 13,
  },
  automatedRate: {
    color: Colors.accentGreen,
    fontSize: 13,
  },
  placementActions: {
    marginTop: 10,
    flexDirection: "column",
    alignItems: "center",
  },
  mineButton: {
    backgroundColor: Colors.backgroundAccent,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginBottom: 6,
  },
  mineButtonText: {
    color: Colors.textPrimary,
    fontWeight: "bold",
    fontSize: 15,
  },
  placeButton: {
    backgroundColor: Colors.accentBlue,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginBottom: 6,
  },
  placeButtonText: {
    color: Colors.textPrimary,
    fontWeight: "bold",
    fontSize: 15,
  },
  noMachineText: {
    color: Colors.accentRed,
    fontSize: 13,
    marginTop: 4,
    textAlign: "center",
  },
  alreadyAssignedText: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 4,
    textAlign: "center",
  },
  nodeList: {
    paddingHorizontal: 4,
    marginTop: 8,
  },
  noNodesText: {
    color: Colors.textMuted,
    textAlign: "center",
    marginTop: 30,
    fontSize: 14,
  },
});

export default styles;
