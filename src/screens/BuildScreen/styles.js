import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

const styles = StyleSheet.create({
  // Main container styles
  safeArea: {
    flex: 1,
    backgroundColor: "#2a3441", // Industrial gray-blue background like ConstructorScreen
  },
  container: {
    flex: 1,
    backgroundColor: "#2a3441",
  },

  // Scroll view
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 30,
  },

  // Machine card styles
  machineCard: {
    backgroundColor: "#1f2935",
    borderWidth: 1,
    borderColor: "#4a5866",
    backgroundColor: Colors.backgroundPanel,
    marginBottom: 16,
    padding: 16,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  lockedMachineCard: {
    backgroundColor: "#1a1f29",
    borderColor: "#3a3a3a",
    opacity: 0.8,
  },
  availableMachineCard: {
    borderColor: "#4CAF50",
    borderWidth: 2,
    backgroundColor: "#1f2935",
  },

  // Status badge
  statusBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#ff6b47",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
  },
  statusBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    marginLeft: 4,
    letterSpacing: 0.5,
  },

  // Machine header
  machineHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  machineIcon: {
    width: 48,
    height: 48,
    backgroundColor: "#3a4856",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#4a5866",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  machineIconText: {
    fontSize: 20,
    textAlign: "center",
  },
  machineInfo: {
    flex: 1,
  },
  machineName: {
    color: "#e8f4fd",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  lockedMachineName: {
    color: "#8a9aa8",
  },
  machineDescription: {
    color: "#b8c7d1",
    fontSize: 12,
    lineHeight: 18,
  },
  lockedMachineDescription: {
    color: "#6a7a88",
  },

  // Section headers
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#6db4f0",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Requirements container
  requirementsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#4a5866",
    paddingTop: 16,
    marginBottom: 16,
  },
  requirementsList: {
    marginLeft: 8,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 4,
    backgroundColor: "#2a3441",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4a5866",
  },
  requirementIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  requirementText: {
    flex: 1,
    color: "#b8c7d1",
    fontSize: 14,
    fontWeight: "500",
  },
  requirementAmount: {
    fontSize: 12,
    fontWeight: "600",
  },
  hasEnoughAmount: {
    color: "#4CAF50",
  },
  needsAmount: {
    color: "#ff6b47",
  },
  noRequirementsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#2a3441",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4CAF50",
    marginLeft: 8,
  },
  noRequirementsText: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },

  // Locked container
  lockedContainer: {
    borderTopWidth: 1,
    borderTopColor: "#4a5866",
    paddingTop: 16,
    marginBottom: 16,
  },
  lockedText: {
    color: "#8a9aa8",
    fontSize: 14,
    lineHeight: 18,
    marginLeft: 24,
    fontStyle: "italic",
  },

  // Build button
  buildButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#4a7fa7",
    borderWidth: 1,
    borderColor: "#6db4f0",
  },
  availableBuildButton: {
    backgroundColor: "#4CAF50",
    borderColor: "#66BB6A",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  lockedBuildButton: {
    backgroundColor: "#444",
    borderColor: "#666",
  },
  disabledBuildButton: {
    backgroundColor: "#666",
    borderColor: "#777",
  },
  buildButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 8,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
});

export default styles;
