import Colors from '../../constants/Colors';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundPanel,
    paddingTop: 10,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
   gridContainer: {
    justifyContent: 'space-around',
    paddingBottom: 20,
  },
  noMachinesText: {
    color: Colors.textMuted,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
    paddingHorizontal: 20,
  },

});

export default styles;