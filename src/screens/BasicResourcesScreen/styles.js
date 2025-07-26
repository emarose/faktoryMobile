import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e0e0e0',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollViewContent: {
    width: '100%',
    paddingHorizontal: 15,
  },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a4a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  resourceInfo: {
    flex: 1,
    marginLeft: 10,
  },
  resourceName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#c0c0c0',
    marginBottom: 5,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#a0a0a0',
    marginBottom: 10,
  },
  resourceStats: {
    fontSize: 16,
    color: '#e0e0e0',
    fontWeight: '600',
  },
  mineButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 15,
  },
  mineButtonText: {
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