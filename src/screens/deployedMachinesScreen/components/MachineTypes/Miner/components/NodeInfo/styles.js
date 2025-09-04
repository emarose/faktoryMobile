import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  nodeInfoContainer: {
    backgroundColor: "#2a2a3e",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  selectedNodePill: {
    backgroundColor: "#4CAF50",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flex: 1,
    marginRight: 12,
  },
  selectedNodePillText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  machineStatus: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "500",
  },
  nodeStatsContainer: {
    gap: 6,
  },
  nodeStatsText: {
    color: "#bbb",
    fontSize: 14,
    fontWeight: "500",
  },
  nodeLocationText: {
    color: "#888",
    fontSize: 12,
    fontStyle: "italic",
  },
});

export default styles;
