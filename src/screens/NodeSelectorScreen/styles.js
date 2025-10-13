import { StyleSheet, Dimensions } from "react-native";
import Colors from '../../constants/Colors';

const { width, height } = Dimensions.get("window");

// Helper function for Android shadow implementation
const addAndroidShadow = (elevation) => ({
  elevation,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: elevation / 2 },
  shadowOpacity: 0.3,
  shadowRadius: elevation,
});

const styles = StyleSheet.create({
  // Main container styles - Satisfactory inspired
  safeArea: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    height: height,
    resizeMode: 'cover',
    opacity: 0.9,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)', // Darker semi-transparent overlay
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
    backgroundColor: 'transparent',
  },

  // Industrial panels
  industrialPanel: {
    backgroundColor: "rgba(35, 35, 35, 0.65)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    ...addAndroidShadow(6),
  },
  
  panelHeader: {
    backgroundColor: "rgba(44, 44, 44, 0.8)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.12)",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  
  panelTitle: {
    color: "#e8f4fd",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  panelContent: {
    padding: 16,
  },

  // Filter section
  filterContainer: {
    gap: 12,
  },
  filterButton: {
    backgroundColor: "rgba(35, 35, 35, 0.7)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    minWidth: 120,
  },
  filterButtonActive: {
    backgroundColor: Colors.overlay,
    borderColor: Colors.borderLight,
    borderWidth: 1,
  },
  filterButtonText: {
    color: "#b8c7d1",
    fontSize: 12,
    fontWeight: "500",
  },
  filterButtonTextActive: {
    color: "#e8f4fd",
    fontWeight: "700",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },

  // Empty state
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  noNodesText: {
    color: "#e8f4fd",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  noNodesSubtext: {
    color: "#b8c7d1",
    fontSize: 12,
    textAlign: "center",
    fontStyle: "italic",
  },

  // Node list items
  nodeItem: {
    backgroundColor: "rgba(40, 44, 52, 0.85)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 3,
    borderLeftColor: "rgba(33, 150, 243, 0.8)",
    ...addAndroidShadow(4),
  },
  nodeItemDisabled: {
    opacity: 0.6,
    borderLeftColor: Colors.textMuted,
  },
  nodeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(33, 150, 243, 0.6)",
    padding: 3,
    ...addAndroidShadow(2),
  },
  nodeInfo: {
    flex: 1,
  },
  nodeName: {
    color: "#e8f4fd",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  nodeLocation: {
    color: "#b8c7d1",
    fontSize: 12,
    marginBottom: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  locationIcon: {
    marginRight: 4,
  },

  divider: {
    color: "rgba(184, 199, 209, 0.5)",
    marginHorizontal: 6,
  },
  nodeStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statIcon: {
    marginRight: 4,
  },
  nodeAmountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  nodeAmount: {
    color: "#2196F3",
    fontSize: 12,
    fontWeight: "600",
  },
  outputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    paddingTop: 6,
  },
  outputLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  outputLabel: {
    color: "#b8c7d1",
    fontSize: 11,
    marginLeft: 4,
  },
  outputIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  outputName: {
    color: "#e8f4fd",
    fontSize: 11,
  },
  outputItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(33, 150, 243, 0.15)",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
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
    backgroundColor: "rgba(35, 35, 35, 0.6)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    ...addAndroidShadow(5),
  },
  machineIcon: {
    width: 50,
    height: 50,
    backgroundColor: "rgba(35, 35, 35, 0.8)",
    borderWidth: 2,
    borderColor: "#2196F3",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    padding: 6,
    ...addAndroidShadow(3),
  },
  machineDetails: {
    flex: 1,
  },
  machineTitle: {
    color: "#e8f4fd",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  machineSubtitle: {
    color: "#b8c7d1",
    fontSize: 12,
    marginBottom: 2,
  },
  machineStatus: {
    color: "#2196F3",
    fontSize: 12,
    fontWeight: "500",
  },
  
  // Resource icon styles
  resourceIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  filterResourceIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 8,
  },
});

export default styles;