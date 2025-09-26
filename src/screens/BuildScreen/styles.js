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
    paddingBottom: 40,
  },

  // Grid container
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  // Stats container
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: Colors.backgroundSecondary,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.fallback,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: "800",
    marginTop: 4,
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 2,
  },

  // Machine card styles - Compact Grid Version
  machineCard: {
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 16,
    marginBottom: 12,
    padding: 12,
    position: "relative",
    shadowColor: Colors.fallback,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    width: "48%", // Grid layout - 2 columns
    minHeight: 160,
    justifyContent: "space-between",
  },
  lockedMachineCard: {
    backgroundColor: Colors.background,
    borderColor: Colors.borderLight,
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  availableMachineCard: {
    borderColor: Colors.accentGreen,
    borderWidth: 2,
    backgroundColor: Colors.backgroundSecondary,
    shadowColor: Colors.accentGreen,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },

  // Status badge - Smaller version
  statusBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: Colors.textDanger,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
    shadowColor: Colors.textDanger,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  statusBadgeText: {
    color: Colors.textPrimary,
    fontSize: 9,
    fontWeight: "800",
    marginLeft: 2,
    letterSpacing: 0.5,
  },

  // Machine header - Compact version
  machineHeader: {
    alignItems: "center",
    marginBottom: 8,
  },
  machineIcon: {
    width: 40,
    height: 40,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
    shadowColor: Colors.fallback,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  machineIconText: {
    fontSize: 20,
    textAlign: "center",
  },
  machineInfo: {
    alignItems: "center",
  },
  machineName: {
    color: Colors.textPrimary,
    fontWeight: "700",
    fontSize: 13,
    textAlign: "center",
    letterSpacing: 0.2,
    lineHeight: 15,
  },
  lockedMachineName: {
    color: Colors.textMuted,
  },

  // Compact requirements container
  requirementsContainer: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 6,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  requirementsList: {
    // No additional margin needed
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 3,
    paddingHorizontal: 4,
    marginBottom: 2,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  requirementIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  requirementText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: "600",
  },
  requirementAmount: {
    fontSize: 10,
    fontWeight: "700",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    minWidth: 30,
    textAlign: "center",
  },
  hasEnoughAmount: {
    color: Colors.textPrimary,
    backgroundColor: Colors.accentGreen + '30',
    borderWidth: 1,
    borderColor: Colors.accentGreen,
  },
  needsAmount: {
    color: Colors.textPrimary,
    backgroundColor: Colors.textDanger + '30',
    borderWidth: 1,
    borderColor: Colors.textDanger,
  },
  noRequirementsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 6,
    backgroundColor: Colors.accentGreen + '20',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.accentGreen,
  },
  noRequirementsText: {
    color: Colors.accentGreen,
    fontSize: 10,
    fontWeight: "600",
    marginLeft: 4,
    textAlign: "center",
  },

  // Compact build button
  buildButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: Colors.backgroundAccent,
    borderWidth: 1.5,
    borderColor: Colors.accentBlue,
    shadowColor: Colors.backgroundAccent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    minHeight: 36,
  },
  availableBuildButton: {
    backgroundColor: Colors.accentGreen,
    borderColor: Colors.accentGreen,
    shadowColor: Colors.accentGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  lockedBuildButton: {
    backgroundColor: Colors.textMuted + '40',
    borderColor: Colors.textMuted,
    shadowOpacity: 0.1,
    elevation: 1,
  },
  disabledBuildButton: {
    backgroundColor: Colors.textDanger + '30',
    borderColor: Colors.textDanger,
    shadowColor: Colors.textDanger,
    shadowOpacity: 0.15,
    elevation: 2,
  },
  buildButtonText: {
    color: Colors.textPrimary,
    fontSize: 11,
    fontWeight: "700",
    marginLeft: 4,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
});

export default styles;
