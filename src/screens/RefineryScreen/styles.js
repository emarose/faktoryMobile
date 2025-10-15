import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: Colors.background,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 10,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 8,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 6,
  },
  activeTabButton: {
    backgroundColor: Colors.backgroundPanel,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 6,
    color: "#b8c7d1",
  },
  activeTabButtonText: {
    color: "#e8f4fd",
  },
  contentContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "rgba(28, 41, 56, 0.7)",
    padding: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    backdropFilter: "blur(10px)",
  },
  recipeTab: {
    flex: 1,
    padding: 10,
  },
  productionTab: {
    flex: 1,
  },
  panelHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  recipeList: {
    flex: 1,
  },
  recipeListContent: {
    paddingBottom: 20,
  },
  recipeCard: {
    backgroundColor: Colors.backgroundPanel,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  selectedRecipeCard: {
    borderColor: Colors.accentBlue,
    backgroundColor: "rgba(47, 79, 117, 0.5)",
  },
  recipeCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  recipeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  selectedRecipeCardTitle: {
    color: Colors.textPrimaryLight,
  },
  recipeCardTime: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  recipeDetails: {
    marginTop: 8,
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
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
  arrowIcon: {
    marginHorizontal: 10,
  },
  recipeDetailLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  recipeDetailText: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  recipeItemIcon: {
    width: 24,
    height: 24,
  },
  flowSection: {
    flexDirection: "row",
    backgroundColor: "rgba(28, 41, 56, 0.6)",
    borderRadius: 10,
    padding: 16,
    marginTop: 10,
    marginBottom: 16,
  },
  inputSection: {
    flex: 3,
    marginRight: 10,
  },
  outputSection: {
    flex: 3,
    marginLeft: 10,
  },
  arrowSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  flowLabel: {
    backgroundColor: "rgba(47, 79, 117, 0.5)",
    padding: 6,
    borderRadius: 5,
    marginBottom: 12,
    alignItems: "center",
  },
  flowLabelText: {
    fontSize: 12,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  inputSlots: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  outputSlots: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  resourceSlot: {
    backgroundColor: "rgba(28, 41, 56, 0.7)",
    borderRadius: 8,
    padding: 10,
    width: "45%",
    marginBottom: 8,
    marginRight: "5%",
    alignItems: "center",
  },
  slotIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(74, 127, 167, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  slotItemIcon: {
    width: 24,
    height: 24,
  },
  slotAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  slotName: {
    fontSize: 12,
    color: Colors.textPrimary,
    marginVertical: 4,
    textAlign: "center",
  },
  slotInventory: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  productionMainArea: {
    padding: 15,
  },
  machineStatusSection: {
    marginBottom: 16,
  },
  machineInfoCard: {
    backgroundColor: "rgba(28, 41, 56, 0.7)",
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
  },
  machineHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  machineIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(74, 127, 167, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  machineItemIcon: {
    width: 28,
    height: 28,
  },
  machineInfo: {
    flex: 1,
  },
  machineTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  recipeTitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  machineStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.accentGreen,
    marginRight: 6,
  },
  statusText: {
    fontSize: 13,
    color: Colors.textPrimary,
  },
  productionStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 15,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  progressSection: {
    marginBottom: 16,
  },
  controlsSection: {
    backgroundColor: "rgba(28, 41, 56, 0.7)",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  quantityControls: {
    marginBottom: 16,
  },
  controlLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  quickButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  startProductionButton: {
    backgroundColor: Colors.accentGreen,
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  startProductionButtonDisabled: {
    backgroundColor: "rgba(28, 41, 56, 0.7)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  startProductionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  startProductionButtonTextDisabled: {
    color: "#6b7885",
  },
});

export default styles;