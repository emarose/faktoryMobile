import { StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

const styles = StyleSheet.create({
  resourceCardSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
    opacity: 0.7,
    minHeight: 60,
    maxHeight: 80,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundPanel,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textSecondary,
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
    backgroundColor: Colors.backgroundSecondary,
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
    color: Colors.textSecondary,
    marginBottom: 5,
  },
  resourceDescription: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 10,
  },
  resourceStats: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  mineButton: {
    backgroundColor: Colors.backgroundAccent,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 15,
  },
  mineButtonText: {
    color: Colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 15,
  },
  noResourcesText: {
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  }
});

export default styles;