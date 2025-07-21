// screens/assembly/styles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    paddingTop: 10,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e0e0e0',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
   gridContainer: {
    justifyContent: 'space-around', // Distribute items evenly
    paddingBottom: 20, // Give some space at the bottom if content goes off screen
  },
  noMachinesText: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
    paddingHorizontal: 20,
  },
  // You might remove recipeCard-specific styles from here if RecipeCard has its own style sheet
  // For example, if you move recipeCard, recipeCardAvailable, etc. to components/RecipeCard/styles.js
  // Then this file would become much smaller.
});

export default styles;