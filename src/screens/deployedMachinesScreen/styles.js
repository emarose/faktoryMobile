import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";
import { heightPercentageToDP } from "react-native-responsive-screen";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3a0242ff",
  },
  backgroundImageContainer: {
    flex: 1,
    width: "100%",
  },
  // Machine Type Tabs with industrial styling
  filterTabsContainer: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  filterTabsContent: {
    paddingHorizontal: 4,
    gap: 12,
  },
  machineTabGradient: {
    borderRadius: 10,
    padding: 2,
  },
  machineTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    gap: 8,
    minWidth: 120,
  },
  machineTabActive: {
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    borderWidth: 0,
  },
  machineTabIcon: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  machineTabText: {
    fontSize: 13,
    fontWeight: "bold",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    flex: 1,
  },
  machineTabTextActive: {
    color: Colors.textPrimary,
    fontWeight: "bold",
  },
  machineTabCount: {
    fontSize: 11,
    color: Colors.textMuted,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: "hidden",
  },
  machineTabCountActive: {
    color: Colors.textPrimary,
    backgroundColor: Colors.overlay,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 30,
  },
  emptyStateText: {
    color: Colors.textMuted,
    textAlign: "center",
    marginTop: 60,
    fontSize: 16,
    fontWeight: "500",
    fontStyle: "italic",
  },
  machineGroup: {
    marginBottom: 20,
  },
  groupTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.accentGreen,
    marginBottom: 10,
    marginLeft: 5,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    paddingBottom: 5,
  },
  machineCard: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: Colors.backgroundAccent,
    flexDirection: "column",
  },
  machineInfo: {
    flex: 1,
    marginRight: 10,
  },
  machineStatus: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginVertical: 8,
  },
  machineName: {
    fontSize: 18,
    color: Colors.textPrimary,
  },
  machineDescription: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 5,
  },
  machineDetail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  upgradeButton: {
    backgroundColor: Colors.accentBlue,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  upgradeButtonText: {
    color: Colors.textPrimary,
    fontWeight: "bold",
    fontSize: 14,
  },

  // Machine icon container
  iconContainer: {
    width: 32,
    height: 32,
    //borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },

  // Layout helpers
  rowAlignCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

  },
  rowAlignCenterGap: {
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },
  rowSpaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.borderLight,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  // Spacing utilities
  marginVertical10: {
     marginTop: 12,
  },
  machineIconContainer: {
    borderRadius: 10,
    padding: 4,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,  
  },
  // Buttons
  assignNodeButton: {
    borderRadius: 10,
    padding: 2,
  },
  assignNodeButtonInner: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    minWidth: 90,
  },
  assignNodeText: {
    textAlign: "center",
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: "bold",
  },

  // Extra info container
  extraInfoContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border || "#333",
  },

  // Selected node pill
  selectedNodePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: Colors.accentBlue,
  },
  selectedNodePillText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: "600",
  },

  // Depletion section
  depletionSection: {
    marginTop: 8,
  },
  depletionTime: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 6,
    textAlign: "center",
    fontStyle: "italic",
    opacity: 0.9,
  },

  // Control buttons
  controlButtonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  pauseResumeButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  pauseResumeActive: {
    backgroundColor: Colors.accentGold,
    borderColor: Colors.accentGold,
    shadowColor: Colors.accentGold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  pauseResumeIdle: {
    backgroundColor: Colors.accentBlue,
    borderColor: Colors.accentBlue,
    shadowColor: Colors.accentBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  pauseResumeText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: "600",
  },
  detachButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  detachText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: "500",
  },
  configureButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  // Crafting controls (for Smelter, Constructor, Foundry)
  craftingControlsContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  craftingControlButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  pauseButton: {
    backgroundColor: "#FFA726",
    borderColor: "#FFA726",
    shadowColor: "#FFA726",
  },
  resumeButton: {
    backgroundColor: Colors.accentGreen,
    borderColor: Colors.accentGreen,
    shadowColor: Colors.accentGreen,
  },
  cancelButton: {
    backgroundColor: "#EF5350",
    borderColor: "#EF5350",
    shadowColor: "#EF5350",
  },
  craftingControlText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  // Recipe info
  recipeInfo: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 6,
  },

  // Section title (used by Miner and OilExtractor cards)
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },

  // Card container (used by OilExtractor card)
  card: {
    backgroundColor: Colors.backgroundPanel || 'rgba(0, 0, 0, 0.5)',
    borderRadius: 14,
    padding: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border || '#333',
  },
});

export default styles;
