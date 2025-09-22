import { StyleSheet } from "react-native";
import Colors from '../../constants/Colors';

const styles = StyleSheet.create({
  // Main container styles - Satisfactory inspired
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Header with industrial styling
  header: {
    backgroundColor: Colors.backgroundPanel,
    borderBottomWidth: 2,
    borderBottomColor: Colors.border,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
    letterSpacing: 1,
    textTransform: "uppercase",
    flex: 1,
    textAlign: "center",
  },
  backButton: {
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
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
    backgroundColor: Colors.backgroundPanel,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 4,
    marginBottom: 16,
    overflow: "hidden",
  },
  
  panelHeader: {
    backgroundColor: Colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  
  panelTitle: {
    color: Colors.textPrimary,
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
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    minWidth: 120,
  },
  filterButtonActive: {
    backgroundColor: Colors.backgroundAccent,
    borderColor: Colors.backgroundAccent,
    borderWidth: 2,
  },
  filterButtonText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: "500",
  },
  filterButtonTextActive: {
    color: Colors.textPrimary,
    fontWeight: "700",
  },

  // Empty state
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  noNodesText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  noNodesSubtext: {
    color: Colors.textMuted,
    fontSize: 12,
    textAlign: "center",
    fontStyle: "italic",
  },

  // Node list items
  nodeItem: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: Colors.backgroundAccent,
  },
  nodeItemDisabled: {
    opacity: 0.6,
    borderLeftColor: Colors.textMuted,
  },
  nodeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  nodeInfo: {
    flex: 1,
  },
  nodeName: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  nodeLocation: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginBottom: 8,
  },
  nodeStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nodeAmount: {
    color: Colors.backgroundAccent,
    fontSize: 12,
    fontWeight: "600",
  },
  nodeAmountDepleted: {
    color: Colors.textDanger,
  },
  availabilityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // Machine info card
  machineInfoCard: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  machineIcon: {
    width: 48,
    height: 48,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 2,
    borderColor: Colors.backgroundAccent,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  machineDetails: {
    flex: 1,
  },
  machineTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  machineSubtitle: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginBottom: 2,
  },
  machineStatus: {
    color: Colors.backgroundAccent,
    fontSize: 12,
    fontWeight: "500",
  },
});

export default styles;