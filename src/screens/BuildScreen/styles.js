import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

const styles = StyleSheet.create({
  // Main container styles
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundPanel, // Industrial gray-blue background like ConstructorScreen
  },
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundPanel,
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
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    padding: 16,
    position: "relative",
    shadowColor: Colors.fallback,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  lockedMachineCard: {
    backgroundColor: Colors.background,
    borderColor: Colors.borderLight,
    opacity: 0.8,
  },
  availableMachineCard: {
    borderColor: Colors.backgroundAccent,
    borderWidth: 2,
    backgroundColor: Colors.backgroundSecondary,
  },

  // Status badge
  statusBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: Colors.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
  },
  statusBadgeText: {
    color: Colors.textPrimary,
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
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
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
    color: Colors.textPrimary,
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  lockedMachineName: {
    color: Colors.textSecondary,
  },
  machineDescription: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  lockedMachineDescription: {
    color: Colors.textTertiary,
  },

  // Section headers
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    color: Colors.textAccent,
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Requirements container
  requirementsContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
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
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  requirementIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  requirementText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: "500",
  },
  requirementAmount: {
    fontSize: 12,
    fontWeight: "600",
  },
  hasEnoughAmount: {
    color: Colors.success,
  },
  needsAmount: {
    color: Colors.error,
  },
  noRequirementsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.success,
    marginLeft: 8,
  },
  noRequirementsText: {
    color: Colors.success,
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },

  // Locked container
  lockedContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 16,
    marginBottom: 16,
  },
  lockedText: {
    color: Colors.textSecondary,
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
    backgroundColor: Colors.backgroundAccent,
    borderWidth: 1,
    borderColor: Colors.textAccent,
  },
  availableBuildButton: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  lockedBuildButton: {
    backgroundColor: Colors.backgroundTertiary,
    borderColor: Colors.textTertiary,
  },
  disabledBuildButton: {
    backgroundColor: Colors.textTertiary,
    borderColor: Colors.textSecondary,
  },
  buildButtonText: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 8,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
});

export default styles;
