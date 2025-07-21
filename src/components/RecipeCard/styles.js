// components/RecipeCard/styles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  recipeCard: {
    backgroundColor: '#2a2a4a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 2,
  },
  recipeCardAvailable: {
    borderColor: '#4CAF50', // Green border for available recipes
  },
  recipeCardUnavailable: {
    borderColor: '#7a7a7a', // Gray border for unavailable recipes
    opacity: 0.6, // Dim unavailable recipes
  },
  recipeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#c0c0c0',
    marginBottom: 5,
  },
  recipeDescription: {
    fontSize: 13,
    color: '#a0a0a0',
    marginBottom: 10,
  },
  recipeDetails: {
    marginBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#3a3a5a',
    paddingTop: 10,
  },
  detailTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#e0e0e0',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 13,
    color: '#a0a0a0',
    marginBottom: 3,
  },
  requiredMachineText: {
    fontWeight: 'bold',
    color: '#ADD8E6', // Light blue for machine names
  },
  craftControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  craftAmountInput: {
    flex: 1,
    backgroundColor: '#3a3a5a',
    color: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#5a5a7a',
  },
  craftButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  craftButtonDisabled: {
    backgroundColor: '#5a5a7a',
  },
  craftButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default styles;