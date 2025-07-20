import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1a1a2e', // Dark background
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e0e0e0',
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  buildCard: {
    backgroundColor: '#2a2a4a',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#4a4a6e',
  },
  buildItemName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#a0d911', // Greenish for items
    marginBottom: 5,
  },
  buildItemDescription: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 10,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f0f0f0',
    marginTop: 5,
  },
  requirementText: {
    fontSize: 14,
    color: '#dddddd',
    marginLeft: 10,
  },
  buildButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 15,
    alignItems: 'center',
  },
  buildButtonDisabled: {
    backgroundColor: '#555555',
  },
  buildButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noItemsText: {
    fontSize: 16,
    color: '#aaaaaa',
    textAlign: 'center',
    marginTop: 50,
  },
});
export default styles;