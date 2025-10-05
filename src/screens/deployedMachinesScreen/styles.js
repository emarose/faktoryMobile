import { StyleSheet } from "react-native";
import Colors from '../../constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  // Machine Type Tabs with industrial styling
  filterTabsContainer: {
    backgroundColor: Colors.backgroundPanel,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterTabsContent: {
    paddingHorizontal: 4,
    gap: 12,
  },
  machineTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    gap: 8,
    minWidth: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  machineTabActive: {
    backgroundColor: Colors.backgroundAccent,
    borderColor: Colors.backgroundAccent,
    shadowColor: Colors.backgroundAccent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  machineTabIcon: {
    fontSize: 18,
  },
  machineTabText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
  },
  machineTabTextActive: {
    color: Colors.textPrimary,
    fontWeight: 'bold',
  },
  machineTabCount: {
    fontSize: 11,
    color: Colors.textMuted,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
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
    fontWeight: '500',
    fontStyle: 'italic',
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
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: Colors.borderLight,
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
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 5,
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
    borderRadius: 5,
  },
  upgradeButtonText: {
    color: Colors.textPrimary,
    fontWeight: "bold",
    fontSize: 14,
  },
  
  // Machine icon container
  machineIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  
  // Layout helpers
  rowAlignCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowAlignCenterGap: {
    flexDirection: "row",
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
    marginBottom: 8,
  },
  
  // Spacing utilities
  marginVertical10: {
    marginVertical: 10,
  },
  
  // Buttons
  assignNodeButton: {
    backgroundColor: Colors.accentBlue,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  assignNodeText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
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
    borderRadius: 12,
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
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 6,
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
  },
  pauseResumeActive: {
    backgroundColor: Colors.accentGold,
  },
  pauseResumeIdle: {
    backgroundColor: Colors.accentGreen,
  },
  pauseResumeText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: "600",
  },
  detachButton: {
    backgroundColor: Colors.backgroundPanel,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border || "#333",
  },
  detachText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: "500",
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
  },
  pauseButton: {
    backgroundColor: Colors.accentGold,
  },
  resumeButton: {
    backgroundColor: Colors.accentGreen,
  },
  cancelButton: {
    backgroundColor: "#d32f2f",
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
});

export default styles;
