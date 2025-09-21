import { StyleSheet } from "react-native";
import Colors from "../../../../constants/Colors";

const styles = StyleSheet.create({
  deployedMachinesCard: {
    width: "100%",
    backgroundColor: Colors.backgroundPanel,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: "stretch",
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#4a4a6e",
  },
  cardHeader: {
    alignItems: "center",
    marginBottom: 12,
  },
  gridItemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 8,
  },
  totalSummary: {
    alignItems: "center",
    width: "100%",
  },
  totalCount: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  totalStatusBar: {
    flexDirection: "row",
    height: 4,
    width: "80%",
    backgroundColor: "#333",
    borderRadius: 2,
    overflow: "hidden",
  },
  statusSegment: {
    height: "100%",
  },
  statusLegend: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: "#2a2a3a",
    borderRadius: 6,
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: "500",
  },
  machinesListContainer: {
    gap: 8,
  },
  individualMachineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#2a2a3a",
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#64B5F6",
  },
  machineBasicInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  machineNameContainer: {
    marginLeft: 10,
    flex: 1,
  },
  individualMachineName: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },
  machineLocation: {
    color: Colors.textMuted,
    fontSize: 10,
    marginTop: 2,
    opacity: 0.8,
  },
  machineStatusContainer: {
    alignItems: "flex-end",
    minWidth: 120,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    marginLeft: 4,
  },
  activityText: {
    color: Colors.textSecondary,
    fontSize: 11,
    textAlign: "right",
    marginBottom: 2,
    maxWidth: 120,
  },
  outputText: {
    color: "#4CAF50",
    fontSize: 10,
    textAlign: "right",
    fontWeight: "500",
    maxWidth: 120,
  },
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 6,
  },
  progressBarBackground: {
    width: 60,
    height: 4,
    backgroundColor: "#444",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressText: {
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: "600",
    minWidth: 24,
  },
  moreItemsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    marginTop: 4,
  },
  moreItemsText: {
    color: Colors.textMuted,
    fontSize: 11,
    fontStyle: "italic",
    marginLeft: 6,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 20,
  },
  noMachinesText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 8,
  },
  noMachinesSubtext: {
    color: Colors.textMuted,
    fontSize: 11,
    textAlign: "center",
    marginTop: 4,
    opacity: 0.7,
  },
});

export default styles;