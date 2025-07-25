// components/ResourceDisplay/styles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  resourceCard: {
    backgroundColor: '#2a2a3a',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#444455',
    flexDirection: 'row', // Keep info and buttons side by side
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resourceInfo: {
    flex: 1, // Allows info to take up available space
    marginRight: 10,
  },
  resourceName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#b0b0b0',
    marginBottom: 10,
  },
  resourceStats: {
    fontSize: 15,
    color: '#e0e0e0',
    marginBottom: 3,
  },
  resourceHint: {
    fontSize: 13,
    color: '#ffc107', // Warning/hint color
    fontStyle: 'italic',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'column', // Stack buttons vertically
    justifyContent: 'center',
    alignItems: 'center',
  },
  mineButton: {
    backgroundColor: '#007bff', // Blue
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 5, // Space between buttons
  },
  mineButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  placeMinerButton: {
    backgroundColor: '#28a745', // Green
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 5,
  },
  placeMinerButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  upgradeMinerButton: {
    backgroundColor: '#6c757d', // Gray
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 5,
  },
  upgradeMinerButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  // Styles for BasicResourcesScreen (if it shares this file, otherwise put in its own)
  container: {
    flex: 1,
    backgroundColor: '#1a1a2a', // Dark background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    paddingVertical: 15,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  noResourcesText: {
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
});

export default styles;