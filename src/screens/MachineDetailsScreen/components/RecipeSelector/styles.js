import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  recipesScrollView: {
    marginBottom: 8,
  },
  recipesContainer: {
    paddingBottom: 8,
    paddingTop: 4,
  },
  recipeCard: {
    backgroundColor: "#23233a",
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    minWidth: 100,
    maxWidth: 120,
    height: 100,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#444455",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedRecipeCard: {
    backgroundColor: "#4CAF50",
    borderColor: "#2e7d32",
  },
  recipeIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2c2c44",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#444455",
  },
  recipeText: {
    color: "#e0e0e0",
    fontSize: 14,
    fontWeight: "500",
  },
  selectedRecipeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  selectedIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
  }
});