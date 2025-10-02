import { StyleSheet } from "react-native";
import Colors from "../../../../../../constants/Colors";

const styles = StyleSheet.create({
  nodeInfoContainer: {
    backgroundColor: Colors.backgroundPanel,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  selectedNodePill: {
    backgroundColor: Colors.success,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flex: 1,
    marginRight: 12,
  },
  selectedNodePillText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  machineStatus: {
    color: Colors.success,
    fontSize: 14,
    fontWeight: "500",
  },
  nodeStatsContainer: {
    gap: 6,
  },
  nodeStatsText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: "500",
  },
  nodeLocationText: {
    color: Colors.textTertiary,
    fontSize: 12,
    fontStyle: "italic",
  },
});

export default styles;
