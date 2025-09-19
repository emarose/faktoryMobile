import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // Main container styles - Satisfactory inspired
  safeArea: {
    flex: 1,
    backgroundColor: "#2a3441", // Industrial gray-blue background
  },
  container: {
    flex: 1,
    backgroundColor: "#2a3441",
  },
  
  // Header with industrial styling
  header: {
    backgroundColor: "#1f2935", // Darker header background
    borderBottomWidth: 2,
    borderBottomColor: "#4a5866",
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#e8f4fd", // Light blue-white text
    letterSpacing: 1,
    textTransform: "uppercase",
    flex: 1,
    textAlign: "center",
  },
  backButton: {
    backgroundColor: "#3a4856",
    borderWidth: 1,
    borderColor: "#4a5866",
    borderRadius: 4,
    padding: 10,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  headerSpacer: {
    width: 44, // Same width as back button for centering
  },
  
  // Content area
  content: {
    flex: 1,
    padding: 16,
  },

  // Industrial panels
  industrialPanel: {
    backgroundColor: "#1f2935",
    borderWidth: 1,
    borderColor: "#4a5866",
    borderRadius: 4,
    marginBottom: 16,
    overflow: "hidden",
  },
  
  panelHeader: {
    backgroundColor: "#3a4856",
    borderBottomWidth: 1,
    borderBottomColor: "#4a5866",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  
  panelTitle: {
    color: "#e8f4fd",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  
  panelContent: {
    padding: 16,
  },

  // Filter section
  filterContainer: {
    gap: 12,
  },
  filterButton: {
    backgroundColor: "#3a4856",
    borderWidth: 1,
    borderColor: "#4a5866",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    minWidth: 120,
  },
  filterButtonActive: {
    backgroundColor: "#4a7fa7",
    borderColor: "#6db4f0",
    borderWidth: 2,
  },
  filterButtonText: {
    color: "#b8c7d1",
    fontSize: 12,
    fontWeight: "500",
  },
  filterButtonTextActive: {
    color: "#e8f4fd",
    fontWeight: "700",
  },

  // Empty state
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  noNodesText: {
    color: "#b8c7d1",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  noNodesSubtext: {
    color: "#6b7885",
    fontSize: 12,
    textAlign: "center",
    fontStyle: "italic",
  },

  // Node list items
  nodeItem: {
    backgroundColor: "#2a3441",
    borderWidth: 1,
    borderColor: "#4a5866",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  nodeItemDisabled: {
    opacity: 0.6,
    borderLeftColor: "#6b7885",
  },
  nodeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 2,
    borderColor: "#4a5866",
  },
  nodeInfo: {
    flex: 1,
  },
  nodeName: {
    color: "#e8f4fd",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  nodeLocation: {
    color: "#b8c7d1",
    fontSize: 12,
    marginBottom: 8,
  },
  nodeStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nodeAmount: {
    color: "#4CAF50",
    fontSize: 12,
    fontWeight: "600",
  },
  nodeAmountDepleted: {
    color: "#ff6b6b",
  },
  availabilityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // Machine info card
  machineInfoCard: {
    backgroundColor: "#2a3441",
    borderWidth: 1,
    borderColor: "#4a5866",
    borderRadius: 6,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  machineIcon: {
    width: 48,
    height: 48,
    backgroundColor: "#3a4856",
    borderWidth: 2,
    borderColor: "#6db4f0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  machineDetails: {
    flex: 1,
  },
  machineTitle: {
    color: "#e8f4fd",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  machineSubtitle: {
    color: "#b8c7d1",
    fontSize: 12,
    marginBottom: 2,
  },
  machineStatus: {
    color: "#6db4f0",
    fontSize: 12,
    fontWeight: "500",
  },
});

export default styles;