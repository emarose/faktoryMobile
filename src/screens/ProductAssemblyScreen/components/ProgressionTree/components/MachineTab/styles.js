import { StyleSheet } from 'react-native';
import Colors from '../../../../../../constants/Colors';

const styles = StyleSheet.create({
  machineTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  machineTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  recipeCounter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  recipeCounterText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default styles;
