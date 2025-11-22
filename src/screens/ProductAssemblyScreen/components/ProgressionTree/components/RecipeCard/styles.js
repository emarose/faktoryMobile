import { StyleSheet } from "react-native";
import Colors from "../../../../../../constants/Colors";

const styles = StyleSheet.create({
  recipeCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    borderWidth: 1.5,
    shadowColor: '#00ffff',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 5,
  },
  recipeHeader: {
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 255, 255, 0.3)',
    paddingBottom: 8,
  },
  recipeTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  recipeTitleIconContainer: {
    marginRight: 8,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: '#00ffff',
    textShadowColor: 'rgba(0, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  recipeContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  recipeInputs: {
    flex: 1,
    paddingRight: 6,
  },
  recipeArrow: {
    paddingHorizontal: 12,
  },
  arrowText: {
    fontSize: 24,
    color: '#ff00cc',
  },
  recipeOutputs: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(0, 255, 255, 0.3)',
    paddingLeft: 12,
  },
  recipeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  itemColorIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  itemIconContainer: {
    width: 20,
    height: 20,
    marginRight: 6,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  itemName: {
    fontSize: 13,
    color: '#ffffff',
    flex: 1,
  },
  itemQuantity: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginLeft: 4,
  },
});

export default styles;
