// styles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e', // Darker background for game feel
    paddingTop: 10, // A little extra padding from the safe area top
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e0e0e0', // Light text color
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollViewContent: {
    width: '100%',
    paddingHorizontal: 15, // Padding on sides for the cards
  },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a4a', // Slightly lighter dark background for cards
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8, // Android shadow
  },
  resourceInfo: {
    flex: 1, // Takes up available space
    marginLeft: 10, // Add some left margin since there's no icon
  },
  resourceName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#c0c0c0', // Slightly dimmed text
    marginBottom: 5,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#a0a0a0', // Lighter gray for description
    marginBottom: 10,
  },
  resourceStats: {
    fontSize: 16,
    color: '#e0e0e0',
    fontWeight: '600',
  },
  mineButton: { // Renamed from extractButton for clarity
    backgroundColor: '#4CAF50', // Green button
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 15, // Space from text
  },
  mineButtonText: { // Renamed from extractButtonText
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  noResourcesText: {
    color: '#a0a0a0',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  }
});

export default styles;