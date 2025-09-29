import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  header: {
    backgroundColor: "#2c2c2c",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#ff9800",
    shadowColor: "#ff9800",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#e8f4fd",
    textAlign: "center",
    textShadowColor: "#ff9800",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // Tab navigation styles
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#2c2c2c",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: "#3a3a3a",
    borderWidth: 1,
    borderColor: "#555",
  },
  activeTabButton: {
    backgroundColor: "#ff9800",
    borderColor: "#ff9800",
    shadowColor: "#ff9800",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#b8c7d1",
    marginLeft: 6,
  },
  activeTabButtonText: {
    color: "#e8f4fd",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },

  // Content container
  contentContainer: {
    flex: 1,
  },

  // Recipe tab styles
  recipeTab: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  panelHeader: {
    backgroundColor: "#2c2c2c",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e8f4fd",
  },
  recipeList: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  recipeListContent: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  recipeCard: {
    backgroundColor: "#2c2c2c",
    marginVertical: 6,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#444",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedRecipeCard: {
    backgroundColor: "#3a3a3a",
    borderColor: "#ff9800",
    borderWidth: 2,
    shadowColor: "#ff9800",
    shadowOpacity: 0.3,
  },
  recipeCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  recipeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#444",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e8f4fd",
    marginBottom: 4,
  },
  selectedRecipeCardTitle: {
    color: "#e8f4fd",
    textShadowColor: "#ff9800",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  recipeCardTime: {
    fontSize: 12,
    color: "#b8c7d1",
  },
  recipeDetails: {
    marginTop: 8,
  },
  recipeInputsOutputs: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  recipeInputs: {
    flex: 1,
  },
  recipeOutputs: {
    flex: 1,
    alignItems: "flex-end",
  },
  recipeDetailLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ff9800",
    marginBottom: 4,
  },
  recipeDetailText: {
    fontSize: 11,
    color: "#b8c7d1",
    marginBottom: 2,
  },
  arrowIcon: {
    marginHorizontal: 12,
  },

  // Production tab styles
  productionTab: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  productionMainArea: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  // Flow section styles
  flowSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2c2c2c",
    padding: 16,
    marginVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ff9800",
    shadowColor: "#ff9800",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  inputSection: {
    flex: 1,
    alignItems: "center",
  },
  outputSection: {
    flex: 1,
    alignItems: "center",
  },
  arrowSection: {
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  flowLabel: {
    backgroundColor: "#444",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ff9800",
  },
  flowLabelText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#ff9800",
    letterSpacing: 1,
  },
  inputSlots: {
    alignItems: "center",
  },
  outputSlots: {
    alignItems: "center",
  },
  resourceSlot: {
    alignItems: "center",
    marginVertical: 8,
    padding: 12,
    backgroundColor: "#3a3a3a",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#555",
    minWidth: 100,
  },
  slotIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  slotAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e8f4fd",
    marginBottom: 4,
  },
  slotName: {
    fontSize: 12,
    color: "#b8c7d1",
    textAlign: "center",
    marginBottom: 4,
  },
  slotInventory: {
    fontSize: 11,
    textAlign: "center",
    color: Colors.textMuted,
  },

  // Machine status section
  machineStatusSection: {
    marginVertical: 16,
  },
  machineInfoCard: {
    backgroundColor: "#2c2c2c",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#444",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  machineHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  machineIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#3a3a3a",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    borderWidth: 2,
    borderColor: "#ff9800",
  },
  machineInfo: {
    flex: 1,
  },
  machineTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e8f4fd",
    marginBottom: 2,
  },
  recipeTitle: {
    fontSize: 14,
    color: "#ff9800",
    fontWeight: "500",
  },
  machineStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: "#b8c7d1",
    fontWeight: "500",
  },
  productionStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#444",
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 11,
    color: "#b8c7d1",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ff9800",
  },

  // Progress section
  progressSection: {
    marginVertical: 12,
  },

  // Controls section
  controlsSection: {
    marginTop: 20,
    marginBottom: 40,
  },
  quantityControls: {
    backgroundColor: "#2c2c2c",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#444",
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e8f4fd",
    marginBottom: 16,
    textAlign: "center",
  },
  quantityInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    backgroundColor: "#3a3a3a",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#555",
  },
  quantityLabel: {
    fontSize: 14,
    color: "#b8c7d1",
    marginRight: 12,
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff9800",
    minWidth: 40,
    textAlign: "center",
  },
  quickButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  CraftPanel: {
    marginTop: 12,
    alignItems: "center",
  },
  startProductionButton: {
    backgroundColor: "#ff9800",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: "#ff9800",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  startProductionButtonDisabled: {
    backgroundColor: "#444",
    shadowOpacity: 0,
    elevation: 0,
  },
  startProductionButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e8f4fd",
    marginLeft: 8,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  startProductionButtonTextDisabled: {
    color: "#6b7885",
    textShadowOpacity: 0,
  },
});
